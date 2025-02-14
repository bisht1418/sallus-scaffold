const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String
    },
    companyDetails: {
      type: Object
    },
    projectDetails: {
      type: Object
    },
    projectNumber: {
      type: String
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user"
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: "inactive"
    },
    projectBackgroundImage: {
      type: String,
      default: ""
    },
    Calendar: {
      type: Object,
      default: []
    },
    notificationToAdminCreate: {
      type: Boolean,
      default: false
    },
    notificationToAdminEdit: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model("project", projectSchema);

module.exports = Project;
