  var express = require('express'),
    router = express.Router(),
    pg = require('../../require'),
    _ = require('lodash');

    module.exports = {
      getDailyCalc: function(req, res) {
        pg.connect(function(err, client, done) {
          if(err) {
            return console.error('error fetching client from pool', err);
          }
          const data = [];
          var user_id = req.user_id;

          client.query('select * from totalCal where user_id = $1', [user_id], function(err, result) {
            done();
            if (err) {
              console.log("CLIENT_ERR", err);
            }
            // console.log("RESULT", result.rows);
            var data = result.rows;

            res.status(200).send({
              data: data,
              success: true,
              message: 'Here is your daily calc!'
            });
          });
        });
      },
      getCurrentCalc: function(req, res) {
        pg.connect(function(err, client, done) {
          if(err) {
            return console.error('error fetching client from pool', err);
          }
          const data = [];
          var user_id = req.user_id;

          client.query('select * from currentCalc where user_id = $1', [user_id], function(err, result) {
            done();
            if (err) {
              console.log("CLIENT_ERR", err);
            }
            // console.log("RESULT", result.rows);
            var data = result.rows;

            res.status(200).send({
              data: data,
              success: true,
              message: 'Here is your current calc!'
            });
          });
        });
      },
        postDailyCalc: function(req, res) {
          pg.connect(function(err, client, done) {
            if(err) {
              return console.error('error fetching client from pool', err);
            }
            const data = [];
            var user_id = req.user_id;
            var totalCal = req.body.totalCal;

            client.query('INSERT INTO totalCal(date, total_daily_calories, protein_macro, fat_macro, carbs_macro, user_id) values($1, $2, $3, $4, $5, $6)',
            [totalCal.date, totalCal.total_daily_calories, totalCal.protein_macro, totalCal.fat_macro, totalCal.carbs_macro, user_id], function(err, result) {
              done();
              if (err) {
                console.log("CLIENT_ERR", err);
              }
              // console.log("RESULT", result.rows);
              var data = result.rows;

              res.status(200).send({
                data: data,
                success: true,
                message: 'Your daily Calc is saved!'
              });
            });
          });
        },

        postCurrentCalc: function(req, res) {
          pg.connect(function(err, client, done) {
            if(err) {
              return console.error('error fetching client from pool', err);
            }
            const data = [];
            var user_id = req.user_id;
            var currentCalc = req.body.currentCalc;

            client.query('INSERT INTO currentcalc(remaining, consumed, remaining_carb, remaining_fat, remaining_protein, user_id) values($1, $2, $3, $4, $5, $6)',
             [currentCalc.remaining, currentCalc.consumed, currentCalc.remaining_carb, currentCalc.remaining_fat, currentCalc.remaining_protein, user_id], function(err, result) {
              done();
              if (err) {
                console.log("CLIENT_ERR", err);
              }
              // console.log("RESULT", result.rows);
              var data = result.rows;

              res.status(200).send({
                data: data,
                success: true,
                message: 'Your current calc is created!'
              });
            });
          });
        },
        updateCurrentCalc: function(req, res) {
          pg.connect(function(err, client, done) {
            if(err) {
              return console.error('error fetching client from pool', err);
            }
            const data = [];
            var user_id = req.user_id;
            var updatedCalc = req.body.updatedCalc;

            var query = "UPDATE currentcalc SET remaining = ($1), consumed = ($2), remaining_carb = ($3),"+
              " remaining_fat = ($4), remaining_protein = ($5) WHERE user_id=($6)";

            client.query(query, [updatedCalc.remaining, updatedCalc.consumed, updatedCalc.remaining_carb,
                 updatedCalc.remaining_fat, updatedCalc.remaining_protein, user_id], function(err, result) {

              done();
              if (err) {
                console.log("CLIENT_ERR", err);
              }
              // console.log("RESULT", result.rows);
              var data = result.rows;

              res.status(200).send({
                data: data,
                success: true,
                message: 'Your current calc is updated!'
              });
            });
          });
        },
        deleteCurrentCalc: function(req, res) {
          pg.connect(function(err, client, done) {
            if(err) {
              return console.error('error fetching client from pool', err);
            }
            const data = [];
            var user_id = req.user_id;
            var updatedCalc = req.body.updatedCalc;

            var query = "DELETE FROM currentcalc WHERE user_id=($1)";

            client.query(query, [user_id], function(err, result) {

              done();
              if (err) {
                console.log("CLIENT_ERR", err);
              }
              // console.log("RESULT", result.rows);
              var data = result.rows;

              res.status(200).send({
                data: data,
                success: true,
                message: 'Your current calc is reset!'
              });
            });
          });
        }
    }
