const AdminUser = require("../model/adminAuthModal");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.adminRegister = async (req, res) => {
  try {
    const { email, password, userName, phoneNumber } = req.body;

    const emailExist = await AdminUser.findOne({ email });
    if (emailExist) {
      return res
        .status(400)
        .send({ status: false, message: "Email is already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new AdminUser({
      email,
      userName,
      password: hashedPassword,
      phoneNumber,
      isSuperAdmin: true,
    });
    const savedUser = await newUser.save();

    return res.status(201).send({
      status: true,
      data: savedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .send({ status: false, message: "Invalid Email or Password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ status: false, message: "Invalid Email or Password" });
    }
    const tokenPayload = { _id: user._id, email: user.email };
    const token = jwt.sign(tokenPayload, process.env.JWTPRIVATEKEY, {
      expiresIn: "24h",
      noTimestamp: true,
    });
    const refreshToken = jwt.sign(tokenPayload, process.env.JWTPRIVATEKEY2, {
      expiresIn: "24h",
      noTimestamp: true,
    });
    return res.status(200).send({
      status: true,
      token,
      refreshToken,
      data: {
        _id: user._id,
        email: user.email,
        userName: user.userName,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

exports.onlyAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, type: 0 });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .send({ status: false, message: "Invalid email or password" });
    }
    const { token, refreshToken } = await User.generateAuthToken(user._id);
    res.status(200).send({
      status: true,
      token: token,
      refreshToken: refreshToken,
      data: {
        user: user,
      },
    });
  } catch (error) {
    res.status(500).send({ status: "error", data: error.toString() });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.find({ createdBy: req.params.id });
    if (!user) {
      return res.status(404).send({ status: false, message: "User not found" });
    }
    return res.status(200).send({ status: true, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: "Server error" });
  }
};
