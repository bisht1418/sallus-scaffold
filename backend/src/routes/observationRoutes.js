const express = require("express");
const ObservationRoutes = express.Router();
const auth = require("../middleware/auth");
const observationController = require("../controller/observationController");

ObservationRoutes.get("/", observationController.getObservation);
ObservationRoutes.post("/", observationController.addObservation);
ObservationRoutes.delete("/:id", observationController.deleteObservation);
ObservationRoutes.put("/:id", observationController.editObservation);
ObservationRoutes.get("/:id", observationController.getObservationById);
ObservationRoutes.get(
  "/project/:id",
  observationController.getObservationByProjectId
);
ObservationRoutes.put(
  "/change-observation-status/:id",
  observationController.changeObservationFormStatus
);

ObservationRoutes.get(
  "/user-id/:userId",
  observationController?.getObservationByUserId
);
module.exports = ObservationRoutes;
