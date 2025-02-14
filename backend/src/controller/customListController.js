const CustomListSchema = require("../model/customListSchema");

exports.createCustomList = async (req, res) => {
  try {
    const customList = await CustomListSchema.create(req.body);
    res.status(200).json({
      status: "success",
      data: customList,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
};

exports.shareCustomList = async (req, res) => {
  delete req?.body["_id"];
  const { extractedProjectId } = req?.body;

  try {
    if (extractedProjectId && extractedProjectId.length > 0) {
      const savePromises = extractedProjectId.map(async (projectId) => {
        const saveNewData = { ...req.body, projectId };
        return await CustomListSchema.create(saveNewData);
      });
      await Promise.all(savePromises);
      return res.status(200).json({
        status: "success",
      });
    }
    const shareCustomList = await CustomListSchema.create(req.body);
    res.status(200).json({
      status: "success",
      data: shareCustomList,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.editCustomList = async (req, res) => {
  try {
    const customList = await CustomListSchema.findByIdAndUpdate(
      req.params.customListId,
      req.body,
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: customList,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
};

exports.getAllMaterialList = async (req, res) => {
  try {
    const materialLists = await CustomListSchema.find();
    res.status(200).json({
      status: "success",
      data: materialLists,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
};

exports.getCustomMaterialListByMaterialId = async (req, res) => {
  try {
    const materialList = await CustomListSchema.find({
      materialListId: req.params.materialListId,
    });
    res.status(200).json({
      status: "success",
      data: materialList,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
};

exports.getCustomMaterialListByProjectId = async (req, res) => {
  try {
    const materialList = await CustomListSchema.find({
      projectId: req.params.projectId,
    });
    res.status(200).json({
      status: "success",
      data: materialList,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
};

exports.deleteCustomList = async (req, res) => {
  try {
    const customList = await CustomListSchema.findByIdAndDelete(
      req.params.customListId
    );
    res.status(200).json({
      status: "success",
      data: customList,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
};
