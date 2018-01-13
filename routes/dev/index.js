  var express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    userRoute = require('./login'),
    egym = require('./egym'),
    split = require('./workout_split'),
    efridge = require('./efridge'),
    calc = require('./calc'),
    pg = require('../../require');

    //api route
    router.get('/', function(req, res) {
      res.status(200).send({
        success: true,
        message: 'Successful Connection'
      });
    });

    // is this needed? What to do for token auth
    router.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });

    // registration route
    router.post('/register', userRoute.register);
    router.post('/token', userRoute.token);

    var ensureAuthorized = userRoute.ensureAuthorized;

    // efridge routes
    router.get('/efridge', ensureAuthorized, efridge.getFood);
    router.post('/efridge', ensureAuthorized, efridge.postFood);
    router.post('/efridge/deleteFood', ensureAuthorized, efridge.deleteFood);

    router.get('/efridge/dailyCalc', ensureAuthorized, calc.getDailyCalc);
    router.post('/efridge/dailyCalc', ensureAuthorized, calc.postDailyCalc);

    router.get('/efridge/currentCalc', ensureAuthorized, calc.getCurrentCalc);
    router.post('/efridge/currentCalc', ensureAuthorized, calc.postCurrentCalc);
    router.post('/efridge/updateCurrentCalc', ensureAuthorized, calc.updateCurrentCalc);
    router.post('/efridge/deleteCurrentCalc', ensureAuthorized, calc.deleteCurrentCalc);

    // egym routes
    router.get('/egym', ensureAuthorized, egym.get);
    router.post('/egym', ensureAuthorized, egym.post);
    router.post('/egym/deleteWorkout', ensureAuthorized, egym.deleteWorkout);

    router.get('/egym/workoutSplit', ensureAuthorized, split.getworkoutSplit);
    router.post('/egym/workoutSplit', ensureAuthorized, split.saveworkoutSplit);
    router.post('/egym/updateWorkoutSplit', ensureAuthorized, split.updateworkoutSplit);
    router.post('/egym/deleteWorkoutSplit', ensureAuthorized, split.deleteWorkoutSplit);

    // error handling
    pg.on('error', function (err, client) {
      console.error('idle client error', err.message, err.stack)
    });

  module.exports = router;
