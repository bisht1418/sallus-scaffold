const express = require("express");
const adminAuthRouter = express.Router();
const adminAuthController = require("../controller/adminAuthController");

adminAuthRouter.post("/admin-signup", adminAuthController?.adminRegister);
adminAuthRouter.post("/admin-signin", adminAuthController?.adminLogin);
adminAuthRouter.post("/only-admin-signin", adminAuthController?.onlyAdminLogin);

adminAuthRouter.post("/user/:id", adminAuthController?.getUserById);

module.exports = adminAuthRouter;
