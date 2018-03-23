var users = require('./users');
var cherwell = require('./cherwell');
var bot;

function locateUser(user, callback) {
    if (/^<@[A-Z0-9]+>$/.test(user)) {
        var userId = user.replace(/[<@>]/g, '');
        users.isOptedIn(userId, function (err, isOptedIn) {
            if (isOptedIn) {
                bot.getUserById(userId).then(function (slackUser) {
                    var cherwellUser = cherwell.getUserByEmail(slackUser.profile.email);
                    if (!cherwellUser) {
                        return callback(new Error('no_user'), 'I can’t find ' + user + ' in Cherwell!');
                    }

                    var devices = cherwell.getDevicesByOwner(cherwellUser);
                    if (devices.length == 0) {
                        return callback(new Error('no_devices'), 'I can’t find any devices for ' + user);
                    }

                    callback(err, 'Found device ' + devices[0].hostname + ' for user ' + user);
                });
            }
            else {
                callback(err, 'Sorry, ' + user + ' is not opted in');
            }
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
        }
    }
};

module.exports = self;
