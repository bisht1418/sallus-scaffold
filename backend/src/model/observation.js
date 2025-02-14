const mongoose = require("mongoose");

const observationSchema = new mongoose.Schema(
  {
    projectNumber: {
      type: String,
      default: null,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      default: null,
    },
    projectId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "project",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    projectDetail: {
      type: Object,
      default: null,
    },

    status: {
      type: String,
      default: "latest",
    },
    comments: {
      type: String,
      default: "",
    },
    observationFormImage: {
      type: String,
      default: null,
    },
    notificationToAdminCreate: {
      type: Boolean,
      default: false,
    },
    notificationToAdminEdit: {
      type: Boolean,
      default: false,
    },
    observationAction: {
      type: Object,
      default: null,
    },
    observationMedia: {
      type: String,
      default: null,
    },
    riskAssessment: {
      type: Object,
      default: null,
    },
    observationDetails: {
      type: Object,
      default: null,
    },
    observerDetails: {
      type: Object,
      default: null,
    },
    isObservationForm: {
      type: Boolean,
      default: true,
    },
    yourNames: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Observation = mongoose.model("observation", observationSchema);

module.exports = Observation;
