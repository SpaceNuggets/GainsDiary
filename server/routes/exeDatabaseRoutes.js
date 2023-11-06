const express = require('express');
const router = express.Router();
const exeDatabaseController = require('../controllers/exeDatabaseController');

router.get('/exercise-options', exeDatabaseController.exerciseEquipments);
router.get('/exercise-by-options', exeDatabaseController.exercisesByOptions);


module.exports = router;
