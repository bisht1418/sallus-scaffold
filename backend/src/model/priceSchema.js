const mongoose = require("mongoose");

const priceFormSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "project"
        },
        rent: {
            type: Object

        },
        volume: {
            type: Object
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

const PriceForm = mongoose.model("priceForm", priceFormSchema);

module.exports = PriceForm;
