var express = require('express'),
  router = express.Router(),
  pg = require('pg'),
  _ = require('lodash');

module.exports = {
    getworkoutSplit: function(req, res) {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        const data = [];
        var user_id = req.user_id;

        client.query('select * from workoutSplit where user_id = $1', [user_id], function(err, result) {
          done();
          if (err) {
            console.log("CLIENT_ERR", err);
          }

          var data = result.rows;

          res.status(200).send({
            data: data,
            success: true,
            message: 'Here is your workout split!'
          });
        });
      });
    },

    saveworkoutSplit: function(req, res) {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        const data = [];
        var user_id = req.user_id;
        var split = req.body.workoutSplit;
        client.query('INSERT INTO workoutSplit(workout_day, primary_lift, secondary_lift, user_id) values($1, $2, $3, $4)',
        [split.workout_day, split.primary_lift, split.secondary_lift, user_id], function(err, result) {
          done();
          if (err) {
            console.log("CLIENT_ERR", err);
          }

          var data = result.rows;

          res.status(200).send({
            data: data,
            success: true,
            message: 'Your workout split is saved!'
          });
        });
      });
    },

    updateworkoutSplit: function(req, res) {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        const data = [];
        var user_id = req.user_id;
        var updatedSplit = req.body.updatedSplit;

        var query = "UPDATE workoutSplit SET remaining = ($1), consumed = ($2), remaining_carb = ($3),"+
          " remaining_fat = ($4), remaining_protein = ($5) WHERE user_id=($6)";

        client.query(query, [updatedCalc.remaining, updatedCalc.consumed, updatedCalc.remaining_carb,
             updatedCalc.remaining_fat, updatedCalc.remaining_protein, user_id], function(err, result) {

          done();
          if (err) {
            console.log("CLIENT_ERR", err);
          }

          var data = result.rows;

          res.status(200).send({
            data: data,
            success: true,
            message: 'Your workout split is updated!'
          });
        });
      });
    },
    deleteWorkoutSplit: function(req, res) {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        const data = [];
        var user_id = req.user_id;

        var query = "DELETE * FROM workoutSplit WHERE user_id=($1)";

        client.query(query, [user_id], function(err, result) {

          done();
          if (err) {
            console.log("CLIENT_ERR", err);
          }

          var data = result.rows;

          res.status(200).send({
            data: data,
            success: true,
            message: 'Your workout split is deleted!'
          });
        });
      });
    }
  }
