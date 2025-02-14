const express = require("express");
const visitorRouter = express.Router();
const visitorController = require("../controller/visitorController");

visitorRouter.get("/get-visitor", visitorController.getVisitorData);
visitorRouter.post("/create-visitor", visitorController.createVisitor);

module.exports = visitorRouter;
