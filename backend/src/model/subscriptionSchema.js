const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: null
    },
    userEmail: {
        type: String,
        default: null
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        default: function () {
            return new Date(+this.startTime + 30 * 24 * 60 * 60 * 1000);
        }
    },
    duration: {
        type: Number,
        default: 30 * 24 * 60 * 60 * 1000
    },
    isActive: {
        type: Boolean,
        default: true
    },
    plan: {
        type: String,
        default: null
    },
    grantAccess: {
        type: Boolean,
        default: false
    },
    revokeAccess: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    paidSubscriptionByItself: {
        type: Boolean,
        default: false
    },
    subscribedBy: {
        type: String,
        default: null
    },
    userName: {
        type: String,
        default: null
    },
    addedUsersCount: {
        type: Number,
        default: 0
    },
    planType: {
        type: String,
        default: null
    },
    company: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    phoneNumber: {
        type: String,
        default: null
    },
    isInvitedUser: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const SubscriptionModel = mongoose.model("Subscription", subscriptionSchema);

module.exports = SubscriptionModel;
