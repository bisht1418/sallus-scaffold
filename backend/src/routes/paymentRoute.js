const express = require('express');
const PaymentRoute = express.Router();
const paymentController = require('../controller/paymentController');
const auth = require('../middleware/auth');

PaymentRoute.post("/process-payment", paymentController.processPayment)
PaymentRoute.get("/payment/check-status", paymentController.checkPaymentStatus)

// PaymentRoute.post("/webhook", paymentController.handleWebhook)


module.exports = PaymentRoute;