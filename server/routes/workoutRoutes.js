
const express = require('express');
const router = express.Router();
const workoutsController = require('../controllers/workoutsController');
const workoutController = require('../controllers/workoutController')


router.get('/workouts-next-week',workoutsController.workoutsByDate);
router.put('/create-workout',workoutController.insert);
router.put('/update-workout',workoutController.updateValues);

module.exports = router;