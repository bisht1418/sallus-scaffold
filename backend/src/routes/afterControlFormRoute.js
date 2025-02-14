const express = require("express");
const AfterControlFormForm = express.Router();
const afterControlFormController = require("../controller/afterControlFormController");
const upload = require("../middleware/multer");

AfterControlFormForm.post(
  "/create-control-form",
  upload.fields(["avatar"]),
  afterControlFormController.createAfterControlForm
);
AfterControlFormForm.get(
  "/get-control-form",
  afterControlFormController.getAfterControlForm
);
AfterControlFormForm.put(
  "/update-control-form/:id",
  afterControlFormController.editAfterControlForm
);
AfterControlFormForm.delete(
  "/delete-control-form/:id",
  afterControlFormController.deleteAfterControlFormData
);
AfterControlFormForm.get(
  "/get-control-form/:projectId",
  afterControlFormController.getAfterControlFormByProjectId
);
AfterControlFormForm.get(
  "/get-control-form-by-id/:id",
  afterControlFormController.getAfterControlFormById
);

module.exports = AfterControlFormForm;
