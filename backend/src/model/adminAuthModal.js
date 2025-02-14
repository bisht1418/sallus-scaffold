const mongoose = require("mongoose");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    userName: {
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
    phoneNumber: {
      type: String,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.generateAuthToken = async (id) => {
  const user = await User.findOne({ _id: id });
  const token = jwt.sign({ _id: id, user }, process.env.JWTPRIVATEKEY, {
    noTimestamp: true,
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ _id: id, user }, process.env.JWTPRIVATEKEY2, {
    noTimestamp: true,
    expiresIn: "1h",
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

const AdminUser = mongoose.model("adminUser", userSchema);

module.exports = AdminUser;
