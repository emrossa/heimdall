var bot = require('./src/bot');
var messages = require('./src/messages');

bot.on('mention', function (data) {
    var text = data.text.replace(bot.getHandle(), '').trim();
    messages.handle(text, data, bot);
});

bot.on('im', function (data) {
    messages.handle(data.text, data, bot);
});
