var assert = require('assert');
var messages = require('../src/messages');

function botSpy(callback, slackUser) {
    return {
        getUserById: function () {
            return new Promise(function (res, rej) {
                res(slackUser || {
                    profile: {
                        email: 'emrossa@gmail.com'
                    }
                });
            });
        },
        postMessage: callback,
        reply: function () {
            return callback || function() {};
        }
    };
}

describe('Messages', function () {
    beforeEach(function () {
        messages.handle('optout', {
            user: 'TEST'
        }, botSpy());
    });

    describe('optin', function () {
        it('should opt in a user', function (done) {
            messages.handle('optin', {
                user: 'TEST',
            }, botSpy(function (err, message) {
                assert.ifError(err);
                assert.strictEqual(message, 'OK, you’re opted in!');
                done();
            }));
        });

        it('should warn when already opted in', function (done) {
            // first
            messages.handle('optin', {
                user: 'TEST',
            }, botSpy(function (err, message) {
                // second
                messages.handle('optin', {
                    user: 'TEST',
                }, botSpy(function (err, message) {
                    assert.ifError(err);
                    assert.strictEqual(message, 'You’re already opted in!');
                    done();
                }));
            }));
        });
    });

    describe('optout', function () {
        it('should opt out after opting in', function (done) {
            // opt in
            messages.handle('optin', {
                user: 'TEST',
            }, botSpy(function (err, message) {
                // out again
                messages.handle('optout', {
                    user: 'TEST',
                }, botSpy(function (err, message) {
                    assert.ifError(err);
                    assert.strictEqual(message, 'OK, you’re opted out!');
                    done();
                }));
            }));
        });

        it('should not error when already opted out', function (done) {
            messages.handle('optout', {
                user: 'TEST',
            }, botSpy(function (err, message) {
                assert.ifError(err);
                assert.strictEqual(message, 'OK, you’re opted out!');
                done();
            }));
        });
    });

    describe('locate', function () {
        it('should not locate an invalid name', function (done) {
            messages.handle('locate someone', {
                user: 'TEST',
            }, botSpy(function (err, message) {
                assert(err instanceof Error);
                assert.strictEqual(err.message, 'invalid_user');
                assert.strictEqual(message, '“someone” is not a user');
                done();
            }));
        });

        it('should not locate an opted-out user', function (done) {
            messages.handle('locate <@TEST>', {
                user: 'OTHER',
            }, botSpy(function (err, message) {
                assert.ifError(err);
                assert.strictEqual(message, 'Sorry, <@TEST> is not opted in');
                done();
            }));
        });

        it('should warn for missing user', function (done) {
            messages.handle('optin', {
                user: 'TEST',
            }, botSpy(function (err, message) {
                messages.handle('locate <@TEST>', {
                    user: 'OTHER',
                }, botSpy(function (err, message) {
                    assert(err instanceof Error);
                    assert.strictEqual(err.message, 'no_user');
                    done();
                }, {profile: {email: 'invalid@example.com'}}));
            }));
        });
    });

    describe('default behaviour', function () {
        it('should warn for unknown message', function (done) {
            messages.handle('unknown', {
                user: 'TEST',
            }, botSpy(function (err, message) {
                assert.ifError(err);
                assert.strictEqual(message, 'Sorry, I don’t understand! Try asking for `help`.');
                done();
            }));
        });
    });
});
