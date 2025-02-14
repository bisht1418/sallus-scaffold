const mongoose = require("mongoose");

const customListSchema = new mongoose.Schema(
  {
    customList: {
      type: Object,
      default: [],
    },
    customName: {
      type: String,
      default: null,
    },
    customDescription: {
      type: String,
      default: null,
    },
    customImage: {
      type: String,
      default: null,
    },
    extractedProjectId: {
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
    materialListId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "material_lists",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const customListSchemaForm = mongoose.model("customList", customListSchema);
module.exports = customListSchemaForm;
