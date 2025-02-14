const mongoose = require("mongoose");

const materialListSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: null,
    },
    sub_category: {
      type: String,
      default: null,
    },
    sub_category_en: {
      type: String,
      default: null,
    },
    product_no: {
      type: String,
    },
    description: {
      type: String,
    },
    kg: {
      type: Number,
    },
    productName: {
      type: String,
      default: null,
    },

    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      default: null,
    },
    date: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const materialList = mongoose.model("material_lists", materialListSchema);

module.exports = materialList;
