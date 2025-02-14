const express = require("express");
const AfterControlVisualInspectionForm = express.Router();
const afterControlVisualInspectionController = require("../controller/afterControlVisualInspectionController");

AfterControlVisualInspectionForm.get(
  "/:approvalFormId",
  afterControlVisualInspectionController.getAfterControlVisualInspectionForm
);
AfterControlVisualInspectionForm.put(
  "/:approvalFormId",
  afterControlVisualInspectionController.editAfterControlVisualInspectionForm
);

module.exports = AfterControlVisualInspectionForm;
