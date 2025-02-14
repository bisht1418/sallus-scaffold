const express = require("express");
const CustomNotificationRoute = express.Router();
const CustomNotificationController = require("../controller/customListNotificationController");

CustomNotificationRoute.post(
  "/create-notification",
  CustomNotificationController.createCustomNotification
);
CustomNotificationRoute.get(
  "/get-notification",
  CustomNotificationController.getCustomNotification
);
CustomNotificationRoute.put(
  "/update-notification",
  CustomNotificationController.updateCustomNotification
);

CustomNotificationRoute.put(
  "/read-notification/:id",
  CustomNotificationController.readCustomNotification
);

CustomNotificationRoute.get(
  "/get-notification-by-user-id/:userId",
  CustomNotificationController.getNotificationByUserId
);

CustomNotificationRoute.delete(
  "/delete-notification/:id",
  CustomNotificationController.deleteCustomNotification
);

module.exports = CustomNotificationRoute;
