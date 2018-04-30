var SlackBot = require('slackbots');

// get Slack handle of bot in <@USERID> format
SlackBot.prototype.getHandle = function () {
    return '<@' + this.self.id + '>';
};

// rewrite postMessage to set as_user = true by default
SlackBot.prototype._postMessage = SlackBot.prototype.postMessage;
SlackBot.prototype.postMessage = function (channel, text, options) {
    if (!options) {
        options = {};
    }

    options.as_user = true;
    return this._postMessage(channel, text, options);
};

// reply function wrapper
SlackBot.prototype.reply = function (channel) {
    // this returns a function to use as a callback
    return (function (err, reply) {
        if (reply) {
            this.postMessage(channel, reply);
        }
    }).bind(this);
};

 // create a bot
var bot = new SlackBot({
    token: 'xoxb-344740608209-oL7Ff2282HwwmS2jIhNIxkB2',
    name: 'Heimdall'
});

// respond to message event
bot.on('message', function (data) {
    // must be right type of message not sent by this bot
    if (data.type == 'message' && data.text && data.user != this.self.id) {
        // check to see if this is a channel or a private message
        this.getChannels().then(function (response) {
            // if the message is in the list
            if (response.channels.filter(c => c.id == data.channel).length) {
                // only trigger if the message starts by mentioning the bot
                if (data.text.startsWith(bot.getHandle())) {
                    bot.emit('mention', data);
                }
            }
            else {
                bot.emit('im', data);
            }
        }).catch(function (error) {
            console.error('Error', error.stack);
        });
    }
});

module.exports = bot;
