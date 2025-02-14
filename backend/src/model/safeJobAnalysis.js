const mongoose = require("mongoose");

const safeJobAnalysisSchema = new mongoose.Schema(
    {
        projectDetail: {
            type: Object,
            default: null
        },
        dateOfApproval: {
            type: String,
            default: null
        },
        signature: {
            type: Object,
            default: null
        },
        responsibleWorkers: {
            type: Object,
            default: null
        },
        distribution: {
            type: Object,
            default: null
        },
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "user",
        },
        projectId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "project",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            default: "active",
        },
        comments: {
            type: String,
            default: null
        },
        scaffoldData: {
            type: Object,
            default: []
        },
        notificationToAdminCreate: {
            type: Boolean,
            default: false
        },
        notificationToAdminEdit: {
            type: Boolean,
            default: false
        },
        protectiveEquipment: {
            type: Object,
            default: null
        },
        typeOfWork: {
            type: Object,
            default: null
        },
        designatedWorkArea: {
            type: Object,
            default: null
        },
        emergencyProcedure: {
            type: String,
            default: null
        },
        isSJAForm: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

const SafeJobAnalysis = mongoose.model("safe-job-analysis", safeJobAnalysisSchema);

module.exports = SafeJobAnalysis;