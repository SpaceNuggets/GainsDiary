
const express = require('express');
const router = express.Router();
const workoutsController = require('../controllers/workoutsController');
const workoutController = require('../controllers/workoutController')


router.get('/workouts-next-week',workoutsController.workoutsByDate);
router.get('/workouts-unique-data',workoutsController.uniqueData)
router.get('/workouts-exercises-data',workoutsController.exercisesByDate)
router.put('/create-workout',workoutController.insert);
router.put('/update-workout',workoutController.updateValues);

module.exports = router;