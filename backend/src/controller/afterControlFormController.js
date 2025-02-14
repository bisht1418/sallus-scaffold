const AfterControlFormSchema = require("../model/afterControlFormSchema");

exports.createAfterControlForm = async (req, res) => {
  try {
    const newAfterControlForm = new AfterControlFormSchema(req.body);
    const savedAfterControlForm = await newAfterControlForm.save();
    res.json(savedAfterControlForm);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getAfterControlForm = async (req, res) => {
  try {
    const afterControlForms = await AfterControlFormSchema.find()
      .populate("projectId")
      .populate("userId")
      .populate("approvalFormId");
    res.json(afterControlForms);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving after_control_forms" });
  }
};

exports.editAfterControlForm = async (req, res) => {
  try {
    const editedAfterControlForm =
      await AfterControlFormSchema.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

    res.json(editedAfterControlForm);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.deleteAfterControlFormData = async (req, res) => {
  try {
    const file = await AfterControlFormSchema.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    res.status(200).json({
      message: "File soft-deleted successfully",
      file,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAfterControlFormByProjectId = async (req, res) => {
  try {
    const afterControlForm = await AfterControlFormSchema.find({
      projectId: req.params.projectId,
    })
      .populate("projectId")
      .populate("userId")
      .populate("approvalFormId");
    res.json(afterControlForm);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving after_control_forms" });
  }
};

exports.getAfterControlFormById = async (req, res) => {
  try {
    const afterControlForm = await AfterControlFormSchema.findById(
      req.params.id
    )
      .populate("projectId")
      .populate("userId")
      .populate("approvalFormId");
    res.json(afterControlForm);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving after_control_forms" });
  }
};
