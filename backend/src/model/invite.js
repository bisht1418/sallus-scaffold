const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  projectNumber: {
    type: String,
    default: 0,
  },
  projectName: {
    type: String,
    default: null,
  },
  invitedUser: {
    type: String,
    default: null
  },
  type: {
    type: Number,
    default: 0,
  },
  status: {
    type: Number,
    default: null,
  },
  projectId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "project",
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    default: null,
  },
});

const Invite = mongoose.model("invite", inviteSchema);

module.exports = Invite;
