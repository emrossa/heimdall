var util = require('util');
var users = require('./users');
var cherwell = require('./cherwell');
var routers = require('./routers');
var sessions = require('./sessions');
var bot;

function locateUser(user, callback) {
    if (/^<@[A-Z0-9]+>$/.test(user)) {
        var userId = user.replace(/[<@>]/g, '');
        users.isOptedIn(userId, function (err, isOptedIn) {
            if (err) {
                return callback(err);
            }

            if (!isOptedIn) {
                return callback(err, 'Sorry, ' + user + ' is not opted in');
            }

            bot.getUserById(userId).then(function (slackUser) {
                var cherwellUser = cherwell.getUserByEmail(slackUser.profile.email);
                if (!cherwellUser) {
                    return callback(new Error('no_user'), 'I can’t find ' + user + ' in Cherwell!');
                }

                var devices = cherwell.getDevicesByOwner(cherwellUser);
                if (devices.length == 0) {
                    return callback(new Error('no_devices'), 'I can’t find any devices for ' + user);
                }

                var session = sessions.getLatest(devices[0].macAddress);
                if (!session) {
                    return callback(new Error('no_events'), 'I haven’t seen ' + user);
                }

                callback(null, util.format(
                    'I last saw %s %s at %s',
                    user,
                    session.getRelativeTime(),
                    routers.get(session.getRouter()).getName()
                ));
            }).catch(function (error) {
                console.error('Error', error);
            });
        });
    }
    else {
        callback(new Error('invalid_user'), '“' + user + '” is not a user');
    }
}

function optIn(user, callback) {
    users.optIn(user, function (err, userAdded) {
        if (userAdded) {
            callback(err, 'OK, you’re opted in!');
        }
        else {
            callback(err, 'You’re already opted in!');
        }
    });
}

function optOut(user, callback) {
    users.optOut(user, function (err) {
        callback(err, 'OK, you’re opted out!');
    });
}

var self = {
    handle: function (text, data, handleBot) {
        var words = text.split(' ');
        bot = handleBot;

        switch (words[0]) {
            case 'locate':
                locateUser(words[1], bot.reply(data.channel));
                break;

            case 'optin':
                optIn(data.user, bot.reply(data.channel));
                break;

            case 'optout':
                optOut(data.user, bot.reply(data.channel));
                break;

            case 'help':
                bot.postMessage(data.channel, [
                    'Here is a list of commands:',
                    '• `locate @user`: If that user is opted in, I’ll tell you where I last saw them.',
                    '• `optin` / `optout`: Choose whether I keep an eye on you.'
                ].join('\n'));

                break;

            default:
                bot.postMessage(data.channel, 'Sorry, I don’t understand! Try asking for `help`.');
        }
    }
};

module.exports = self;
