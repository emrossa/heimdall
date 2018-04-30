var util = require('util');
var users = require('./users');
var cherwell = require('./cherwell');
var routers = require('./routers');
var sessions = require('./sessions');
var bot;

// main function to locate the user
function locateUser(user, callback) {
    // check if user ID is in correct format
    if (!/^<@[A-Z0-9]+>$/.test(user)) {
        return callback(new Error('invalid_user'), '“' + user + '” is not a user');
    }

    // check if the user is opted in
    var userId = user.replace(/[<@>]/g, '');
    users.isOptedIn(userId, function (err, isOptedIn) {
        if (err) {
            return callback(err);
        }

        if (!isOptedIn) {
            return callback(err, 'Sorry, ' + user + ' is not opted in');
        }

        // get the user details from slack
        bot.getUserById(userId).then(function (slackUser) {
            // look up the slack user in Cherwell
            var cherwellUser = cherwell.getUserByEmail(slackUser.profile.email);
            if (!cherwellUser) {
                return callback(new Error('no_user'), 'I can’t find ' + user + ' in Cherwell!');
            }

            // get the devices for this user
            var devices = cherwell.getDevicesByOwner(cherwellUser);
            if (devices.length == 0) {
                return callback(new Error('no_devices'), 'I can’t find any devices for ' + user);
            }

            // only check the first device on the access points
            // @todo what should be done if there is more than one device
            var session = sessions.getLatest(devices[0].macAddress);
            if (!session) {
                return callback(new Error('no_events'), 'I haven’t seen ' + user);
            }

            // reply with the location and time
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

// opt in a user to the program
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

// opt a user out of the program
function optOut(user, callback) {
    users.optOut(user, function (err) {
        callback(err, 'OK, you’re opted out!');
    });
}

module.exports = {
    // main messages handler
    handle: function (text, data, handleBot) {
        var words = text.split(' ');
        bot = handleBot;

        // check the first word of the message (the command)
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
                // unknown command
                bot.postMessage(data.channel, 'Sorry, I don’t understand! Try asking for `help`.');
        }
    }
};
