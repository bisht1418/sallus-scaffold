const mongoose = require("mongoose");

const visitorsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: null,
    },
    visitorEmail: {
      type: String,
      default: null,
    },
    visitorName: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const VisitorModel = mongoose.model("visitor", visitorsSchema);
module.exports = VisitorModel;
