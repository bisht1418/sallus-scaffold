const ApprovalForm = require("../model/approvalForm");
const SafeJobAnalysis = require("../model/safeJobAnalysis");
const MaterialListWithProject = require("../model/materialListWithProject");
const ObservationSchema = require("../model/observation");
const AfterControlFormSchema = require("../model/afterControlForm");

exports.getAllForms = async (req, res) => {
  try {
    const [
      observations,
      materialListWithProjects,
      safeJobAnalyses,
      approvalForms,
      afterControlForms,
    ] = await Promise.all([
      ObservationSchema.find({})
        .populate("userId")
        .populate("projectId")
        .exec(),
      MaterialListWithProject.find({})
        .populate("projectId")
        .populate({
          path: "materialList.materialId",
          model: "material_lists",
        })
        .exec(),
      SafeJobAnalysis.find({}).populate("userId").populate("projectId").exec(),
      ApprovalForm.find({}).populate("userId").populate("projectId").exec(),
      AfterControlFormSchema.find({})
        .populate("projectId")
        .populate("userId")
        .exec(),
    ]);

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully.",
      data: {
        observations,
        materialListWithProjects,
        safeJobAnalyses,
        approvalForms,
        afterControlForms,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve data.",
      error: error.message,
    });
  }
};

exports.getAllFormByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const [
      observations,
      materialListWithProjects,
      safeJobAnalyses,
      approvalForms,
      afterControlForms,
    ] = await Promise.all([
      ObservationSchema.find({ userId })
        .populate("userId")
        .populate("projectId")
        .exec(),
      MaterialListWithProject.find({ userId })
        .populate("projectId")
        .populate({
          path: "materialList.materialId",
          model: "material_lists",
        })
        .exec(),
      SafeJobAnalysis.find({ userId })
        .populate("userId")
        .populate("projectId")
        .exec(),
      ApprovalForm.find({ userId })
        .populate("userId")
        .populate("projectId")
        .exec(),
      AfterControlFormSchema.find({ userId })
        .populate("projectId")
        .populate("userId")
        .exec(),
    ]);

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully.",
      data: {
        observations,
        materialListWithProjects,
        safeJobAnalyses,
        approvalForms,
        afterControlForms,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve data.",
      error: error.message,
    });
  }
};
