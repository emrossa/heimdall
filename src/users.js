var sqlite = require('sqlite3');
var db = new sqlite.Database('data/optins.db');

db.on('open', function () {
    this.run('CREATE TABLE IF NOT EXISTS optins (user VARCHAR UNIQUE)');
});

var self = {
    optIn: function (user, callback) {
        db.run('INSERT OR IGNORE INTO optins VALUES (?);', user, function (err) {
            callback(err, !!this.changes);
        });
    },

    optOut: function (user, callback) {
        db.run('DELETE FROM optins WHERE user = ?', user, callback);
    },

    isOptedIn: function (user, callback) {
        db.get('SELECT COUNT(*) as total FROM optins WHERE user = ?', user, function (err, result) {
            callback(err, result.total > 0);
        });
    }
};

module.exports = self;
