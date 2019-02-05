# Dialogflow Gateway

![](https://i.imgur.com/cX6VGnJ.png)

*The official "Dialogflow Gateway" logo represents a black hole, which is the first thing you think about, when starting using dialogflow*

Dialogflow Gateway, is a service, that is exposing Dialogflow gRPC API, to HTTP-Clients. Technically it is a Serverless Function, that you need to run as a backend, to make Dialogflow Web Interface (or other Software) able to connect to V2 API, since Dialogflow has removed native HTTP API from V2, replacing it by gRPC, which browsers cannot natively access, because it would require them, to use Google Cloud Service Accounts to authenticate their requests, which cannot be used in Web Clients due to security issues

This is a reference implementation made in NodeJS (and Restify), but it's portable to Serverless: Firebase, Lambda and Webtask.io and others

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

## Demo Time

I use [REST Client for VSCode](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to make requests. You can execute these demos in `extras/test.http`

We will use my Dialogflow Test Gateway, which is running on top of Google Cloud Functions

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