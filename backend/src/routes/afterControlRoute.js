const express = require("express");
const AfterControlForm = express.Router();
const afterControlFormController = require("../controller/afterControlController");

AfterControlForm.get(
  "/get-project/:id",
  afterControlFormController.getApprovalFormByProjectId
);
AfterControlForm.post(
  "/create-after-control-from",
  afterControlFormController.createAfterControlForm
);
AfterControlForm.get(
  "/get-after-control-from/:id",
  afterControlFormController.getAfterControlFormData
);
AfterControlForm.delete(
  "/delete-after-control-from/:id",
  afterControlFormController.deleteAfterControlFormData
);
AfterControlForm.put(
  "/update-after-control-from/:id",
  afterControlFormController.editAfterControlForm
);
AfterControlForm.get(
  "/after-control-from/:id",
  afterControlFormController.getAfterControlFormDataById
);

AfterControlForm.get(
  "/after-control/user-id/:userId",
  afterControlFormController?.getAfterControlFormByUserId
);

module.exports = AfterControlForm;
