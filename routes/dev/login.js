  var express = require('express'),
    router = express.Router(),
    easyPbkdf2 = require ('easy-pbkdf2')(),
    secretKey = require('../../secret'),
    jwt = require('jsonwebtoken'),
    pg = require('../../require'),
    _ = require('lodash');
    const crypto = require('crypto');

    module.exports = {
      ensureAuthorized: function(req, res, next) {
          var bearerToken;
          var bearerHeader = req.headers["authorization"];
          if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            var bearerToken = bearer[1];
            req.token = bearerToken;
          }
          var token = req.token;
          if (token) {
            jwt.verify(token, secretKey, function(err, decoded) {
              if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
              } else {
                req.decoded = decoded;
                req.user_id = req.decoded.user_id;
                next();
              }
            });
          } else {
            return res.status(403).send({
              success: false,
              message: 'No token provided.'
            });
          }
      },
      token: function(req, res, done){
          var username = req.body.username;
          var password = req.body.password;
          pg.connect(function(err, client, done) {
            if(err) {
              return console.error('error fetching client from pool', err);
            }
            client.query('select * from users where username = $1', [username], function(err, result) {
              done();
              if (err) {
                console.log(err);
                return err;
              }
              var user = result.rows;

              if (!user) {
                return done(null, false), console.log('no error, and no user either!');
              }
              if (!err) {
                var tempUser = {
                  salt: user[0].user_salt
                }

                const key = crypto.pbkdf2Sync(password, tempUser.salt, 100000, 512, 'sha512');
                var passbuf2 = (key.toString('hex'));
              }
              if (!(user[0].password == passbuf2)) {
                return done(null, false), console.log('something is wrong with the buffers!');
              }
              if (!( user[0].user_salt == tempUser.salt)) {
                return done(null, false), console.log('saltless');
              }
              var token = jwt.sign({ user_id: user[0].user_id }, secretKey,
                { expiresIn: 60*60*24
              });
              res.status(200).send({ token: token, user_id: user[0].user_id });
              return done(), console.log('You are successfully logged in!');
            });
          });
        },
        register: function(req, res, next) {
            pg.connect(function(err, client, done) {
              if(err) {
                return console.error('error fetching client from pool', err, req.body);
              }
              var password = req.body.password;
              var salt = easyPbkdf2.generateSalt();

              const key = crypto.pbkdf2Sync(password, salt, 100000, 512, 'sha512');
              var passwordHash = key.toString('hex');

              const users = {
                email: req.body.email,
                username: req.body.username,
                password: passwordHash,
                firstname: req.body.firstname,
                user_salt: salt
              }

              client.query('insert into users(email, username, firstname, password, user_salt) values($1, $2, $3, $4, $5)',
              [users.email, users.username, users.firstname, users.password, users.user_salt], function(err, result) {
              done();

              if(err) {
                return console.error('error running query', err);
              }

              res.send({
                success: true,
                message: 'You have been successfully registered!'
              });
            });
          });
        }
  }
