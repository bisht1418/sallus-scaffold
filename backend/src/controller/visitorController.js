const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
require("dotenv").config();
const VisitorModal = require("../model/websiteVisitModal");

exports.createVisitor = async (req, res) => {
  try {
    const emailResponse = await sendEmail(req.body);
    const visitorDetails = await VisitorModal.create(req.body);

    res
      .status(201)
      .json({ status: true, data: visitorDetails, email: emailResponse });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

exports.getVisitorData = async (req, res) => {
  try {
    const visitorDetails = await VisitorModal.find().populate("userId");
    res.status(201).json({ status: true, data: visitorDetails });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

const createEmailHTML = (templatePath, data) => {
  const emailTemplate = fs.readFileSync(templatePath, "utf8");
  return ejs.render(emailTemplate, data);
};

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    secure: false,
  });
};

const sendEmail = async (data) => {
  try {
    const templatePath = path.resolve(__dirname, "../views/visitorMail.ejs");
    const emailHTML = createEmailHTML(templatePath, {
      visitorName: data.visitorName,
      visitorEmail: data.visitorEmail,
      imageUrl:
        "https://res.cloudinary.com/ddrvpin2u/image/upload/v1716203652/salus_project/wdgu183zkxor971dphyx.jpg",
    });

    const transporter = createTransporter();

    const mailOptions = {
      from: "post@sallusscaffold.com",
      to: "post@sallusscaffold.com",
      subject: "Download User manual Notification",
      html: emailHTML,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
