var SlackBot = require('slackbots');

var bot = new SlackBot({
    token: 'xoxb-344740608209-oL7Ff2282HwwmS2jIhNIxkB2',
    name: 'Heimdall'
});

var sqlite = require('sqlite3');
var db = new sqlite.Database('optins.db');

function getBotHandle() {
    return '<@' + bot.self.id + '>';
}

function handlePublic(data) {
    var text = data.text.replace(getBotHandle(), '').trim();
    handleMessage(text, data);
}

function handlePrivate(data) {
    handleMessage(data.text, data);
}

function handleMessage(text, data) {
    var words = text.split(' ');

    switch (words[0]) {
        case 'locate':
            locateUser(words[1], data.channel);
            break;

        case 'optin':
            optIn(data.user, data.channel);
            break;

        case 'optout':
            optOut(data.user, data.channel);
            break;
    }
}

function locateUser(user, channel) {
    if (/^<@[A-Z0-9]+>$/.test(user)) {
        isOptedIn(user, function (isOptedIn) {
            if (isOptedIn) {
                postMessage(channel, 'OK, going to locate ' + user);
            }
            else {
                postMessage(channel, 'Sorry, ' + user + ' is not opted in');
            }
        });
    }
    else {
        postMessage(channel, '"' + user + '" is not a user');
    }
}

function isOptedIn(user, callback) {
    db.get('SELECT COUNT(*) as total FROM optins WHERE user = ?', user.replace(/[<@>]/g, ''), function (err, result) {
        callback(result.total > 0);
    })
}

function optIn(user, channel) {
    isOptedIn(user, function (isOptedIn) {
        if (!isOptedIn) {
            db.run('INSERT INTO optins VALUES (?);', user, function () {
                postMessage(channel, 'OK, you’re opted in!');
            });
        }
        else {
            postMessage(channel, 'You’re already opted in!');
        }
    });
}

function optOut(user, channel) {
    db.run('DELETE FROM optins WHERE user = ?', user, function () {
        postMessage(channel, 'OK, you’re opted out!');
    });
}

function postMessage(channel, text) {
    bot.postMessage(channel, text, {as_user: true});
}

bot.on('start', function() {
    db.run('CREATE TABLE IF NOT EXISTS optins (user TEXT)');
});

bot.on('message', function (data) {
    if (data.type == 'message' && data.text) {
        var message = data.message || data;

        bot.getChannels().then(function (response) {
            if (response.channels.filter(c => c.id == data.channel).length) {
                if (data.text.startsWith(getBotHandle())) {
                    handlePublic(message);
                }
            }
            else {
                handlePrivate(message);
            }
        });
    }
});
