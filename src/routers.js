var ord = require('ordinal');
var routers = require('../data/routers.json');

// Router class
function Router(data) {
    this.data = data;
}

// get the detailed name of the router
Router.prototype.getName = function () {
    if (!this.data || !this.data.name) {
        return this.data.hostname;
    }

    return this.data.name +
        ' on the ' + ord(this.data.floor) +
        ' floor of ' + this.data.building;
}

module.exports = {
    // get a router by its hostname
    get: function (hostname) {
        // filter by hostname
        var data = routers.filter(r => r.hostname == hostname);
        // if router not found, use a default name
        return new Router(data[0] || {hostname: hostname});
    }
}
