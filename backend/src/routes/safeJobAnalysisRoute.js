const express = require("express");
const auth = require("../middleware/auth");
const {
  addSafeJobAnalysis,
  getSafeJobAnalysis,
  deleteSafeJobAnalysis,
  updateSafeJobAnalysis,
  getSafeJobAnalysisById,
  getSafeJobAnalysisByProjectId,
  getSafeJobAnalysisByUserId,
} = require("../controller/safeJobAnalysisController");
const SafeJobAnalysisRoute = express.Router();

SafeJobAnalysisRoute.get("/", getSafeJobAnalysis);
SafeJobAnalysisRoute.post("/create", addSafeJobAnalysis);
SafeJobAnalysisRoute.put("/:id", updateSafeJobAnalysis);
SafeJobAnalysisRoute.delete("/:id", deleteSafeJobAnalysis);
SafeJobAnalysisRoute.get("/:id", getSafeJobAnalysisById);
SafeJobAnalysisRoute.get("/projectId/:id", getSafeJobAnalysisByProjectId);

SafeJobAnalysisRoute.get("/admin-sja/:userId", getSafeJobAnalysisByUserId);

module.exports = SafeJobAnalysisRoute;
