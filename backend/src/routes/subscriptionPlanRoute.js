const express = require("express");
const SubscriptionPlanRoute = express.Router();
const subscriptionPlanController = require("../controller/subscriptionPlanController");

SubscriptionPlanRoute.get(
  "/get-subscription-plan",
  subscriptionPlanController.getSubscriptionPlan
);
SubscriptionPlanRoute.post(
  "/send-subscription-mail",
  subscriptionPlanController.sendSpecialSubscriptionMail
);

SubscriptionPlanRoute.post(
  "/send-prize-mail",
  subscriptionPlanController.prizeMail
);

module.exports = SubscriptionPlanRoute;
