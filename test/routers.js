var assert = require('assert');
var routers = require('../src/routers');

describe('Routers', function () {
    it('should return a router', function () {
        var actual = routers.get('sbg-lw2-ap-02');

        assert.strictEqual(actual.constructor.name, 'Router');
        assert.strictEqual(actual.data.name, 'Vegas area');
        assert.strictEqual(actual.getName(), 'Vegas area on the 6th floor of LW2');
    });

    it('should return a router when details unknown', function () {
        var actual = routers.get('unknown-router');

        assert.strictEqual(actual.constructor.name, 'Router');
        assert.strictEqual(actual.data.name, undefined);
        assert.strictEqual(actual.getName(), 'unknown-router');
    });
});
