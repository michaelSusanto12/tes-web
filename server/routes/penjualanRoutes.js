const express = require('express');
const penjualanController = require('../controllers/PenjualanController');

const router = express.Router();

router.post('/penjualan', penjualanController.createPenjualan);
router.get('/marketings', penjualanController.getMarketings);
router.get('/penjualan', penjualanController.getPenjualan);


module.exports = router;