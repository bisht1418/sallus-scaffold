const SafeJobAnalysis = require("../model/safeJobAnalysis");

exports.getSafeJobAnalysis = async (req, res) => {
  try {
    const safeJobAnalysisData = await SafeJobAnalysis.find()
      .populate("userId")
      .populate("projectId")
      .exec();
    res.status(200).json({
      status: "success",
      data: safeJobAnalysisData,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch safe job analysis data",
      error: error.message,
    });
  }
};

exports.addSafeJobAnalysis = async (req, res) => {
  try {
    const safeJobAnalysisData = await SafeJobAnalysis.create(req.body);
    res.status(200).json({
      status: "success",
      data: safeJobAnalysisData,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to add safe job analysis data",
      error: error.message,
    });
  }
};

exports.deleteSafeJobAnalysis = async (req, res) => {
  try {
    const observation = await SafeJobAnalysis.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: observation,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete safe job analysis data",
      error: error.message,
    });
  }
};

exports.updateSafeJobAnalysis = async (req, res) => {
  try {
    const safeJobAnalysisData = await SafeJobAnalysis.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: safeJobAnalysisData,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update safe job analysis data",
      error: error.message,
    });
  }
};

exports.getSafeJobAnalysisById = async (req, res) => {
  try {
    const safeJobAnalysisData = await SafeJobAnalysis.findById(req.params.id)
      .populate("userId")
      .populate("projectId")
      .exec();
    res.status(200).json({
      status: "success",
      data: safeJobAnalysisData,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to get safe job analysis data by id",
      error: error.message,
    });
  }
};

exports.getSafeJobAnalysisByProjectId = async (req, res) => {
  try {
    const safeJobAnalysisData = await SafeJobAnalysis.find({
      projectId: req.params.id,
    })
      .populate("userId")
      .populate("projectId")
      .exec();
    res.status(200).json({
      status: "success",
      data: safeJobAnalysisData,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to get safe job analysis data by id",
      error: error.message,
    });
  }
};

exports.getSafeJobAnalysisByUserId = async (req, res) => {
  try {
    const safeJobAnalysisData = await SafeJobAnalysis.find({
      userId: req.params.userId,
    })
      .populate("userId")
      .populate("projectId")
      .exec();
    res.status(200).json({
      status: "success",
      data: safeJobAnalysisData,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to get safe job analysis data by id",
      error: error.message,
    });
  }
};
