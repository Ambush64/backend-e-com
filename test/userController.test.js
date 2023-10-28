const { expect } = require('chai');
const { signUpUser } = require('../backend/controller/user.controller');
const { connectDB } = require('../backend/config/db');

describe('User Controller', () => {
    it('should sign up a user', async () => {
        const req = {
            body: {
                email: 'jddsks@example.com',
                fullName: 'Tewdsst User',
                password: 'testpassword',
            },
        };

        const res = {
            status: function (statusCode) {
                this.statusCode = statusCode;
                return this;
            },
            send: function (message) {
                this.message = message;
                return this;
            },
        };

        const connection = connectDB();
        connection.query = (sql, values, callback) => {
            callback(null, { insertId: 1 });
        };

        const mockQueryCallback = (results) => {
            expect(res.statusCode).to.equal(201);
            expect(res.message).to.equal('Successfully account opened');
        };

        await signUpUser(req, res, mockQueryCallback);
    });
});
