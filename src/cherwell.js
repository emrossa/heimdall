var devices = require('../data/stub/devices.json');
var users = require('../data/stub/users.json');

module.exports = {
    // filter list of devices by user ID
    // returns an array of devices
    getDevicesByOwner: function (owner) {
        return devices.filter(d => d.owner == owner.id);
    },

    // search for user by their email address
    // returns a single user if found
    getUserByEmail: function (email) {
        return users.filter(u => u.emailAddress == email)[0];
    }
};
