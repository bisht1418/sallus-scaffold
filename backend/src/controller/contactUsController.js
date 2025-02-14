const ContactUsSchema = require("../model/contactUs");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const User = require("../model/user");
require("dotenv").config();
const bcrypt = require('bcrypt');

const sendEmail = async (data, isQuestionRequest, isRequestSendToAdmin) => {

  const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  };

  const generateAndHashPassword = async () => {
    const originalPassword = "1234abcd#@$%";
    const hashedPassword = await hashPassword(originalPassword);
    return { originalPassword, hashedPassword };
  };
  const { originalPassword, hashedPassword } = await generateAndHashPassword();
  const now = new Date();
  const endTime = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

  const isEmailExist = await User.findOne({ email: data?.email })

  if (isEmailExist) {
    return { error: "Email already exists", status: false };
  } else {
    let createNewUser = await User.create({
      name: data?.name,
      email: data?.email,
      password: hashedPassword,
      phoneNumber: data?.phoneNumber,
      company: data?.companyName,
      selfCreated: false,
      specialAccess: true,
      createdBy: data?.userId,
      isDemoAccount: true,
      demoExpireTime: endTime,
    })
  }

  const userData = {
    userName: data.name || "Client",
    dummyEmail: data?.email,
    dummyPassword: originalPassword,
    phoneNumber: data?.phoneNumber,
    company: data?.companyName,
    website: "https://salusscaffold.com/",
    clientEmail: data.email,
    clientQuestionRequest: data.requestDetail,
    imageUrl: "https://res.cloudinary.com/ddrvpin2u/image/upload/v1716203652/salus_project/wdgu183zkxor971dphyx.jpg"
  };

  const emailTemplatePath = isQuestionRequest
    ? "../views/sendRequest.ejs"
    : isRequestSendToAdmin
      ? "../views/notificationSendToAdmin.ejs"
      : "../views/contactUs.ejs";
  const emailTemplate = fs.readFileSync(
    path.resolve(__dirname, emailTemplatePath),
    "utf8"
  );
  const emailHTML = ejs.render(emailTemplate, userData);
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: isQuestionRequest ? "post@salsusscaffold.com" : data.email,
    subject: isQuestionRequest
      ? "Contact Request"
      : isRequestSendToAdmin
        ? "Notification, New User"
        : "Demo Request",
    html: emailHTML,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    return { sentmail: info.response, status: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: error.message, status: false };
  }
};

exports.sendContactUsForm = async (req, res) => {

  const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  };

  const generateAndHashPassword = async () => {
    const originalPassword = await data?.password;
    const hashedPassword = await hashPassword(originalPassword);
    return { originalPassword, hashedPassword };
  };
  try {
    const contactUsFormData = new ContactUsSchema(req.body);
    const savedAfterControlForm = await contactUsFormData.save();
    const sendEmailResponse = await sendEmail(req.body);

    const response = {
      status: "Success",
      data: savedAfterControlForm,
      sendEmailResponse: sendEmailResponse,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendQuestionRequest = async (req, res) => {
  try {
    req.body.isQuestionRequest = true;
    const contactUsFormData = new ContactUsSchema(req.body);
    const savedAfterControlForm = await contactUsFormData.save();
    const sendEmailResponse = await sendEmail(req.body, true);

    // if (sendEmailResponse.status === "success") {
    //   const sendEmailResponse = await sendEmail(req.body, false, true);
    // }

    const response = {
      status: "Success",
      data: savedAfterControlForm,
      sendEmailResponse: sendEmailResponse,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
