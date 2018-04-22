var assert = require('assert');
var cherwell = require('../src/cherwell');

describe('cherwell', function () {
    describe('getDevicesByOwner', function () {
        it('should return an array of devices', function () {
            var actual = cherwell.getDevicesByOwner({
                id: 123456
            });

            assert.deepStrictEqual(actual, [{
                "hostname": "SBGML011111",
                "macAddress": "4C:32:75:8B:88:25",
                "owner": 123456
            }]);
        });

        it('should return an empty array for no match', function () {
            var actual = cherwell.getDevicesByOwner({
                id: 999
            });

            assert.deepStrictEqual(actual, []);
        });
    });

    describe('getUserByEmail', function () {
        it('should return a single user', function () {
            var actual = cherwell.getUserByEmail('emrossa@gmail.com');

            assert.deepStrictEqual(actual, {
                "name": "Emilia Lewandowska",
                "emailAddress": "emrossa@gmail.com",
                "id": 123456
            });
        });

        it('should return undefined for no match', function () {
            var actual = cherwell.getUserByEmail('test@example.com');

            assert.strictEqual(actual, undefined);
        });
    });
});
