const express = require("express");
const ApprovalForm = express.Router();
const approvalFormController = require("../controller/approvalFormController");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/multer");
// const { getApprovalFormByProjectId } = require("../controller/approvalFormController")
ApprovalForm.post(
  "/",
  authMiddleware,
  approvalFormController.createApprovalForm
);
ApprovalForm.get("/", approvalFormController.getApprovalForm);
ApprovalForm.get("/:userId", approvalFormController.getApprovalFormByUserId);
ApprovalForm.get("/get-by-id/:id", approvalFormController.getApprovalFormById);
ApprovalForm.put(
  "/update-approval-form/:id",
  authMiddleware,
  approvalFormController.editApprovalForm
);
ApprovalForm.put(
  "/delete-approval-form/:id",
  approvalFormController.deleteApprovalFormData
);
ApprovalForm.put(
  "/change-approval-status/:id",
  approvalFormController.changeApprovalFormStatus
);
ApprovalForm.put(
  "/change-dismantle-date/:id",
  approvalFormController.changeDismantleDateByID
);
ApprovalForm.get(
  "/project/:id",
  approvalFormController.getApprovalFormByProjectId
);
ApprovalForm.get("/:id/search", approvalFormController.searchApprovalForms);
ApprovalForm.get("/:id/search-logs", approvalFormController.searchLogs);

module.exports = ApprovalForm;
