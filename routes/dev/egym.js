  var express = require('express'),
    router = express.Router(),
    pg = require('../../require'),
    _ = require('lodash');

    module.exports = {
      post: function(req, res) {
        pg.connect(function(err, client, done) {
          const user_id = req.user_id;
          if(err) {
            return console.error('error fetching client from pool', err);
          }
          var egym = req.body.egym;
          console.log("EGYM", egym);
          client.query('INSERT INTO egym(date, workout_day, key_lift1, key_lift2, user_id) values($1, $2, $3, $4, $5)',
          [egym.date, egym.workout_day, egym.key_lift1, egym.key_lift2, user_id])
            done();

            if(err) {
              return console.error('error running query', err);
            }
            res.send({
              success: true,
              message: 'You have successfully saved your workout!'
            });
          });
        },
        get: function(req, res) {
          pg.connect(function(err, client, done) {
            if(err) {
              return console.error('error fetching client from pool', err);
            }
            const data = [];
            var user_id = req.user_id;

            client .query('select * from egym where user_id = $1', [user_id], function(err, result) {
              done();
              if (err) {
                console.log("CLIENT_ERR", err);
              }
              // console.log("RESULT", result.rows);
              var data = result.rows;

              res.status(200).send({
                data: data,
                success: true,
                message: 'Here are your workouts!'
              });
            });
          });
        },
        deleteWorkout: function(req, res) {
          pg.connect(function(err, client, done) {
            if(err) {
              return console.error('error fetching client from pool', err);
            }
            const data = [];
            var user_id = req.user_id;
            var workout = req.body;
            var query = "DELETE FROM egym WHERE user_id=($1) AND id=($2)";

            client.query(query, [user_id, workout.id], function(err, result) {

              done();
              if (err) {
                console.log("CLIENT_ERR", err);
              }
              var data = result.rows;

              res.status(200).send({
                data: data,
                success: true,
                message: 'Your workout has been deleted!'
              });
            });
          });
        }
    }
