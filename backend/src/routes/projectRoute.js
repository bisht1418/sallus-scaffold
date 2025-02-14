const express = require("express");
const {
  createProject,
  getAllProjects,
  getAllProjectsById,
  deleteProjectDataById,
  getAllProjectForSuperAdmin,
  editProjectById,
  getProjectById,
  getProjects,
  searchProjects,
  getAllNotification,
  getProjectByUserId,
  getProjectNameByProjectId,
} = require("../controller/projectController");
const auth = require("../middleware/auth");
const projectRoute = express.Router();

projectRoute.get("/notification", getAllNotification);
projectRoute.post("/create", createProject);
projectRoute.get("/", auth, getAllProjects);
projectRoute.put("/:id", auth, deleteProjectDataById);
projectRoute.get("/get-all-projects", auth, getProjects);
projectRoute.get("/:projectId", getAllProjectsById);

projectRoute.put("/update-project/:id", editProjectById);
projectRoute.get("/get-project-by-id/:id", auth, getProjectById);
projectRoute.get("/project-search/search", auth, searchProjects);

projectRoute.get("/get-all-project/admin", getAllProjectForSuperAdmin);
projectRoute.get("/get-project/:userId", getProjectByUserId);
projectRoute.get("/get-project-name/:id", getProjectNameByProjectId);


module.exports = projectRoute;
