const Invite = require("../model/invite");
const User = require("../model/user");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const Project = require("../model/project");
const { getFileDataByUserId } = require("./fileController");
const ActionLogsSchema = require("../model/actionLogsSchema");
require("dotenv").config();

exports.inviteData = async (req, res) => {
  try {
    const { email, projectNumber, type, projectId, userId } = req.body;

    // Input validation
    if (!email || !projectNumber || !projectId) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: email, projectNumber, or projectId"
      });
    }

    // Parallel database queries for existing data
    const [projectFind, existingUser, existingInvite] = await Promise.all([
      Project.findOne({ projectNumber }).lean(),
      User.findOne({ email }).lean(),
      Invite.findOne({ projectNumber, email }).lean()
    ]).catch(error => {
      console.error('Database query error:', error);
      throw new Error('Failed to fetch data from database');
    });

    // Check if invite already exists
    if (existingInvite) {
      return res.status(409).json({
        status: "error",
        message: "Invitation already exists for this project."
      });
    }

    // Create new invite
    const newInvite = new Invite({
      email,
      projectNumber,
      projectName: projectFind?.projectName,
      invitedUser: userId,
      type,
      status: 0,
      projectId,
      userId: existingUser?.id
    });

    // Create notification for invite
    const makeNotificationForInvite = new ActionLogsSchema({
      projectId,
      userId,
      isInviteDetails: true,
      invitedUserId: newInvite._id,
      invitedUserEmail: email
    });

    // Save both documents and send email in parallel
    try {
      await Promise.all([
        newInvite.save(),
        makeNotificationForInvite.save(),
        sendEmail(newInvite)
      ]);
    } catch (saveError) {
      console.error('Error saving data or sending email:', saveError);
      throw new Error('Failed to save invitation or send email');
    }

    // Return success response
    return res.status(201).json({
      status: "success",
      project: newInvite
    });

  } catch (error) {
    console.error('Error in inviteData:', error);
    
    // Return appropriate error response
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error. Please try again later."
    });
  }
};

const sendEmail = async (newInvite) => {
  const emailTemplate = fs.readFileSync(
    path.resolve(__dirname, "../views/sendEmail.ejs"),
    "utf8"
  );
  console.log("newInvite", newInvite)
  const projectId = newInvite?.projectId
  const projectName = newInvite?.projectName;
  const projectNumber = newInvite?.projectNumber;
  const actionType = newInvite?.type;
  const id = newInvite?._id;
  const frontendURL = process.env.FRONTENDURL;
  const userId = newInvite.userId;
  const actionText =
    actionType === 0 ? "Admin" : actionType === 1 ? "User" : "Guest";
  const accept = `${frontendURL}/${id}/1/${userId}/${actionType}/${projectId}`;
  const reject = `${frontendURL}/${id}/0/${userId}/${actionType}/${projectId}`;

  const emailHTML = ejs.render(emailTemplate, {
    projectName,
    projectNumber,
    actionText,
    accept,
    reject,
    imageUrl:
      "https://res.cloudinary.com/ddrvpin2u/image/upload/v1716203652/salus_project/wdgu183zkxor971dphyx.jpg",
  });
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    secure: false,
  });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: newInvite?.email,
    subject: "Invite Project",
    html: emailHTML,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("error", error);
    }
    return console.log("sentmail", info.response);
  });
};

exports.updateInviteById = async (req, res) => {
  const { status } = req.body;
  const Id = req.params.id;
  try {
    const existingInvite = await Invite.findById(Id);
    if (!existingInvite) {
      return res
        .status(404)
        .json({ status: "error", message: "Invitation not found" });
    }
    existingInvite.status = status;
    await existingInvite.save();
    res.json({
      status: "success",
      message: "Invitation updated successfully",
      updatedInvite: existingInvite,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.ChangePositionOfInviteeByInviteId = async (req, res) => {
  const { type } = req.body;
  const Id = req.params.id;
  try {
    const existingInvite = await Invite.findById(Id);
    if (!existingInvite) {
      return res
        .status(404)
        .json({ status: "error", message: "Invitation not found" });
    }
    existingInvite.type = type;
    await existingInvite.save();
    const user = await User.findByIdAndUpdate(existingInvite.userId, { $set: { type: type } })
    await user.save()
    res.json({
      status: "success",
      message: "Invitation updated successfully",
      updatedInvite: existingInvite,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.getAllInvite = async (req, res) => {
  try {
    const invite = await Invite.find().populate("projectId").populate("userId");

    res.json({
      status: "success",
      Invite: invite,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Server error" });
  }
};

exports.getAllInviteByProjectId = async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!projectId) {
      return res.status(400).json({
        status: "error",
        error: "ProjectId is required in the query parameters.",
      });
    }
    const invite = await Invite.find({ projectId: projectId })
      .populate("projectId")
      .populate("userId");

    res.json({
      status: "success",
      invite: invite,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Server error" });
  }
};

exports.deleteInvite = async (req, res) => {
  try {
    const { email, projectId } = req.body;
    const findTargetInvite = await Invite.findOne({ email, projectId });
    const id = findTargetInvite?._id;
    const invite = await Invite.findByIdAndDelete(id);
    if (!invite) {
      return res
        .status(404)
        .json({ status: "error", message: "Invitation not found" });
    }
    res.json({ status: "success", message: "Invitation deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Server error" });
  }
};

exports.getAllInviteByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        status: false,
        error: "userId is required in the query parameters.",
      });
    }
    const invite = await Invite.find({ userId: userId })
      .populate("userId")
      .populate("projectId");

    res.json({
      status: true,
      data: invite,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: error });
  }
};
