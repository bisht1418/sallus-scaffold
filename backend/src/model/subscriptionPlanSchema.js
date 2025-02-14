const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema({
 mainTitle: {
  type: String,
  required: true
 },
 price: {
  month: {
   type: String,
   required: true
  },
  year: {
   type: String,
   required: true
  }
 },
 infoNote: {
  type: String,
  required: true
 },
 basicFeature: {
  type: Boolean,
  default: false
 },
 features: [{
  featureName: {
   type: String,
   required: true
  },
  isApplicable: {
   type: Boolean,
   default: false
  }
 }],
 subscriptionType: {
  type: Number,
  required: true
 }
});

const SubscriptionPlan = mongoose.model("subscriptionplan", subscriptionPlanSchema);

module.exports = SubscriptionPlan;
