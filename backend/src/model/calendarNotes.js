const mongoose = require("mongoose");

const calendarNotesSchema = new mongoose.Schema({
    start: {
        type: Date,
    },
    end: {
        type: Date,
    },
    title: {
        type: String,
    },
    projectId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "project",
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    }

});

const calendarNotes = mongoose.model("calendarNotes", calendarNotesSchema);

module.exports = calendarNotes;