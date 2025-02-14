const calendarNotesSchema = require("../model/calendarNotes")

exports.createCalendarNotes = async (req, res) => {
    try {
        const calendarNotes = new calendarNotesSchema(req.body);
        const savedCalendarNotes = await calendarNotes.save();
        res.json(savedCalendarNotes);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}
exports.getCalendarNotes = async (req, res) => {
    const { projectId, userId } = req.params;
    try {
        const calendarNotes = await calendarNotesSchema.find({
            projectId: projectId,
            userId: userId
        })
            .populate('projectId')
            .populate('userId');
        res.json(calendarNotes);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving after_control_forms' });
    }
}