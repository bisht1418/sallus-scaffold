const mongoose = require("mongoose");

const approvalFormSchema = new mongoose.Schema(
  {
    scaffoldName: {
      type: Object,
      default: [],
    },
    date: {
      type: Date,
      default: null,
    },
    dismantledDate: {
      type: Date,
      default: null,
    },
    scaffoldIdentificationNumber: {
      type: String,
      default: null,
    },
    scaffolderowner: {
      type: String,
      default: null,
    },
    inspectedBy: {
      type: String,
      default: null,
    },
    builtBy: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    scaffoldClass: {
      type: String,
      default: null,
    },
    totalWeightPerM2: {
      type: String,
      default: null,
    },
    amountWallAnkers: {
      type: String,
      default: null,
    },
    wallAnchorsCapacity: {
      type: String,
      default: null,
    },
    userResponsible: {
      type: String,
      default: null,
    },
    inspectorSignature: {
      type: String,
      default: null,
    },
    customerSignature: {
      type: String,
      default: null,
    },
    inspectorSignatureName: {
      type: String,
      default: null,
    },
    customerSignatureName: {
      type: String,
      default: null,
    },
    comments: {
      type: String,
      default: null,
    },
    followUp: {
      type: String,
      default: null,
    },
    responsibleForScaffold: {
      type: String,
      default: null,
    },

    approvalForm: {
      type: String,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "inactive",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      default: null,
    },
    projectNumber: {
      type: String,
      default: null,
    },
    approvalFormImage: {
      type: String,
      default: null,
    },
    sizeScaffold: {
      type: Object,
      default: [],
    },
    AnchorCapacityUnit: {
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
    visual: {
      type: Object,
      default: [],
    },
    scaffoldUniqueNumber: {
      type: Number,
      default: 0,
    },
    workOrderNumber: {
      type: String,
      default: null,
    },
    userGuideDetail: {
      type: Object,
      default: null,
    },
    isApprovalForm: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const approvalForm = mongoose.model("approval_form", approvalFormSchema);
module.exports = approvalForm;
