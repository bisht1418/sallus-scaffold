const ApprovalForm = require("../model/approvalForm");
const AfterControlForm = require("../model/afterControlForm");

exports.getApprovalFormByProjectId = async (req, res) => {
  try {
    const approvalForm = await ApprovalForm.find({
      projectId: req.params.id,
    })
      .populate("projectId")
      .populate("userId");
    res.status(200).json({
      success: true,
      message: "success",
      data: approvalForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createAfterControlForm = async (req, res) => {
  try {
    const newAfterControlForm = new AfterControlForm(req.body);
    const savedAfterControlForm = await newAfterControlForm.save();
    res.status(201).json({ status: "Success", data: savedAfterControlForm });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getAfterControlFormData = async (req, res) => {
  try {
    const formData = await AfterControlForm.find({
      projectId: req.params.id,
    })
      .populate("projectId")
      .populate("userId");
    res.status(200).json({ status: "Success", data: formData });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.deleteAfterControlFormData = async (req, res) => {
  try {
    const file = await AfterControlForm.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({
        message: "File not found",
        status: false,
      });
    }

    res.status(200).json({
      message: "File deleted successfully",
      file,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};
exports.editAfterControlForm = async (req, res) => {
  try {
    const editedAfterControlForm = await AfterControlForm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!editedAfterControlForm) {
      return res.status(404).json({ status: false, message: "Form not found" });
    }
    res.status(200).json({ status: true, data: editedAfterControlForm });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

exports.getAfterControlFormDataById = async (req, res) => {
  try {
    const formData = await AfterControlForm.findOne({ _id: req.params.id });
    res.status(200).json({ status: true, data: formData });
  } catch (error) {
    res.status(500).json({ status: false, error: error });
  }
};

exports.addAfterControlValueById = async (req, res) => {
  try {
    const { id, index } = req.params;
    const { visible } = req.body;
    const afterControlForm = await AfterControlForm.findById(id);
    if (!afterControlForm) {
      return res.status(404).json({ error: "AfterControlForm not found" });
    }
    if (
      !afterControlForm.afterControl ||
      index >= afterControlForm.afterControl.length
    ) {
      return res
        .status(400)
        .json({ error: "Index out of range or afterControl array is missing" });
    }
    afterControlForm.afterControl[index].visible = visible;
    const updatedAfterControlForm = await afterControlForm.save();
    res.status(200).json({ status: "Success", data: updatedAfterControlForm });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAfterControlFormByUserId = async (req, res) => {
  try {
    const afterControlForm = await AfterControlForm.find({
      userId: req.params.userId,
    })
      .populate("projectId")
      .populate("userId");
    res.json({ statue: true, data: afterControlForm });
  } catch (error) {
    res.status(500).json({ status: false, error: error });
  }
};
