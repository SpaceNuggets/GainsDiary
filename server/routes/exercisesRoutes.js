
const express = require('express');
const router = express.Router();
const exercisesController = require('../controllers/exercisesController');
const exerciseController = require('../controllers/exerciseController');

router.get('/exercises-by-user',exercisesController.exercisesByUserID);
router.put('/create-exercise',exerciseController.insert);
router.put('/update-exercise',exerciseController.updateValues);


module.exports = router;