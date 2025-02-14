const express = require("express");
const ScaffoldLogRouter = express.Router();
const scaffoldLogController = require("../controller/scaffoldLogsController");

ScaffoldLogRouter.get("/", scaffoldLogController.getAllScaffoldLogs);
ScaffoldLogRouter.get("/:id", scaffoldLogController.getScaffoldLogById);
ScaffoldLogRouter.get(
  "/scaffold-search/search",
  scaffoldLogController.searchScaffoldLogs
);

module.exports = ScaffoldLogRouter;
