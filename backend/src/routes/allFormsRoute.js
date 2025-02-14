const express = require("express");
const AllFormRouter = express.Router();
const AllFormsController = require("../controller/allFormsController");

AllFormRouter.get("/get-all-form", AllFormsController.getAllForms);
AllFormRouter.get(
  "/get-all-form/user-id/:userId",
  AllFormsController?.getAllFormByUserId
);

module.exports = AllFormRouter;
