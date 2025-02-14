const mongoose = require("mongoose");

const materialListProjectSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "project",
      default: null,
    },
    transferProjectId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "project",
      default: null,
    },
    materialList: {
      type: Object,
      default: null,
    },
    customListData: {
      type: Object,
      default: null,
    },
    projectName: {
      type: String,
      default: null,
    },
    customerName: {
      type: String,
      default: null,
    },
    materialListName: {
      type: String,
      default: null,
    },
    projectDate: {
      type: Date,
      default: null,
    },
    comments: {
      type: String,
      default: null,
    },
    deliverySignature: {
      type: String,
      default: null,
    },
    customerSignature: {
      type: String,
      default: null,
    },
    deliveryNameSignature: {
      type: String,
      default: null,
    },
    customerNameSignature: {
      type: String,
      default: null,
    },
    totalWeight: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "latest",
    },
    transferWeight: {
      type: Number,
      default: 0,
    },
    transferMaterialListsPermisssion: {
      type: Boolean,
      default: false,
    },
    permisssionUserToAdmin: {
      type: Boolean,
      default: false,
    },
    permisssionAdminToUser: {
      type: Boolean,
      default: false,
    },
    permisssionAdminUserMessage: {
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
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
    isMaterialListForm: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const materialListWithProject = mongoose.model(
  "material_list_with_project",
  materialListProjectSchema
);
module.exports = materialListWithProject;
