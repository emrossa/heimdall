var devices = require('../data/stub/devices.json');
var users = require('../data/stub/users.json');

module.exports = {
    getDevicesByOwner: function (owner) {
        return devices.filter(d => d.owner == owner.id);
    },

    getUserByEmail: function (email) {
        return users.filter(u => u.emailAddress == email)[0];
    }
};
