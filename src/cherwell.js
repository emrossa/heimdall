var devices = [{
    hostname: 'SBGML011111',
    macAddress: '4C:32:75:8B:88:25',
    owner: 123456
}];

var users = [{
    name: 'Emilia Lewandowska',
    emailAddress: 'emrossa@gmail.com',
    id: 123456
}];

module.exports = {
    getDevicesByOwner: function (owner) {
        return devices.filter(d => d.owner == owner.id);
    },

    getUserByEmail: function (email) {
        return users.filter(u => u.emailAddress == email)[0];
    }
};
