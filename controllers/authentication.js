const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');


function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({
        sub: user.id,
        iat: timestamp
    }, config.secret);
}

exports.signin = function (req, res, next) {
    res.send({
        token: tokenForUser(req.user)
    });
}
exports.signup = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(422).send({
            error: "Missing email or password"
        });
    }

    User.findOne({
        email: email
    }, function (error, existingUser) {
        if (error) {
            return next(error)
        }

        //if user does not exists
        if (existingUser) {
            return res.status(422).send({
                error: "Email in use"
            });
        }

        //if user with email does not exists create and store the new user   
        const user = new User({
            email: email,
            password: password
        });
        user.save(function (error) {
            if (error) {
                return next(error)
            }
            res.json({
                token: tokenForUser(user)
            });
        });
    });


}