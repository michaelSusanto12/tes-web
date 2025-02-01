const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/payments', paymentController.createPayment);
router.get('/payments/:penjualan_id', paymentController.getPayments);
router.put('/payments/:id', paymentController.updatePaymentStatus);


module.exports = router;