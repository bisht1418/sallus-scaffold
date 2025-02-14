const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      default: null,
    },
    file: {
      type: String,
      default: null,
    },
    fileType: {
      type: String,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    isFileFrom: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const FileModel = mongoose.model("File", fileSchema);
module.exports = FileModel;
