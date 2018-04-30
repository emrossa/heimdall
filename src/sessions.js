var relativeDate = require('relative-date');

var routers = require('../data/routers.json');
var devices = require('../data/stub/devices.json');

// session class
function Session(data) {
    this.data = data;
}

// time of event relative to now (e.g. "5 minutes ago")
Session.prototype.getRelativeTime = function () {
    return relativeDate(this.data.time);
};

// get the router that the event was seen at
Session.prototype.getRouter = function () {
    return this.data.router;
}

// get the device that the event was recorded for
Session.prototype.getDevice = function () {
    return this.data.device;
}

// generator class for stub events
// randomly fires events for devices and routers
function Generator(devices, routers, minDelay, maxDelay) {
    this.devices = devices;
    this.routers = routers;
    this.sessions = [];

    // start a loop to generate events
    this.loop(minDelay, maxDelay, this.generate.bind(this));
}

// get a random element of an array (device or router)
Generator.prototype.rand = function (array) {
    return array[Math.floor((Math.random() * array.length))];
};

// generate a single event
Generator.prototype.generate = function () {
    var session = {
        device: this.rand(this.devices).macAddress,
        router: this.rand(this.routers).hostname,
        time:   new Date()
    };

    console.log(session.time + ': ' + session.device + ' on ' + session.router);
    this.sessions.push(new Session(session));
};

// loop function, calling a callback randomly between 2 delays
Generator.prototype.loop = function (min, max, callback) {
    (function loop() {
        var rand = Math.round(Math.random() * (max - min)) + min;
        setTimeout(function() {
            callback();
            loop();
        }, rand);
    }());
};

// set up generator between 15 sec and 2 mins
var generator = new Generator(devices, routers, 15000, 120000);

module.exports = {
    // get the latest event seen for a MAC address
    getLatest: function (macAddress) {
        var deviceSessions = generator.sessions.filter(e => e.getDevice() == macAddress);
        return deviceSessions[deviceSessions.length - 1];
    }
};
