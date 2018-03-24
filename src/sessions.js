var relativeDate = require('relative-date');

var routers = require('../data/routers.json');
var devices = require('../data/stub/devices.json');

function Session(data) {
    this.data = data;
}

Session.prototype.getRelativeTime = function () {
    return relativeDate(this.data.time);
};

Session.prototype.getRouter = function () {
    return this.data.router;
}

Session.prototype.getDevice = function () {
    return this.data.device;
}

function Generator(devices, routers, minDelay, maxDelay) {
    this.devices = devices;
    this.routers = routers;
    this.sessions = [];

    this.loop(minDelay, maxDelay, this.generate.bind(this));
}

Generator.prototype.rand = function (array) {
    return array[Math.floor((Math.random() * array.length))];
};

Generator.prototype.generate = function () {
    var session = {
        device: this.rand(this.devices).macAddress,
        router: this.rand(this.routers).hostname,
        time:   new Date()
    };

    console.log(session.time + ': ' + session.device + ' on ' + session.router);
    this.sessions.push(new Session(session));
};

Generator.prototype.loop = function (min, max, callback) {
    (function loop() {
        var rand = Math.round(Math.random() * (max - min)) + min;
        setTimeout(function() {
            callback();
            loop();
        }, rand);
    }());
};

var generator = new Generator(devices, routers, 15000, 120000);

module.exports = {
    getLatest: function (macAddress) {
        var deviceSessions = generator.sessions.filter(e => e.getDevice() == macAddress);
        return deviceSessions[deviceSessions.length - 1];
    }
};
