const AfterControlVisualInspectionSchema = require("../model/afterControlVisualInspection");

exports.getAfterControlVisualInspectionForm = async (req, res) => {
  try {
    const approvalFormId = req.params.approvalFormId;
    const afterControlForms = await AfterControlVisualInspectionSchema.find({
      approvalFormId,
    });

    if (!afterControlForms || afterControlForms.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No after control visual inspection forms found",
      });
    }

    const visualData = afterControlForms[0].visualData;

    res.json({ status: "success", data: visualData });
  } catch (error) {
    console.error("Error retrieving after control forms:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.editAfterControlVisualInspectionForm = async (req, res) => {
  try {
    const { approvalFormId } = req.params;
    const updatedAfterControlForm =
      await AfterControlVisualInspectionSchema.findOneAndUpdate(
        { approvalFormId: approvalFormId },
        req.body,
        { new: true }
      );

    if (!updatedAfterControlForm) {
      return res
        .status(404)
        .json({ status: "error", message: "Form not found" });
    }

    res.json({ status: "success", data: updatedAfterControlForm });
  } catch (error) {
    console.error("Error editing after control form:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
