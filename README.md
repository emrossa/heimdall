# Heimdall Slack bot

This is a Slack bot created for my final year university project. It can be used to report a user's location on an office network where the wireless access points report event data.

## How to set up

* You need a running instance of Slack in order to connect the bot. You then need to add a new bot configuration using the Slack bots configuration (https://my.slack.com/apps/new/A0F7YS25R-bots).
* Download or clone the source code.
* In the project's root directory, run `npm install` to set up the project dependencies.
* Edit the `src/bot.js` file to use the API token and name from your configuration.
* Run `npm start` to start the bot running.

## How to test

There are tests in the `test` directory - you can run them with `npm test`.
