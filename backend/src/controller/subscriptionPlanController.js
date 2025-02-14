const path = require("path");
const SubscriptionPlan = require("../model/subscriptionPlanSchema");
const ejs = require("ejs");
const nodemailer = require("nodemailer");

exports.getSubscriptionPlan = async (req, res) => {
  try {
    const subscriptionPlans = await SubscriptionPlan.find();
    res.status(200).json({ success: true, data: subscriptionPlans });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createSubscriptionPlan = async (req, res) => {
  try {
    const newSubscriptionPlan = await SubscriptionPlan.create(req.body);
    res
      .status(201)
      .json({ success: true, subscriptionPlan: newSubscriptionPlan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.editSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSubscriptionPlan = await SubscriptionPlan.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, subscriptionPlan: updatedSubscriptionPlan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    await SubscriptionPlan.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Subscription plan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.sendSpecialSubscriptionMail = async (req, res) => {
  const userDetails = req?.body;
  try {
    const subscriberDetails = {
      subscriberName: userDetails?.name,
      companyName: userDetails?.email,
      subscriberEmail: userDetails?.email,
      phoneNumber: userDetails?.phoneNumber,
      subscriptionPlan: userDetails?.mainTitle,
      subscriptionType: userDetails?.priceType,
      time: new Date().toLocaleString(),
      logoUrl:
        "https://res.cloudinary.com/ddrvpin2u/image/upload/v1716203652/salus_project/wdgu183zkxor971dphyx.jpg",
      sendMailTo: "post@salusscaffold.com",
      subject: "Subscription Confirmation",
    };

    const emailResponse = await sendEmail(subscriberDetails);

    if (emailResponse?.status) {
      res.status(200).json({
        success: true,
        message: "Email sent successfully",
        data: emailResponse.data,
      });
    } else {
      res.status(500).json({
        success: false,
        error: emailResponse?.error || "Failed to send email",
      });
    }
  } catch (error) {
    console.error("Error sending subscription email:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

exports.prizeMail = async (req, res) => {
  try {
    const { body: data } = req;
    const updatedData = {
      ...data,
      imageUrl: "https://res.cloudinary.com/ddrvpin2u/image/upload/v1716203652/salus_project/wdgu183zkxor971dphyx.jpg"
    };

    const emailResponse = await sendEmailPrize(updatedData);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      data: updatedData,
      emailResponse
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred"
    });
  }
};


const sendEmail = async (subscriberDetails) => {
  return new Promise((resolve, reject) => {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      secure: false,
    });

    const templatePath = path.join(
      __dirname,
      "../",
      "views",
      "specialSubscriptionMailToAdmin.ejs"
    );

    ejs.renderFile(templatePath, subscriberDetails, (err, htmlContent) => {
      if (err) {
        reject(err);
        return;
      }

      const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: subscriberDetails.sendMailTo,
        subject: subscriberDetails.subject,
        html: htmlContent,
      };

      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ status: true, data: info.response });
      });
    });
  });
};

const sendEmailPrize = async (data) => {
  try {
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, 
      secure: false, 
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const templatePath = path.join(__dirname, '../', 'views', 'prizeMail.ejs');

    const htmlContent = await ejs.renderFile(templatePath, data);

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: 'Post@salusscaffold.com',
      subject: 'Meeting Request Notification',
      html: htmlContent,
    };
    const info = await transport.sendMail(mailOptions);

    return { status: true, data: info.response };

  } catch (error) {
    throw new Error(error.message || 'Failed to send email');
  }
};
