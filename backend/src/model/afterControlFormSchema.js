const mongoose = require("mongoose");

const afterControlFormSchema = new mongoose.Schema({

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    },
    approvalFormId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "approval_form",
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        default: null
    },
    reCheckResponsiblePerson: {
        type: String,
        default: null
    },
    reCheckResponsiblePersonName: {
        type: String,
        default: null
    },
    userResponsibleSignature: {
        type: String,
        default: null
    },
    userResponsibleSignatureName: {
        type: String,
        default: null
    },
    comment: {
        type: String,
        default: null
    },
    dateOfCheck: {
        type: Date,
        default: null
    },
    viewInspectorSignatureName: {
        type: String,
        default: null
    },
    viewCustomerSignatureName: {
        type: String,
        default: null
    },
    isAfterControlForm: {
        type: Boolean,
        default: true
    }
});

const afterControlForm = mongoose.model("after_control_form", afterControlFormSchema);
module.exports = afterControlForm;