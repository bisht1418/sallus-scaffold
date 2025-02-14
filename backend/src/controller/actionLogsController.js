const ActionLogsSchema = require("../model/actionLogsSchema");

exports.createActionNotification = async (req, res) => {
  try {
    const { notification, userId } = req.body;

    for (const id of userId) {
      const newNotification = new ActionLogsSchema({
        notification,
        userId: id,
      });
      await newNotification.save();
    }

    res
      .status(201)
      .json({ status: true, message: "Notifications sent successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

exports.getActionNotification = async (req, res) => {
  try {
    const actionNotification = await ActionLogsSchema.find()
      .populate("userId")
      .populate("projectId")
      .populate("approvalFormDetail")
      .populate("materialListDetail")
      .populate("observationId")
      .sort({ createdAt: -1 })

    res.status(200).json({ status: true, data: actionNotification });
  } catch (error) {
    res.status(500).json({ status: false, message: error });
  }
};

exports.deleteActionNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await ActionLogsSchema.findByIdAndDelete(id);
    res.status(200).json({ status: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

exports.updateActionNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { notification } = req.body;
    await ActionLogsSchema.findByIdAndUpdate(id, { notification });
    res.status(200).json({ status: true, message: "Notification updated" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

exports.readActionNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = await ActionLogsSchema.findByIdAndUpdate(id, {
      read: true,
    });
    res.status(200).json({ status: true, message: "Notification read" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

exports.getNotificationByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const notification = await ActionLogsSchema.find({ userId });
    res.status(200).json({ status: true, data: notification });
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};
