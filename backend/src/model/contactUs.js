const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
    email: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    additionalInformation: {
        type: String,
        default: null
    },
    requestDetail: {
        type: String,
        default: null
    },
    companyName: {
        type: String,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
     phoneNumber: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const ContactUsModel = mongoose.model("ContactUs", contactUsSchema);
module.exports = ContactUsModel;
