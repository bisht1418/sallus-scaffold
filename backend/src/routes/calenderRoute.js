const express = require('express');
const { createCalendarNotes, getCalendarNotes } = require('../controller/calendarNotesController');

const auth = require("../middleware/auth")
const calendarNotesRoute = express.Router()

calendarNotesRoute.post('/', createCalendarNotes)
calendarNotesRoute.get('/:projectId/:userId', getCalendarNotes)

module.exports = calendarNotesRoute;