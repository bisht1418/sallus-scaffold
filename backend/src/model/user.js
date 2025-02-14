const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Timestamp } = require("mongodb");
require("dotenv").config();
const userSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      lowercase: true,
      trim: true,
    },
    email: {
      required: true,
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      required: true,
      type: String,
    },
    type: {
      required: true,
      type: Number,
      default: 0,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    company: {
      type: String,
      default: null,
    },
    otp: {
      type: Number,
      default: 0,
    },
    otpExpiration: {
      type: Date,
      default: null,
    },
    otpForgetPassword: {
      type: Number,
      default: 0,
    },
    otpExpirationForgetPassword: {
      type: Date,
      default: null,
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },
    isSubscription: {
      type: Boolean,
      default: null,
    },
    subscriptionType: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    selfCreated: {
      type: Boolean,
      default: true,
    },
    specialAccess: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    planType: {
      type: String,
      default: null,
    },
    isDemoAccount: {
      type: Boolean,
      default: false,
    },
    demoExpireTime: {
      type: String,
      default: null,
    },
    isDemoExpire: {
      type: Boolean,
      default: false,
    },
    isCreatedBySuperAdmin: {
      type: Boolean,
      default: false,
    }, googleId: { 
      type: String , 
      default :null
    },
    image: {
       type: String ,
       default : null
      },
  },
  { Timestamp: true }
);

userSchema.statics.generateAuthToken = async (id) => {
  const user = await User.findOne({ _id: id });
  const token = jwt.sign({ _id: id, user }, process.env.JWTPRIVATEKEY, {
    noTimestamp: true,
    expiresIn: "24h",
  });
  const refreshToken = jwt.sign({ _id: id, user }, process.env.JWTPRIVATEKEY2, {
    noTimestamp: true,
    expiresIn: "24h",
  });
  return { token, refreshToken };
};

userSchema.statics.comparePassword = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("Invalid Email or Password");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid Email or Password");
  return user;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
