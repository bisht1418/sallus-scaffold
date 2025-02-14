const MaterialListWithProject = require("../model/materialListWithProject");
const CustomListSchema = require("../model/customListSchema");
const MaterialList = require("../model/materia_list");
const Jimp = require("jimp");
const fs = require("fs");
const Project = require("../model/project");
const ActionLogsSchema = require("../model/actionLogsSchema");

exports.createMaterialListWithProject = async (req, res) => {
  try {
    const newMaterialListWithProject = new MaterialListWithProject({
      ...req.body,
    });
    const savedMaterialListWithProject =
      await newMaterialListWithProject.save();

    const filteredMaterialList =
      savedMaterialListWithProject.materialList.filter(
        (item) => item.category === "CustomList"
      );

    for (const item of filteredMaterialList) {
      const existingDocument = await MaterialList.findOne({ _id: item._id });

      if (!existingDocument) {
        const newMaterialList = new MaterialList({
          ...item,
          userId: req.user._id,
        });
        await newMaterialList.save();
      }
    }
    // const saveCustomSchema = new CustomListSchema({
    //   customList: savedMaterialListWithProject.customListData,
    //   userId: req.user._id,
    //   projectId: savedMaterialListWithProject.projectId,
    //   materialListId: savedMaterialListWithProject._id,
    // });

    // console.log("saveCustomSchema", saveCustomSchema);

    const makeNotificationForMaterialList = await ActionLogsSchema({
      projectId: savedMaterialListWithProject.projectId,
      userId: req.user._id,
      materialListDetail: savedMaterialListWithProject._id,
      isMaterialListDetail: true,
    });

    // await saveCustomSchema.save();
    await makeNotificationForMaterialList.save();

    res.status(201).json({
      status: "success",
      data: savedMaterialListWithProject,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
};

exports.getMaterialListWithId = async (req, res) => {
  try {
    const materialListWithProject = await MaterialListWithProject.findById({
      _id: req.params.id,
    })
      .populate("projectId")
      .populate({
        path: "materialList.materialId",
        model: "material_lists",
      });

    if (!materialListWithProject) {
      return res
        .status(404)
        .json({ error: "Material list with project not found" });
    }
    res.status(200).json({ status: "success", data: materialListWithProject });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMaterialListWithProjectByProjectId = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await MaterialListWithProject.find({ projectId });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteMaterialListWithProject = async (req, res) => {
  try {
    const materialListWithProject =
      await MaterialListWithProject.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { isDeleted: true } },
        { new: true }
      );
    if (!materialListWithProject) {
      return res
        .status(404)
        .json({ status: false, error: "Material list with project not found" });
    }
    res.status(200).json({
      message: "Material list with project deleted successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ status: false, error: "Internal server error" });
  }
};

exports.updateMaterialListWithProject = async (req, res) => {
  try {
    const materialListWithProject =
      await MaterialListWithProject.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { ...req.body } },
        { new: true }
      );
    if (!materialListWithProject) {
      return res
        .status(404)
        .json({ error: "Material list with project not found" });
    }

    const makeNotificationForThisApprovalForm = await ActionLogsSchema({
      projectId: req.body.projectId,
      userId: req.body.userId,
      materialListDetail: req?.params?.id,
      isEditMaterialListDetail: true,
    });
    await makeNotificationForThisApprovalForm.save();

    res.status(200).json({
      message: "Material list with project updated successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.materialListByCustomId = async (req, res) => {
  try {
    const materialListWithProject = await MaterialListWithProject.findById({
      _id: req.params.id,
    })
      .populate("projectId")
      .populate({
        path: "materialList.materialId",
        model: "material_lists",
      });

    if (!materialListWithProject) {
      return res
        .status(404)
        .json({ error: "Material list with project not found" });
    }

    res.status(200).json({ status: "success", data: materialListWithProject });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.changeMaterialListFormStatus = async (req, res) => {
  try {
    const file = await MaterialListWithProject.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { status: req.body.status } },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

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

exports.searchMateriallist = async (req, res) => {
  const { searchTerm, projectId } = req.query;

  const statusArray = ["latest", "under", "closed"];
  try {
    if (typeof searchTerm !== "string") {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid searchTerm format" });
    }

    const matchedStatuses = statusArray.filter(
      (status) => status.toLowerCase() === searchTerm.toLowerCase()
    );
    const materialList = await MaterialListWithProject.find({
      projectId,
      $or: [
        { projectNumber: { $regex: searchTerm, $options: "i" } },
        { materialListName: { $regex: searchTerm, $options: "i" } },
        { status: { $in: matchedStatuses } },
      ],
    });
    if (materialList.length === 0) {
      return res
        .status(404)
        .json({ status: "error", error: "No materialList foundsssss" });
    }
    res.json({ status: "success", materialList });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Server error" });
  }
};

exports.getMaterialListWithProject = async (req, res) => {
  try {
    const userId = req.params.id;

    const materialListWithProject = await MaterialListWithProject.find({})
      .populate({
        path: "projectId",
        match: { userId: userId },
      })
      .populate({
        path: "materialList.materialId",
        model: "material_lists",
      })
      .exec();

    const filteredProjects = materialListWithProject.filter(
      (project) =>
        project.projectId !== null &&
        project.projectId.userId.toString() === userId
    );

    res.json({ status: "success", filteredProjects });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAdminApproval = async (req, res) => {
  try {
    const materialListWithProject = await MaterialListWithProject.find()
      .populate("projectId")
      .populate({
        path: "materialList.materialId",
        model: "material_lists",
      });

    res.status(200).json(materialListWithProject);
  } catch (error) {
    //res.status(500).json({ error: 'Internal server error' });
  }
};

// exports.getProjectTransfer = async (req, res) => {
//     try {
//         const projects = await Project.find({ "status": "active" }).select('projectName projectNumber userId').exec();

//         if (!projects || projects.length === 0) {
//             return res.status(404).json({ success: false, message: 'No active projects found.' });
//         }

//         res.status(200).json({ success: true, message: 'Active projects retrieved successfully.', data: projects });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to retrieve projects.', error: error.message });
//     }
// };

exports.getProjectTransfer = async (req, res) => {
  try {
    const { query: searchText } = req.query;
    let query = { status: "active" };
    const userId = req.user?._id;
    if (userId) {
      query.userId = userId;
    }
    if (searchText) {
      query.$or = [
        { projectName: { $regex: `^${searchText}`, $options: "i" } },
        { projectNumber: searchText },
      ];
    }

    const projects = await Project.find(query)
      .select("projectName projectNumber userId")
      .populate("userId")
      .exec();

    if (!projects || projects.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No active projects found.",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Active projects retrieved successfully.",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve projects.",
      error: error.message,
    });
  }
};

exports.getMaterialListByUserId = async (req, res) => {
  try {
    const response = await MaterialListWithProject.find({
      userId: req.params.userId,
    })
      .populate("projectId")
      .populate({
        path: "materialList.materialId",
        model: "material_lists",
      });
    res.status(200).json({
      status: true,
      data: response,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};
