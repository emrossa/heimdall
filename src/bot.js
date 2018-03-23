var SlackBot = require('slackbots');

SlackBot.prototype.getHandle = function () {
    return '<@' + this.self.id + '>';
};

SlackBot.prototype._postMessage = SlackBot.prototype.postMessage;
SlackBot.prototype.postMessage = function (channel, text, options) {
    if (!options) {
        options = {};
    }

    options.as_user = true;
    return this._postMessage(channel, text, options);
};

SlackBot.prototype.reply = function (channel) {
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

bot.on('message', function (data) {
    if (data.type == 'message' && data.text) {
        this.getChannels().then(function (response) {
            if (response.channels.filter(c => c.id == data.channel).length) {
                if (data.text.startsWith(bot.getHandle())) {
                    bot.emit('mention', data);
                }
            }
            else {
                bot.emit('im', data);
            }
        });
    }
});

module.exports = bot;
