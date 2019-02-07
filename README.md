# Dialogflow Gateway

![](https://i.imgur.com/cX6VGnJ.png)

Dialogflow Gateway, is a service, that is exposing Dialogflow gRPC API, to HTTP-Clients. Technically it is a Server, that you need to run, to make Dialogflow Web Interface (or other Software) able to connect to V2 API, since Dialogflow has removed native HTTP API from V2, replacing it with gRPC, which browsers cannot natively access, because it would require them to use Google Cloud Service Accounts to authenticate their requests, which cannot be used in Web Clients due to security issues

This is a reference implementation made in NodeJS (and Restify), but it's portable to other platforms and Serverless: Firebase, Lambda and Webtask.io and others

*Consider this software as experimental, because it is built on top of Google Cloud Crutches, though it was battle-tested by my users*

## Features

- Get information and status of the Agent
- Make requests to Dialogflow & Webhook
- Format responses in user-friendly JSON (with iteratable components, which is great for building [UIs](https://github.com/MishUshakov/dialogflow-web-v2) on top of it)
- Secure your connection endpoint

## Component Support

| Platform         | Component            | Support                                       | Reference Name      |
|------------------|----------------------|-----------------------------------------------|---------------------|
| Dialogflow       | Default              | Yes                                           | DEFAULT             |
| Webhook          | Text Reply           | Yes                                           | DEFAULT             |
|                  | Image                | Yes                                           | IMAGE               |
|                  | Card                 | Yes                                           | CARD                |
|                  | Suggestion           | Yes                                           | SUGGESTIONS         |
|                  | Payload              | Yes                                           | PAYLOAD             |
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
| Messengers       |                      | Facebook, Slack, Telegram, Kik, Viber, Skype, Line | -                   |
|                  | Text Response        | Yes                                           | DEFAULT             |
|                  | Image                | Yes                                           | IMAGE               |
|                  | Card                 | Yes                                           | CARD                |
|                  | Quick Replies        | Yes                                           | SUGGESTIONS         |
|                  | Custom Payload       | Yes                                           | PAYLOAD             |

**Using this software may cost you money. PLEASE USE CAREFULLY**

## Dialogflow Gateway as a Service

Dialogflow Gateway is a software, that you need to install and keep updated, some users don't want to get into technical stuff and have no time and interest of doing it, so we are introducing a new Plan, for people, who want it to *just work*. Fo that, we will install and service your Dialogflow Gateway in our Cloud

Some Features:

- Cost based on usage (Monthly subscription)
- Free installation, maintenance and updates (but no modifications allowed, since Dialogflow Gateway ships as-is and there are some security concerns)
- 99.95% Uptime SLA with fixed URL and dedicated IP
- Monthly analytics and usage reports of your endpoint (as E-Mail, CSV, JSON)

Interested? [Contact me, to get a quote](https://i.ushakov.co/#/contact)

## Demo Time

I use [REST Client for VSCode](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to make requests. You can execute these demos in `extras/test.http`

We will use my Dialogflow Test Gateway

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

# Installation

## GETTING SERVICE ACCOUNT

Go to [Google Cloud IAM (Google Cloud Indian Access Manager)](https://console.cloud.google.com/iam-admin/serviceaccounts/create)

And follow my Visual Guide:

![](https://i.imgur.com/h727zeB.png)
![](https://i.imgur.com/oKcNN3e.png)
![](https://i.imgur.com/uOmOanP.png)
![](https://i.imgur.com/lyYWgWP.png)
![](https://i.imgur.com/KQBYWuf.png)

Now you are ready to go. 

#### Rename your downloaded file to `service_account.json` and follow the instructions below

## CLONE THIS REPOSITORY

```
git clone https://github.com/MishUshakov/dialogflow-gateway.git
```

Or just `Download ZIP` and unpack it

Place your `service_account.json` in **this** directory

Run `npm install` or `yarn` **in this folder**

Run `node index.js` **in this folder**

When you see this message, you are ready to go: 

```
Dialogflow Gateway is listening at http://[::]:8090
```