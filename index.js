var SlackBot = require('slackbots');

var bot = new SlackBot({
    token: 'xoxb-344740608209-oL7Ff2282HwwmS2jIhNIxkB2',
    name: 'Heimdall'
});

bot.on('start', function() {
    console.log('Bot started');
    bot.postMessageToChannel('general', 'Hello!', {as_user: true});
});
