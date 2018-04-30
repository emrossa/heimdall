var sqlite = require('sqlite3');
var db = new sqlite.Database('data/optins.db');

// fired when the DB file is opened
db.on('open', function () {
    // make sure the optin table exists
    this.run('CREATE TABLE IF NOT EXISTS optins (user VARCHAR UNIQUE)');
});

module.exports = {
    // opt a user in to the program
    optIn: function (user, callback) {
        db.run('INSERT OR IGNORE INTO optins VALUES (?);', user, function (err) {
            // returns false if no changes
            // i.e. user already opted in
            callback(err, !!this.changes);
        });
    },

    // opt a user out of the program
    optOut: function (user, callback) {
        db.run('DELETE FROM optins WHERE user = ?', user, callback);
    },

    // check whether user is opted in
    isOptedIn: function (user, callback) {
        db.get('SELECT COUNT(*) as total FROM optins WHERE user = ?', user, function (err, result) {
            callback(err, result.total > 0);
        });
    }
};
