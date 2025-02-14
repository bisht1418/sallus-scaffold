const express = require("express");
const {
  register,
  login,
  userdata,
  generateRefreshToken,
  userVerifcation,
  reSendOtp,
  searchEmailForgetPassword,
  forgetPassword,
  registerOtp,
  getAllUserExceptAdmin,
  getAllUsers,
  deleteUser,
  googleLogin
} = require("../controller/userController");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const userRouter = express.Router();

const User = require('../model/user'); // Adjust the path to your User model
const authenticate = require('../middleware/auth');

userRouter.post("/signup", upload.single("img"), register);
userRouter.post("/signin", login);
userRouter.get("/get-all-user", getAllUserExceptAdmin);
userRouter.get("/all-users", getAllUsers);
userRouter.get("/me", auth, userdata);
userRouter.get("/refreshToken", generateRefreshToken);
userRouter.post("/send-otp", userVerifcation);
userRouter.post("/send-otp-register", registerOtp);
userRouter.post("/resend-otp", reSendOtp);
userRouter.post("/send-otp-forget-password", searchEmailForgetPassword);
userRouter.post("/forget-password", forgetPassword);
userRouter.post("/delete-user", deleteUser);

userRouter.post('/google-login', googleLogin);

userRouter.put('/update-profile', authenticate, async (req, res) => {
  const { phoneNumber, company } = req.body;
  const userId = req.user._id; // Assuming user ID is available in req.user after authentication

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.company = company || user.company;

    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      data: {
        phoneNumber: user.phoneNumber,
        company: user.company,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = userRouter;
