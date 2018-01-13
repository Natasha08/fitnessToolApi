var express = require('express'),
  router = express.Router(),
  pg = require('pg'),
  _ = require('lodash');

module.exports = {
  getFood: function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      const data = [];
      var user_id = req.user_id;

      client.query('select * from efridge where user_id = $1', [user_id], function(err, result) {
        done();
        if (err) {
          console.log("CLIENT_ERR", err);
        }

        var data = result.rows;

        res.status(200).send({
          data: data,
          success: true,
          message: 'Here are your food items!'
        });
      });
    });
  },

  postFood: function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      const user_id = req.user_id;
      if(err) {
        return console.error('error fetching client from pool', err);
      }

      var efridge = req.body.efridge;

      client.query('INSERT INTO efridge(food_name, brand, serving_size, serving_size_unit, total_calories, fat_grams, carbohydrate_grams, protein_grams, total_grams, user_id) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [efridge.food_name, efridge.brand, efridge.serving_size, efridge.serving_size_unit, efridge.total_calories, efridge.fat_grams, efridge.carbohydrate_grams,
        efridge.protein_grams, efridge.total_grams, user_id])
        done();

        if(err) {
          return console.error('error running query', err);
        }
        res.send({
          success: true,
          message: 'You have successfully saved your foods!'
        });
      });
    },
    deleteFood: function(req, res) {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        const data = [];
        var user_id = req.user_id;
        var efridge = req.body;
        var query = "DELETE FROM efridge WHERE user_id=($1) AND id=($2)";

        client.query(query, [user_id, efridge.id], function(err, result) {

          done();
          if (err) {
            console.log("CLIENT_ERR", err);
          }
          var data = result.rows;

          res.status(200).send({
            data: data,
            success: true,
            message: 'Your food has been deleted!'
          });
        });
      });
    }
}
