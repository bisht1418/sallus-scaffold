const ScaffoldLogSchema = require("../model/scaffoldLogsSchema");

exports.getAllScaffoldLogs = async (req, res) => {
  try {
    const scaffoldLogs = await ScaffoldLogSchema.find()
      .populate("projectId")
      .populate("userId")
      .populate("approvalFormId");
    res.status(200).json({ status: true, data: scaffoldLogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getScaffoldLogById = async (req, res) => {
  try {
    const scaffoldLog = await ScaffoldLogSchema.findById(req.params.id)
      .populate("projectId")
      .populate("userId")
      .populate("approvalFormId");
    res.status(200).json({ status: true, data: scaffoldLog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchScaffoldLogs = async (req, res) => {
  try {
    const { value } = req.query;
    const query = {
      $or: [
        { scaffoldName: { $regex: value, $options: "i" } },
        { location: { $regex: value, $options: "i" } },
        { scaffoldIdentificationNumber: { $regex: value, $options: "i" } },
      ],
    };

    const scaffoldLogs = await ScaffoldLogSchema.find(query)
      .populate("projectId")
      .populate("userId")
      .populate("approvalFormId");

    res.status(200).json({ success: true, data: scaffoldLogs });
  } catch (error) {
    console.error("Error searching scaffold logs:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
