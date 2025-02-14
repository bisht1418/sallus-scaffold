const path = require("path");
const User = require("../model/user");
const Invite = require("../model/invite");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const axios = require("axios");
require("dotenv").config();

require("dotenv").config();

function formatDateTime() {
  const now = new Date(Date.now());

  const day = now.getDate();
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(now);
  const year = now.getFullYear();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
}

const register = async (req, res) => {
  try {
    // Check if it's a Google sign-in or manual registration
    const isGoogleAuth = req.body.isGoogleAuth || false; // Use this flag to differentiate

    const email = req.body.email; // Get the email from the request body

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({
          status: "error",
          data: "User already exists with this email.",
        });
    }

    if (isGoogleAuth) {
      // Google Authentication Flow
      const { name, googleId, image } = req.body;

      // Create a new user for Google sign-in
      const newUser = new User({
        email,
        name,
        googleId,
        image, // Store Google profile image
      });

      await newUser.save(); // Save the new user

      return res.status(200).send({
        status: "success",
        data: newUser,
      });
    } else {
      // Manual Registration Flow
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const adduser = {
        email,
        name: req.body.name,
        password: hashedPassword,
        type: req.body.type,
        phoneNumber: req.body.phoneNumber,
        company: req.body.company,
        createdBy: req.body.createdBy || null,
        isCreatedBySuperAdmin: req.body.isCreatedBySuperAdmin,
      };

      const user = new User(adduser);
      await user.save(); // Save the new user

      // Handle invite user logic
      if (req.body.invite_id) {
        await Invite.findByIdAndUpdate(
          req.body.invite_id,
          { userId: user._id.toString() },
          { new: true }
        );
      }

      delete adduser.password; // Remove password from the response

      return res.status(200).send({
        status: "success",
        data: adduser,
      });
    }
  } catch (error) {
    res.status(500).send({ status: "error", data: error.toString() });
  }
};

const sendOTPByEmail = async (email) => {
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const otp = generateOTP();
  const otpExpiration = new Date();
  otpExpiration.setMinutes(otpExpiration.getMinutes() + 5);

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // Gmail SMTP port
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  try {
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "OTP for Login",
      html: `
                <p>Dear User,</p>
                <p>Your One-Time Password (OTP) for login is: <strong>${otp}</strong></p>
                <p>Please use this OTP within the next 5 minutes.</p>
                <p>Thank you,</p>
                <p>Salus Stillas</p>
            `,
    };

    const info = await transport.sendMail(mailOptions);
    return { otp, otpExpiration };
  } catch (error) {
    throw new Error("Failed to send OTP email: " + error.message);
  }
};

const sendOtp = async (email) => {
  try {
    // const user = await User.findOne({ email: email });
    // if (!user) {
    //     throw new Error('User not found');
    // }
    const { otp, otpExpiration } = await sendOTPByEmail(email);
    // user.otp = otp;
    // user.otpExpiration = otpExpiration;
    // await user.save();
    return { otp, otpExpiration };
  } catch (error) {
    throw new Error("Failed to send OTP: " + error.message);
  }
};

const userVerifcation = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Email not found");
    }

    const isPasswordValid = await User.comparePassword(email, password);
    if (!isPasswordValid) {
      throw new Error("Incorrect password");
    }

    await sendOtp(email);
    res.status(200).send({
      status: "success",
      data: "OTP has been sent to your email. Use it to complete the login.",
      email: email,
      user: user,
    });
  } catch (error) {
    res.status(500).send({ status: "error", data: error.message });
  }
};

const registerOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const returnOtpValue = await sendOtp(email);
    res.status(200).send({
      status: "success",
      data: "OTP has been sent to your email. Use it to complete the login.",
      email: email,
      returnOtpValue,
    });
  } catch (error) {
    res.status(500).send({ status: "error", data: error.message });
  }
};

const login = async (req, res) => {
  console.log("login", login);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .send({ status: "error", message: "Invalid email or password" });
    }
    let emailResponse;
    const demoData = {
      email: "post@salusscaffold.com",
      requesterName: user?.name,
      requesterEmail: user?.email,
      time: formatDateTime(),
      companyName: user?.company,
      phoneNumber: user?.phoneNumber,
    };
    if (user?.isDemoAccount) {
      emailResponse = await sendEmailNotification(demoData);
    }
    const { token, refreshToken } = await User.generateAuthToken(user._id);
    res.status(200).send({
      status: "success",
      data: {
        user: user,
        token: token,
        refreshToken: refreshToken,
        emailResponse: emailResponse || null,
      },
    });
  } catch (error) {
    res.status(500).send({ status: "error", data: error.toString() });
  }
};

const verifyOTP = async (email, otp) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    return false;
  }
  const otpExpirationDate = new Date(user.otpExpiration);
  if (user.otp === otp && otpExpirationDate.getTime() > new Date().getTime()) {
    return true;
  } else {
    return false;
  }
};

const reSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Email not found");
    }

    await sendOtp(email);
    res.status(200).send({
      status: "success",
      data: "OTP has been sent to your email. Use it to complete the login.",
    });
  } catch (error) {
    res.status(500).send({ status: "error", data: error.message });
  }
};

const searchEmailForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Email not found");
    }

    await sendOtpForgetPassword(email);
    res.status(200).send({
      status: "success",
      data: "OTP has been sent to your email. Use it to Forget password.",
      email: email,
    });
  } catch (error) {
    res.status(500).send({ status: "error", data: error.message });
  }
};

const sendOTPByEmailForgetPassword = async (email) => {
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const otp = generateOTP();
  const otpExpiration = new Date();
  otpExpiration.setMinutes(otpExpiration.getMinutes() + 5);

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // Gmail SMTP port
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  try {
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "OTP for Password Reset",
      html: `
                <p>Dear User,</p>
                <p>You have requested to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
                <p><strong>OTP: ${otp}</strong></p>
                <p>This OTP is valid for 5 minutes only. If you did not request this change, please ignore this email.</p>
                <p>Thank you,</p>
                <p>Salus Scaffold</p>
            `,
    };

    const info = await transport.sendMail(mailOptions);
    return { otp, otpExpiration };
  } catch (error) {
    throw new Error("Failed to send OTP email: " + error.message);
  }
};

const sendOtpForgetPassword = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }
    const { otp, otpExpiration } = await sendOTPByEmailForgetPassword(email);
    user.otpForgetPassword = otp;
    user.otpExpirationForgetPassword = otpExpiration;
    await user.save();
  } catch (error) {
    throw new Error("Failed to send OTP: " + error.message);
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const isOTPValid = await verifyOTPForgetPassword(email, otp);
    if (!isOTPValid) {
      throw new Error("Invalid OTP");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otpForgetPassword = null;
    await user.save();

    res
      .status(200)
      .send({ status: "success", data: "Password reset successfully" });
  } catch (error) {
    res.status(500).send({ status: "error", data: error.toString() });
  }
};

const verifyOTPForgetPassword = async (email, otp) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    return false;
  }
  const otpExpirationDate = new Date(user.otpExpirationForgetPassword);
  if (
    user.otpForgetPassword === otp &&
    otpExpirationDate.getTime() > new Date().getTime()
  ) {
    return true;
  } else {
    return false;
  }
};

const userdata = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user?._id });
    console.log(user,'user')
    if (!user) throw new Error("Invalid User");
    res.status(200).send({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).send({ status: "error", data: error.toString() });
  }
};

const generateRefreshToken = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res
        .status(401)
        .send({ status: "error", data: "Invalid Referesh Token" });
    const result = jwt.verify(token, process.env.JWTPRIVATEKEY2);
    const { token: accessToken, refreshToken } = await User.generateAuthToken(
      result?._id
    );
    res.status(200).send({
      status: "success",
      data: {
        token: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    res.status(403).send({ status: "error", data: "Invalid Referesh Token" });
  }
};

const getAllUserExceptAdmin = async (req, res) => {
  try {
    const users = await User.find({ type: { $ne: 0 } });
    if (users.length === 0) throw new Error("No user found");
    res.json({ status: true, data: users });
  } catch (error) {
    res.json({ status: false, data: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) throw new Error("No user found");
    res.json({ status: true, data: users });
  } catch (error) {
    res.json({ status: false, data: error.message });
  }
};

const sendEmailNotification = async (data) => {
  try {
    const emailTemplate = fs.readFileSync(
      path.resolve(__dirname, "../views/demoAccountNotificationSend.ejs"),
      "utf8"
    );
    const emailHTML = ejs.render(emailTemplate, {
      logoUrl:
        "https://res.cloudinary.com/ddrvpin2u/image/upload/v1716203652/salus_project/wdgu183zkxor971dphyx.jpg",
      requesterName: data?.requesterName,
      requesterEmail: data?.requesterEmail,
      time: data?.time,
      phoneNumber: data?.phoneNumber,
      companyName: data?.companyName,
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
      to: data.email,
      subject: "Send Notification",
      html: emailHTML,
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return error;
      } else {
        return info.response;
      }
    });
  } catch (error) {
    return error;
  }
};

const scheduleDeactivation = (user) => {
  const now = new Date();
  const demoExpireTime = new Date(user.demoExpireTime);

  const delay = demoExpireTime.getTime() - now.getTime();

  if (delay > 0) {
    setTimeout(async () => {
      user.isDemoExpire = true;
      await user.save();
      console.log("Deactivated account:==>>", user.email);
    }, delay);
  } else {
    (async () => {
      user.isDemoExpire = true;
      await user.save();
      console.log("Deactivated account:====>>>>", user.email);
    })().catch((err) => {
      console.error("Error deactivating account:", err);
    });
  }
};

const deactivateExpiredAccounts = async () => {
  const now = new Date();
  const expiredAccounts = await User.find({
    demoExpireTime: { $lte: now },
    isDemoExpire: false,
  });

  for (const user of expiredAccounts) {
    user.status = true;
    await user.save();
    console.log("Deactivated account:", user.email);
  }
};

const initializeDeactivationSchedules = async () => {
  const activeUsers = await User.find({ isDemoAccount: true });
  activeUsers.forEach(scheduleDeactivation);
};

const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: false, message: "Email is required" });
    }
    const deletedUser = await User.findOneAndDelete({ email });
    if (!deletedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    return res.json({
      status: true,
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

// const googleLogin = async (req, res) => {
//   try {
//     const { access_token } = req.body;

//     const googleUserInfo = await axios.get(
//       `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
//     );

//     console.log("googleUserInfo", googleUserInfo);

//     const { sub: googleId, email, name, picture: image } = googleUserInfo.data;

//     let user = await User.findOne({ email });

//     if (user) {
//       if (user.googleId) {
//         const token = jwt.sign(
//           { userId: user._id },
//           process.env.JWTPRIVATEKEY,
//           {
//             expiresIn: "1h",
//           }
//         );

//         return res.status(200).json({ token, data: { user, token } });
//       } else {
//         return res
//           .status(400)
//           .json({
//             error: "Email is already registered with a different method.",
//           });
//       }
//     } else {
//       user = new User({
//         googleId,
//         email,
//         name,
//         image,
//         password: "not_required",
//       });

//       await user.save();
//       const token = jwt.sign({ userId: user._id }, process.env.JWTPRIVATEKEY, {
//         expiresIn: "1h",
//       });

//       return res.status(201).json({ token, data: { user, token } });
//     }
//   } catch (error) {
//     console.error("Google login error:", error);

//     if (error.response && error.response.data) {
//       return res.status(500).json({ error: error.response.data });
//     }

//     return res
//       .status(500)
//       .json({ error: "An error occurred during Google login." });
//   }
// };

// const googleLogin = async (req, res) => {
//   try {
//     const { access_token } = req.body;

//     const googleUserInfo = await axios.get(
//       `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
//     );

//     console.log("googleUserInfo", googleUserInfo);

//     const { sub: googleId, email, name, picture: image } = googleUserInfo.data;

//     let user = await User.findOne({ email });

//     if (user) {
//       if (user.googleId) {
//         const token = jwt.sign({ _id: user._id, user }, process.env.JWTPRIVATEKEY, {
//           noTimestamp: true,
//           expiresIn: "24h",
//         });
//         const refreshToken = jwt.sign({ _id: user._id, user }, process.env.JWTPRIVATEKEY2, {
//           noTimestamp: true,
//           expiresIn: "24h",
//         });

//         return res.status(200).send({
//           status: "success",
//           data: {
//             token,
//             refreshToken,
//             user
//           }
//         });
//       } else {
//         return res
//           .status(400)
//           .json({
//             error: "Email is already registered with a different method.",
//           });
//       }
//     } else {
//       user = new User({
//         googleId,
//         email,
//         name,
//         image,
//         password: "not_required",
//       });

//       await user.save();
//       const token = jwt.sign({ _id: user._id, user }, process.env.JWTPRIVATEKEY, {
//         noTimestamp: true,
//         expiresIn: "24h",
//       });
//       const refreshToken = jwt.sign({ _id: user._id, user }, process.env.JWTPRIVATEKEY2, {
//         noTimestamp: true,
//         expiresIn: "24h",
//       });

//       return res.status(201).send({
//         status: "success",
//         data: {
//           token,
//           refreshToken,
//           user
//         }
//       });
//     }
//   } catch (error) {
//     console.error("Google login error:", error);

//     if (error.response && error.response.data) {
//       return res.status(500).json({ error: error.response.data });
//     }

//     return res
//       .status(500)
//       .json({ error: "An error occurred during Google login." });
//   }
// };




const googleLogin = async (req, res) => {
  try {
    const { access_token } = req.body;

    const googleUserInfo = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );

    const { sub: googleId, email, name, picture: image } = googleUserInfo.data;

    let user = await User.findOne({ email });

    if (user) {
      if (user.googleId) {
        // Check for missing fields (e.g., phoneNumber, company)
        const isProfileIncomplete = !user.phoneNumber || !user.company || !user.name;
        // const isProfileIncomplete = !user.phoneNumber || !user.company;

        const token = jwt.sign({ _id: user._id, user }, process.env.JWTPRIVATEKEY, {
          noTimestamp: true,
          expiresIn: "24h",
        });

        const refreshToken = jwt.sign({ _id: user._id, user }, process.env.JWTPRIVATEKEY2, {
          noTimestamp: true,
          expiresIn: "24h",
        });

        return res.status(200).send({
          status: "success",
          data: {
            token,
            refreshToken,
            user: {
              ...user?._doc,
              email: user.email,
              name: user.name,
              image: user.image,
              phoneNumber: user.phoneNumber,
              company: user.company,
              isProfileIncomplete, // Add this field to inform frontend
            },
          },
        });
      } else {
        return res.status(400).json({
          error: "Email is already registered with a different method.",
        });
      }
    } else {
      // New user - create a record with Google data
      user = new User({
        googleId,
        email,
        name: name || null, // Name might be missing, so store as null
        image,
        password: "not_required",
      });

      await user.save();

      const token = jwt.sign({ _id: user._id, user }, process.env.JWTPRIVATEKEY, {
        noTimestamp: true,
        expiresIn: "24h",
      });

      const refreshToken = jwt.sign({ _id: user._id, user }, process.env.JWTPRIVATEKEY2, {
        noTimestamp: true,
        expiresIn: "24h",
      });

      return res.status(201).send({
        status: "success",
        data: {
          token,
          refreshToken,
          user: {
            email: user.email,
            name: user.name,
            image: user.image,
            phoneNumber: user.phoneNumber || null,
            company: user.company || null,
            isProfileIncomplete: true, // New users will likely have incomplete profiles
          },
        },
      });
    }
  } catch (error) {
    console.error("Google login error:", error);

    if (error.response && error.response.data) {
      return res.status(500).json({ error: error.response.data });
    }

    return res.status(500).json({ error: "An error occurred during Google login." });
  }
};


module.exports = {
  googleLogin,
  register,
  login,
  userVerifcation,
  userdata,
  generateRefreshToken,
  reSendOtp,
  searchEmailForgetPassword,
  forgetPassword,
  registerOtp,
  getAllUserExceptAdmin,
  deactivateExpiredAccounts,
  initializeDeactivationSchedules,
  getAllUsers,
  deleteUser,
};
