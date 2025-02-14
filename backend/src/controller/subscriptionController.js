const SubscriptionModel = require("../model/subscriptionSchema");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const User = require("../model/user");
require("dotenv").config();
const bcrypt = require("bcrypt");

exports.getSubscriptionData = async (req, res) => {
  try {
    const SubscriptionModels = await SubscriptionModel.find();
    res.status(200).json({ success: true, data: SubscriptionModels });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserSubscription = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL params

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Find subscription with filters
    const subscription = await SubscriptionModel.findOne({
      userId: userId,
      isInvitedUser: false,
      isActive: true // Assuming you want active subscriptions
    }).sort({ createdAt: -1 }); // Get the most recent subscription

    if (!subscription) {
      return res.status(200).json({
        success: true,
        data: null,
        isSubscriptionFound: false,
        message: 'NO_ACTIVE_SUBSCRIPTION'
      });
    }

    // Add remaining days calculation
    const today = new Date();
    const endDate = new Date(subscription.endTime);
    const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    // Return subscription with additional info
    res.status(200).json({
      success: true,
      data: {
        ...subscription.toObject(),
        remainingDays: remainingDays > 0 ? remainingDays : 0
      }, isSubscriptionFound: true
    });

  } catch (error) {
    console.error('Error fetching user subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription details',
      error: error.message
    });
  }
};

exports.createSubscriptionData = async (req, res) => {
  try {
    const checkAlreadyEmailSubscriber = await SubscriptionModel.find({});

    let isEmailExist = checkAlreadyEmailSubscriber.find(
      (item) => item.userEmail === req.body.userEmail
    );
    if (isEmailExist) {
      return res
        .status(200)
        .json({
          success: false,
          isEmailExist: true,
          message: "Email already exists",
        });
    }

    const newSubscriptionModel = await SubscriptionModel.create(req.body);
    const selectTheDesiredUserData = await SubscriptionModel.findOne({
      userId: req.body.subscribedBy,
    });

    const sendEmailResponse = await sendEmail(newSubscriptionModel);

    let query = {
      isActive: true,
      isDeleted: false,
      $or: [
        { userId: selectTheDesiredUserData?.userId },
        { subscribedBy: selectTheDesiredUserData?.userId }
      ]
    };
    const subscriptionCount = await SubscriptionModel.countDocuments(query);

    await SubscriptionModel.findByIdAndUpdate(
      selectTheDesiredUserData._id,
      { addedUsersCount: subscriptionCount },
      { new: true }
    );

    return res
      .status(201)
      .json({
        success: true,
        data: newSubscriptionModel,
        sendEmailResponse: sendEmailResponse,
      });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.editSubscriptionData = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriptions = await SubscriptionModel.find({ userId: id });
    await Promise.all(
      subscriptions.map(async (subscription) => {
        subscription.isActive = false;
        subscription.isDeleted = true;
        subscription.revokeAccess = true;
        return subscription.save();
      })
    );

    const updatedSubscriptionModel = await SubscriptionModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedSubscriptionModel });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteSubscriptionData = async (req, res) => {
  try {
    const { id } = req.params;
    await SubscriptionModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({
        success: true,
        message: "Subscription plan deleted successfully",
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSubscriptionDataById = async (req, res) => {
  try {
    const { userId } = req.params;
    const SubscriptionModelData = await SubscriptionModel.findOne({ userId });
    res.status(200).json({ success: true, data: SubscriptionModelData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSubscriptionDataBySubscribedBy = async (req, res) => {
  try {
    const { subscribedBy } = req.params;
    //   const SubscriptionModelData = await SubscriptionModel.find({ userId: subscribedBy });
    const SubscriptionModelData = await SubscriptionModel.find({
      $or: [{ userId: subscribedBy }, { subscribedBy: subscribedBy }],
    });
    res.status(200).json({ success: true, data: SubscriptionModelData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSubscriptionDataCount = async (req, res) => {
  try {
    const subscribedBy = req.params.subscribedBy;
    let query = {
      isActive: true,
      isInvitedUser: true,
      $or: [{ userId: subscribedBy }, { subscribedBy: subscribedBy }]
    };

    const subscriptionCount = await SubscriptionModel.countDocuments(query);
    res.status(200).json({ success: true, data: subscriptionCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.revokeSubscription = async (req, res) => {
  try {
    const { userSubscriptionId } = req.params;
    const getTargets = await SubscriptionModel.findById(userSubscriptionId);

    let subscription;
    if (req.body.subscriptionRevokeStatus) {
      subscription = await SubscriptionModel.findByIdAndUpdate(
        userSubscriptionId,
        { isActive: false, revokeAccess: true, plan: null }
      );
    } else {
      subscription = await SubscriptionModel.findByIdAndUpdate(
        userSubscriptionId,
        { isActive: true, revokeAccess: false, plan: null }
      );
    }

    const selectTheDesiredUserData = await SubscriptionModel.findOne({
      userId: getTargets.userId,
    });
    let query = {
      isActive: true,
      isDeleted: false,
      userId: selectTheDesiredUserData?.userId,
    };
    const subscriptionCount = await SubscriptionModel.countDocuments(query);
    await SubscriptionModel.findByIdAndUpdate(
      selectTheDesiredUserData._id,
      { addedUsersCount: subscriptionCount },
      { new: true }
    );

    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, error: "Subscription not found" });
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteSubscriptionUser = async (req, res) => {
  try {
    const { userSubscriptionId } = req.params;

    // First find the subscription to get user details before deletion
    const getTargets = await SubscriptionModel.findById(userSubscriptionId);

    if (!getTargets) {
      return res.status(404).json({
        success: false,
        error: "Subscription not found"
      });
    }

    // Delete the user from User model using email
    await User.findOneAndDelete({ email: getTargets.userEmail });

    // Delete the subscription
    const subscription = await SubscriptionModel.findByIdAndDelete(
      userSubscriptionId
    );

    // Update subscription count for the main user
    const selectTheDesiredUserData = await SubscriptionModel.findOne({
      userId: getTargets.subscribedBy,
    });

    if (selectTheDesiredUserData) {
      let query = {
        isActive: true,
        isDeleted: false,
        subscribedBy: selectTheDesiredUserData?.userId,
      };

      const subscriptionCount = await SubscriptionModel.countDocuments(query);

      await SubscriptionModel.findByIdAndUpdate(
        selectTheDesiredUserData._id,
        { addedUsersCount: subscriptionCount },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "User and subscription deleted successfully",
      data: subscription
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const sendEmail = async (data) => {
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
    const { originalPassword, hashedPassword } =
      await generateAndHashPassword();

    const websiteLink = "https://salusscaffold.com/signin";
    const emailTemplate = fs.readFileSync(
      path.resolve(__dirname, "../views/emailToSubscriberUser.ejs"),
      "utf8"
    );
    const emailHTML = ejs.render(emailTemplate, {
      userName: data.userName,
      clientEmail: data.userEmail,
      website: websiteLink,
      password: originalPassword,
      phoneNumber: data?.phoneNumber,
      company: data?.company,
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
      from: "overlord.client@gmail.com",
      to: data?.userEmail,
      subject: "Invite Subscriber",
      html: emailHTML,
    };

    try {
      const info = await transport.sendMail(mailOptions);

      const existingUser = await User.findOne({ email: data.userEmail });
      let createNewUser;
      if (!existingUser) {
        createNewUser = await User.create({
          name: data.userName,
          email: data.userEmail,
          password: hashedPassword,
          phoneNumber: data?.phoneNumber,
          company: data?.company,
          selfCreated: false,
          specialAccess: true,
          createdBy: data?.subscribedBy,
        });
      }

      return { info: info.response, success: true, newUser: createNewUser };
    } catch (error) {
      return { error: error };
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

exports.cancelMainUserSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    const getUserTargets = await User.findOneAndUpdate(
      { _id: userId },
      { isSubscription: false },
      { new: true }
    );
    res.status(200).json({ success: true, data: getUserTargets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
