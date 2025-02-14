const mongoose = require("mongoose");

const afterControlSchema = new mongoose.Schema(
  {
    afterControl: {
      type: Object,
      default: [],
    },
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
    projectName: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    signature: {
      type: Object,
      default: null,
    },
    activeCount: {
      type: Number,
      default: 0,
    },
    inactiveCount: {
      type: Number,
      default: 0,
    },
    dismissedCount: {
      type: Number,
      default: 0,
    },
    isAfterControlForm: {
      type: Boolean,
      default: true,
    },
    controlName: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const afterControlForm = mongoose.model("aftercontrolform", afterControlSchema);
module.exports = afterControlForm;
