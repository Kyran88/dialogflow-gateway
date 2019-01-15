# Getting Started (Using Firebase)

First of all install Firebase CLI (if you don't have it yet)

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

**REPLACE** your function's `index.js` with `index.js` from **this folder**

[Get your service keys](https://github.com/MishUshakov/dialogflow-gateway#getting-service-account) and place it under `functions/`

Deploy your Gateway with `firebase deploy --only functions`

Check the health by opening the URL, firebase provided to you and try to make a request like on the example above

## Known issues

- Sometimes it returns 500 on cold start (Google's issue). NOTE: the Google Cloud Function timeout is 60s. If your webhook needs longer, then you have to deploy it with --timeout flag
- If it returns 429, enable billing or wait. It's not your problem as well, Google just wants to earn some ca$h on rps (requests per second)