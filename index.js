const dialogflow = require('dialogflow')
const serviceAccount = require('./service_account.json')  // <-- change service_account to yours

/* AgentsClient retrieves information about the agent */

const agentsClient = new dialogflow.AgentsClient({
    credentials: { // <-- Initialize with service account
        private_key: serviceAccount.private_key,
        client_email: serviceAccount.client_email
    }
})

/* SessionsClient makes text requests */

const sessionClient = new dialogflow.SessionsClient({
    credentials: { // <-- Initialize with service account
        private_key: serviceAccount.private_key,
        client_email: serviceAccount.client_email
    }
})

/* We need to set this headers, to make our HTTP calls possible */

let headers = {
    'Content-Type':'application/json',
    'Access-Control-Allow-Headers': 'Content-Type, Cache-Control',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*'
}

gateway = (req, res) => {
    /* On GET request return the information about the agent */

    if(req.method == "GET"){
        agentsClient.getAgent({parent: 'projects/' + serviceAccount.project_id}, {}, (err, agent) => {
            if (err){
                res.set(headers)
                res.send(500, err.message)
            }

            else {
                res.set(headers)
                res.send(agent)
            }
        })
    }

    /* Detect Intent (send a query to dialogflow) */

    else if(req.method == "POST"){

        /* If no body, session, query, or lang, return 400 */

        if(!req.body || !req.body.session_id || !req.body.q || !req.body.lang){
            res.set(headers)
            res.send(400)
        }

        /* Prepare dialogflow request */

        else {
            let session_id = req.body.session_id
            let q = req.body.q
            let lang = req.body.lang

            let sessionPath = sessionClient.sessionPath(serviceAccount.project_id, session_id)
            let request = {
                session: sessionPath,
                queryInput: {
                    text: {
                        text: q,
                        languageCode: lang
                    }
                }
            }
            
            /* Send our request to Dialogflow */

            sessionClient.detectIntent(request).then(responses => {
                
                /* If the response should be formatted (?format=true), then return the format the response */

                if(req.query.format == "true"){
                    let fulfillment = responses[0].queryResult.fulfillmentMessages

                    /* Base of formatted response */

                    let formatted = {
                        id: responses[0].responseId,
                        action: responses[0].queryResult.action,
                        query: responses[0].queryResult.queryText,
                        params: responses[0].queryResult.parameters,
                        diagnosticInfo: responses[0].queryResult.diagnosticInfo,
                        components: []
                    }

                    /* Iterate through components and add them to components list */

                    for(let component in fulfillment){

                        /* Recognize Dialogflow and Webhook components */

                        if(fulfillment[component].platform == "PLATFORM_UNSPECIFIED"){
                            if(fulfillment[component].text){

                                /* Default/Webhook Text */
                                formatted.components.push({name: "DEFAULT", content: fulfillment[component].text.text[0]})
                            }

                            if(fulfillment[component].card){

                                /* Convert Webhook Card to Actions on Google Card (to follow a common format) */

                                let google_card = {
                                    title: fulfillment[component].card.title,
                                    formattedText: fulfillment[component].card.subtitle,
                                    image: {
                                        imageUri: fulfillment[component].card.imageUri,
                                        accessibilityText: 'Card Image'
                                    },
                                    buttons: [{
                                        title: fulfillment[component].card.buttons[0].text,
                                        openUriAction: {
                                            uri: fulfillment[component].card.buttons[0].postback
                                        }
                                    }]
                                }

                                formatted.components.push({name: "CARD", content: google_card})
                            }

                            if(fulfillment[component].image){
                                /* Image component (Webhook) */
                                formatted.components.push({name: "IMAGE", content: fulfillment[component].image})
                            }

                            if(fulfillment[component].quickReplies){
                                /* Suggestions */
                                formatted.components.push({name: "SUGGESTIONS", content: fulfillment[component].quickReplies.quickReplies})
                            }
                        }

                        /* Recognize Actions on Google components */

                        if(fulfillment[component].platform == "ACTIONS_ON_GOOGLE"){
                            if(fulfillment[component].simpleResponses){
                                /* Simple Response */
                                formatted.components.push({name: "SIMPLE_RESPONSE", content: fulfillment[component].simpleResponses.simpleResponses[0]})
                            }
                            
                            if(fulfillment[component].basicCard){
                                /* Card */
                                formatted.components.push({name: "CARD", content: fulfillment[component].basicCard})
                            }

                            if(fulfillment[component].listSelect){
                                /* List */
                                formatted.components.push({name: "LIST", content: fulfillment[component].listSelect})
                            }

                            if(fulfillment[component].suggestions){
                                /* Convert Google Suggestions to text-only suggestions (like the webhook quick-replies) */
                                let suggestions = fulfillment[component].suggestions.suggestions.map(suggestion => suggestion.title)
                                formatted.components.push({name: "SUGGESTIONS", content: suggestions})
                            }

                            if(fulfillment[component].linkOutSuggestion){
                                /* Link out suggestion */
                                formatted.components.push({name: "LINK_OUT_SUGGESTION", content: fulfillment[component].linkOutSuggestion})
                            }

                            if(fulfillment[component].payload){
                                /* Payload */
                                formatted.components.push({name: "PAYLOAD", content: fulfillment[component].payload})
                            }

                            if(fulfillment[component].carouselSelect){
                                /* Carousel Card */
                                formatted.components.push({name: "CAROUSEL_CARD", content: fulfillment[component].carouselSelect.items})
                            }
                        }
                    }

                    res.set(headers)
                    res.send(formatted)
                }

                else {
                    res.set(headers)
                    res.send(responses[0])
                }
            })
            .catch(err => {
                res.set(headers)
                res.send(500, err.message)
            })
        }
    }

    /* Pass pre-flight HTTP check */

    else if(req.method == 'OPTIONS') {
        res.set(headers)
        res.send(200)
    }

    /* Send 404 on undefined method */

    else {
        res.set(headers)
        res.send(404)
    }
}

const restify = require('restify')
let server = restify.createServer()

server.get('/', gateway)
server.post('/', gateway)
server.opts('/', gateway)

server.use(restify.plugins.bodyParser())
server.use(restify.plugins.queryParser())

server.listen(8080, () => {
    console.log('Dialogflow Gateway is listening at %s', server.url)
})