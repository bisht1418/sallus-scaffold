const mongoose = require("mongoose");

const customNotification = new mongoose.Schema(
  {
    notification: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    userId: {
      type: String,
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CustomNotificationSchema = mongoose.model(
  "CustomNotification",
  customNotification
);
module.exports = CustomNotificationSchema;
