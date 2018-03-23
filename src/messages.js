var users = require('./users');

function locateUser(user, callback) {
    if (/^<@[A-Z0-9]+>$/.test(user)) {
        users.isOptedIn(user.replace(/[<@>]/g, ''), function (err, isOptedIn) {
            if (isOptedIn) {
                callback(err, 'OK, going to locate ' + user);
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
    handle: function (text, data, callback) {
        var words = text.split(' ');

        switch (words[0]) {
            case 'locate':
                locateUser(words[1], callback);
                break;

            case 'optin':
                optIn(data.user, callback);
                break;

            case 'optout':
                optOut(data.user, callback);
                break;
        }
    }
};

module.exports = self;
