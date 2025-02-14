const express = require("express");
const ActionNotificationRoute = express.Router();
const ActionNotificationController = require("../controller/actionLogsController");

ActionNotificationRoute.post(
 "/create-notification",
 ActionNotificationController.createActionNotification
);
ActionNotificationRoute.get(
 "/get-notification",
 ActionNotificationController.getActionNotification
);
ActionNotificationRoute.put(
 "/update-notification",
 ActionNotificationController.updateActionNotification
);

ActionNotificationRoute.put(
 "/read-notification/:id",
 ActionNotificationController.readActionNotification
);

ActionNotificationRoute.get(
 "/get-notification-by-user-id/:userId",
 ActionNotificationController.getNotificationByUserId
);

ActionNotificationRoute.delete(
 "/delete-notification/:id",
 ActionNotificationController.deleteActionNotification
);

module.exports = ActionNotificationRoute;
