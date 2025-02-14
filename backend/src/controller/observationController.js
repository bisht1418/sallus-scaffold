const ActionLogsSchema = require("../model/actionLogsSchema");
const ObservationSchema = require("../model/observation");

exports.getObservation = async (req, res) => {
  try {
    const observations = await ObservationSchema.find({})
      .populate("userId")
      .populate("projectId")
      .exec();

    if (!observations || observations.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No observations found." });
    }

    res.status(200).json({
      success: true,
      message: "Observations retrieved successfully.",
      data: observations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve observations.",
      error: error.message,
    });
  }
};

exports.addObservation = async (req, res) => {
  try {
    const observation = new ObservationSchema(req.body);
    await observation.save();
    const makeNotificationForObservation = await ActionLogsSchema({
      projectId: req?.body?.projectId,
      userId: req?.body?.userId,
      isObservation: true,
      observationId: observation?._id,
      observationStatus: "latest",
    });
    await makeNotificationForObservation.save();
    res.status(201).json({
      success: true,
      message: "Observation added successfully.",
      data: observation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add observation.",
      error: error.message,
    });
  }
};

exports.deleteObservation = async (req, res) => {
  try {
    const observation = await ObservationSchema.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!observation) {
      return res
        .status(404)
        .json({ success: false, message: "Observation not found." });
    }
    res.status(200).json({
      status: true,
      success: true,
      message: "Observation soft-deleted successfully.",
      data: observation,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      success: false,
      message: "Failed to soft-delete observation.",
      error: error.message,
    });
  }
};

exports.editObservation = async (req, res) => {
  try {
    const observation = await ObservationSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!observation) {
      return res
        .status(404)
        .json({ success: false, message: "Observation not found." });
    }
    res.status(200).json({
      success: true,
      message: "Observation updated successfully.",
      data: observation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update observation.",
      error: error.message,
    });
  }
};

exports.getObservationById = async (req, res) => {
  try {
    const observation = await ObservationSchema.findById(req.params.id)
      .populate("userId")
      .populate("projectId")
      .exec();
    if (!observation) {
      return res
        .status(404)
        .json({ success: false, message: "Observation not found." });
    }
    res.status(200).json({
      success: true,
      message: "Observation retrieved successfully.",
      data: observation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve observation.",
      error: error.message,
    });
  }
};

exports.getObservationByProjectId = async (req, res) => {
  try {
    const observation = await ObservationSchema.find({
      projectId: req.params.id,
    })
      .populate("userId")
      .populate("projectId")
      .exec();
    res.status(200).json({
      status: "success",
      data: observation,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve observation ",
      error: error.message,
    });
  }
};

exports.getObservationByUserId = async (req, res) => {
  try {
    const observation = await ObservationSchema.find({
      userId: req.params.userId,
    })
      .populate("userId")
      .populate("projectId")
      .exec();
    res.status(200).json({
      status: "success",
      data: observation,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve observation ",
      error: error.message,
    });
  }
};
exports.changeObservationFormStatus = async (req, res) => {
  try {
    const file = await ObservationSchema.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { status: req.body.status } },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const makeNotificationForObservationStatus = await ActionLogsSchema({
      projectId: file?.projectId,
      userId: file?.userId,
      isObservationEdit: true,
      observationId: file?._id,
      observationStatus: req?.body?.status,
    });
    await makeNotificationForObservationStatus.save();

    res.status(200).json({
      message: "File status changed successfully",
      file,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
