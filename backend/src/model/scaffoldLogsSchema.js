const mongoose = require("mongoose");

const scaffoldLogSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    approvalFormId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "approval_form",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isDismantled: {
      type: Boolean,
      default: false,
    },
    scaffoldName: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    scaffoldIdentificationNumber: {
      type: String,
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ScaffoldLogSchema = mongoose.model("ScaffoldLog", scaffoldLogSchema);
module.exports = ScaffoldLogSchema;
