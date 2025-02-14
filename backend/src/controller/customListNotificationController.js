const CustomNotificationSchema = require("../model/customListNotificationModal");

exports.createCustomNotification = async (req, res) => {
  try {
    const { notification, userId } = req.body;

    for (const id of userId) {
      const newNotification = new CustomNotificationSchema({
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

exports.getCustomNotification = async (req, res) => {
  try {
    const customNotification = await CustomNotificationSchema.find();
    res.status(200).json({ status: true, data: customNotification });
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

exports.deleteCustomNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await CustomNotificationSchema.findByIdAndDelete(id);
    res.status(200).json({ status: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

exports.updateCustomNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { notification } = req.body;
    await CustomNotificationSchema.findByIdAndUpdate(id, { notification });
    res.status(200).json({ status: true, message: "Notification updated" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

exports.readCustomNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = await CustomNotificationSchema.findByIdAndUpdate(id, {
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
    const notification = await CustomNotificationSchema.find({ userId });
    res.status(200).json({ status: true, data: notification });
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};
