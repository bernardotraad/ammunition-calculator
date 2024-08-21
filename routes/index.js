const express = require('express');
const router = express.Router();
const munitionController = require('../controllers/munitionController');

router.post('/calculate', munitionController.calculate);
router.post('/clear', munitionController.clear);

module.exports = router;
