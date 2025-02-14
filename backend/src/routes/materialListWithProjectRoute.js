const express = require("express");
const MaterialListWithProject = express.Router();
const materialController = require("../controller/materialListWithProjectController");
const auth = require("../middleware/auth");
MaterialListWithProject.post(
  "/",
  auth,
  materialController.createMaterialListWithProject
);
MaterialListWithProject.get(
  "/project/:id",
  materialController.getMaterialListWithProject
);
MaterialListWithProject.get(
  "/project-id/:id",
  materialController.getMaterialListWithProjectByProjectId
);
MaterialListWithProject.delete(
  "/:id",
  materialController.deleteMaterialListWithProject
);
MaterialListWithProject.put(
  "/:id",
  materialController.updateMaterialListWithProject
);
MaterialListWithProject.get(
  "/material-id/:id",
  materialController.getMaterialListWithId
);
MaterialListWithProject.get(
  "/admin-permission",
  materialController.getAdminApproval
);
MaterialListWithProject.get(
  "/project-transfer",
  auth,
  materialController.getProjectTransfer
);
MaterialListWithProject.get("/:id", materialController.materialListByCustomId);
MaterialListWithProject.put(
  "/change-materiallist-status/:id",
  materialController.changeMaterialListFormStatus
);
MaterialListWithProject.get(
  "/materiallist-search/search",
  materialController.searchMateriallist
);

MaterialListWithProject.get(
  "/material-list/user-id/:userId",
  materialController?.getMaterialListByUserId
);

module.exports = MaterialListWithProject;
