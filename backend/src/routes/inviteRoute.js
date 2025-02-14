const express = require("express");
const {
  inviteData,
  updateInviteById,
  getAllInvite,
  getAllInviteByProjectId,
  deleteInvite,
  getAllInviteByUserId,
  ChangePositionOfInviteeByInviteId,
} = require("../controller/inviteController");

const inviteRoute = express.Router();

inviteRoute.post("/invite-store", inviteData); 
inviteRoute.put("/update-invite/:id", updateInviteById);
inviteRoute.put("/update-position/:id", ChangePositionOfInviteeByInviteId);
inviteRoute.get("/", getAllInvite);
inviteRoute.get("/invite-user/:id", getAllInviteByProjectId);
inviteRoute.get("/invite-user/user-id/:userId", getAllInviteByUserId);
inviteRoute.put("/remove-invite", deleteInvite);
module.exports = inviteRoute;
