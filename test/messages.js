var assert = require('assert');
var messages = require('../src/messages');

function botSpy(callback) {
    return {
        reply: function () {
            return callback || function() {};
        }
    };
}

describe('Messages', function () {
    describe('optin', function () {
        beforeEach(function () {
            messages.handle('optout', {
                user: 'test'
            }, botSpy());
        });

        it('should opt in a user', function (done) {
            messages.handle('optin', {
                user: 'test',
            }, botSpy(function (err, message) {
                assert.ifError(err);
                assert.strictEqual(message, 'OK, you’re opted in!');
                done();
            }));
        });

        it('should warn when already opted in', function (done) {
            // first
            messages.handle('optin', {
                user: 'test',
            }, botSpy(function (err, message) {
                // second
                messages.handle('optin', {
                    user: 'test',
                }, botSpy(function (err, message) {
                    assert.ifError(err);
                    assert.strictEqual(message, 'You’re already opted in!');
                    done();
                }));
            }));
        });
    });
});
