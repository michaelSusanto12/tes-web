const express = require('express');
const commissionController = require('../controllers/commisionController');

const router = express.Router();

router.get('/commissions', commissionController.getCommissions);

module.exports = router;