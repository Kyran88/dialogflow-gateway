# Dialogflow Gateway

![](https://i.imgur.com/cX6VGnJ.png)

*The official "Dialogflow Gateway" logo represents a black hole, which is the first thing you think about, when starting using dialogflow*

Dialogflow Gateway, is a service, that is exposing Dialogflow gRPC API, to HTTP-Clients. Technically it is a Serverless Function, that you need to run as a backend, to make Dialogflow Web Interface (or other Software) able to connect to V2 API, since Dialogflow has removed native HTTP API from V2, replacing it by gRPC, which browsers cannot natively access, because it would require them, to use Google Cloud Service Accounts to authenticate their requests, which cannot be used in Web Clients due to security issues

We will use firebase functions to deploy it, but you can port it to Express, Amazon Lambda and Webtask.io for sure

It's also compatible with Kubeless

*Consider this software as experimental, because it is built on top of Google Cloud Crutches, though it was battle-tested by my users*

## Features

- Get information and status of the Agent
- Make requests to Dialogflow & Webhook
- Format responses in user-friendly JSON
- Secure your connection endpoint

## Known issues

- Sometimes it returns 500 on cold start (Google's issue). NOTE: the Google Cloud Function timeout is 60s. If your webhook needs longer, then you have to deploy it with --timeout flag
- If it returns 429, enable billing or wait. It's not your problem as well, Google just wants to earn some ca$h on rps (requests per second)

## Component Support

| Platform         | Component            | Support                                       | Reference Name      |
|------------------|----------------------|-----------------------------------------------|---------------------|
| Dialogflow       | Default              | Yes                                           | DEFAULT             |
| Webhook          | Text Reply           | Yes                                           | DEFAULT             |
|                  | Image                | Yes                                           | IMAGE               |
|                  | Card                 | Yes                                           | CARD                |
|                  | Suggestion           | Yes                                           | SUGGESTIONS         |
| Google Assistant | Simple Response      | Yes                                           | SIMPLE_RESPONSE     |
|                  | Basic Card           | Yes                                           | CARD                |
|                  | List                 | Limited (subtitles are not returned by API)   | LIST                |
|                  | Suggestion Chips     | Yes                                           | SUGGESTIONS         |
|                  | Carousel Card        | Limited (some fields are not returned by API) | CAROUSEL_CARD       |
|                  | Browse Carousel Card | No (not returned by API)                      | -                   |   
|                  | Link out suggestion  | Yes                                           | LINK_OUT_SUGGESTION |
|                  | Media content        | No (not returned by API)                      | -                   |
|                  | Custom Payload       | Yes                                           | PAYLOAD             |
|                  | Table Card           | No (not returned by API)                      | -                   |
| Others           |                      | Not yet                                       | -                   |

**Using this software may cost you money. PLEASE USE CAREFULLY**

## Demo Time

I use [REST Client for VSCode](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to make requests. You can execute these demos in `extras/test.http` too

Getting Agent information

```http
GET https://us-central1-dialogflow-web-v2.cloudfunctions.net/gateway
```

Detect Intent (no formatting)

```http
POST https://us-central1-dialogflow-web-v2.cloudfunctions.net/gateway
Content-Type: application/json

{
    "q": "Hi",
    "session_id": "test",
    "lang": "en"
}
```

Detect Intent (with formatting)

```http
POST https://us-central1-dialogflow-web-v2.cloudfunctions.net/gateway?format=true
Content-Type: application/json

{
    "q": "Hi",
    "session_id": "test",
    "lang": "en"
}
```

## Getting Started (Using Firebase)

First of all install Firebase CLI

```
npm install -g firebase-tools
```

Or if you prefer yarn

```
yarn global add firebase-tools
```

Then login using and follow the instructions

```
firebase login
```

Create an empty directory and execute

```
firebase init
```

Using arrow keys go to `Functions` and press **Spacebar** and then commit it with **Enter**

Select your project associated with your dialogflow agent using arrow keys and commit it with **Enter**

Then once again press **Enter** (the arrow should point on "JavaScript")

Then press **N** (case-sensetive) on your keyboard and commit it with **Enter**

Then press **Y** (case-sensetive) on your keyboard and commit it with **Enter**

Wait a second, when download is complete it should say `✔ Firebase initialization complete!`

`cd` into the `functions/` directory and install dialogflow

```
npm install --save dialogflow
```

Or if you prefer yarn

```
yarn add dialogflow
```

#### CLONE THIS REPOSITORY

```
git clone https://github.com/MishUshakov/dialogflow-gateway.git
```

Or just `Download ZIP` and unpack it

**REPLACE** function's `index.js` with `index.js` from **this** repository

#### GETTING SERVICE ACCOUNT

Go to [Google Cloud IAM (Google Cloud Indian Access Manager)](https://console.cloud.google.com/iam-admin/serviceaccounts/create)

And follow my Visual Guide:

![](https://i.imgur.com/h727zeB.png)
![](https://i.imgur.com/oKcNN3e.png)
![](https://i.imgur.com/uOmOanP.png)
![](https://i.imgur.com/lyYWgWP.png)
![](https://i.imgur.com/KQBYWuf.png)

Now you are ready to go. Rename your keys file to `service_account.json` and move it to the `functions/` directory (where your `index.js` is)

Deploy your Gateway with `firebase deploy --only functions`

Check the health by opening the URL, firebase provided to you and try to make a request like on the example above