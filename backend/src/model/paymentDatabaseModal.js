const mongoose = require("mongoose");

const paymentDatabaseSchema = new mongoose.Schema({
 sessionId: {
  type: String,
  default: null
 },
 userId: {
  type: String,
  default: null
 },
 requestData: {
  type: Object,
  default: null
 },
}, {
 timestamps: true
});

const PaymentDatabaseSchema = mongoose.model("paymentDatabase", paymentDatabaseSchema);
module.exports = PaymentDatabaseSchema;
