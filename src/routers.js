var ord = require('ordinal');
var routers = require('../data/routers.json');

function Router(data) {
    this.data = data;
}

Router.prototype.getName = function () {
    if (!this.data || !this.data.name) {
        return this.data.hostname;
    }

    return this.data.name +
        ' on the ' + ord(this.data.floor) +
        ' floor of ' + this.data.building;
}

module.exports = {
    get: function (hostname) {
        var data = routers.filter(r => r.hostname == hostname);
        return new Router(data[0] || {hostname: hostname});
    }
}
