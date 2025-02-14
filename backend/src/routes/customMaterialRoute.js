const express = require("express");
const CustomMaterialController = require("../controller/customListController");
const MaterialRoute = express.Router();

MaterialRoute.post("/", CustomMaterialController.createCustomList);
MaterialRoute.get("/", CustomMaterialController.getAllMaterialList);
MaterialRoute.get(
  "/project-id/:projectId",
  CustomMaterialController.getCustomMaterialListByProjectId
);
MaterialRoute.get(
  "/material-id/:materialListId",
  CustomMaterialController.getCustomMaterialListByMaterialId
);
MaterialRoute.delete(
  "/delete-custom-material/:customListId",
  CustomMaterialController.deleteCustomList
);
MaterialRoute.put(
  "/update-custom-material/:customListId",
  CustomMaterialController.editCustomList
);
MaterialRoute.post(
  "/share-custom-list",
  CustomMaterialController.shareCustomList
);

module.exports = MaterialRoute;
