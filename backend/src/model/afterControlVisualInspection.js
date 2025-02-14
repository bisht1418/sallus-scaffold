const mongoose = require("mongoose");

const afterControlVisualInspectionSchema = new mongoose.Schema({
  approvalFormId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "approval_form",
    default: null,
  },
  visualData: {
    type: Array,
    default: null,
  },
});

const afterControlVisualInspectionForm = mongoose.model(
  "afterControlVisualInspection",
  afterControlVisualInspectionSchema
);
module.exports = afterControlVisualInspectionForm;
