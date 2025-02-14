const mongoose = require("mongoose");

const actionLogs = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default: null,
        },
        read: {
            type: Boolean,
            default: false,
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "project",
            default: null,
        },
        approvalFormDetail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "approval_form",
            default: null,
        },
        materialListDetail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "material_list_with_project",
            default: null,
        },
        isApprovalDetail: {
            type: Boolean,
            default: false,
        },
        isMaterialListDetail: {
            type: Boolean,
            default: false,
        },
        isEditApprovalDetail: {
            type: Boolean,
            default: false,
        },
        isInviteDetails: {
            type: Boolean,
            default: false,
        },
        invitedUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default: null,
        },
        invitedUserEmail: {
            type: String,
            default: null,
        },
        isEditMaterialListDetail: {
            type: Boolean,
            default: false,
        },
        isObservation: {
            type: Boolean,
            default: false,
        },
        observationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "observation",
            default: null,
        },
        observationStatus: {
            type: String,
            default: null,
        },
        isObservationEdit: {
            type: Boolean,
            default: false,
        },
        isAction: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const ActionLogsSchema = mongoose.model("actionlogs", actionLogs);
module.exports = ActionLogsSchema;
