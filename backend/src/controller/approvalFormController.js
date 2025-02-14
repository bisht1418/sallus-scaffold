const afterControlVisualInspectionForm = require("../model/afterControlVisualInspection");
const ApprovalForm = require("../model/approvalForm");
const ScaffoldLogSchema = require("../model/scaffoldLogsSchema");
const ActionLogsSchema = require("../model/actionLogsSchema");
const FileModel = require("../model/fileSchema");
const { default: mongoose } = require("mongoose");

const generateUnique5DigitNumber = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

const extractFileType = (url) => {
  const match = url.match(/\.(jpg|jpeg|png|gif|bmp|svg|webp|tiff|pdf)(\?|$)/i);
  return match && match[1] ? match[1].toLowerCase() : null;
};

const formatDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const year = date.getFullYear();
  return `${day}${month}${year}`;
};

const createFileName = (name) => {
  const createdAt = formatDate();
  return `${name}_${createdAt}`;
};

const formatString = (input) => {
  const cleanedInput = input.replace(/[^a-zA-Z0-9 ]/g, "");
  const words = cleanedInput.split(" ");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  return capitalizedWords.join("");
};

const fileExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "svg",
  "webp",
  "tiff",
];

// exports.createApprovalForm = async (req, res) => {
//   const session = await mongoose.startSession();
//   let isReplicaSet = true;

//   try {
//     try {
//       await session.startTransaction();
//     } catch (error) {
//       console.warn("Transactions are only allowed on replica sets or mongos:", error);
//       isReplicaSet = false;
//     }

//     const approvalFormData = {
//       ...req.body,
//       userId: req.user._id,
//       scaffoldIdentificationNumber: generateUnique5DigitNumber(),
//       scaffoldUniqueNumber: generateUnique5DigitNumber(),
//     };

//     const approvalForm = new ApprovalForm(approvalFormData);
//     const savedApprovalForm = await approvalForm.save(isReplicaSet ? { session } : {});
//     const approvalFormId = savedApprovalForm._id;
//     const visualData = savedApprovalForm.visual;

//     const otherData = new afterControlVisualInspectionForm({
//       approvalFormId,
//       visualData,
//     });

//     const scaffoldLogDetails = new ScaffoldLogSchema({
//       projectId: req.body.projectId,
//       userId: req.user._id,
//       approvalFormId,
//       isDeleted: false,
//       scaffoldName: savedApprovalForm.scaffoldName[0].value,
//       location: savedApprovalForm.location,
//       scaffoldIdentificationNumber:
//         savedApprovalForm.scaffoldIdentificationNumber,
//       date: savedApprovalForm.date,
//     });

//     const notificationForApprovalForm = new ActionLogsSchema({
//       projectId: req.body.projectId,
//       userId: req.user._id,
//       approvalFormDetail: approvalFormId,
//       isApprovalDetail: true,
//     });

//     const promises = visualData
//       .filter((ele) => ele?.inspection === "yes")
//       .map((ele) => {
//         const url = ele?.documentFile;
//         if (!url) return Promise.resolve();

//         const fileType = extractFileType(url);
//         const isImage = fileExtensions.includes(fileType);

//         const fileData = {
//           fileName: createFileName(formatString(ele?.documentList)),
//           file: url,
//           fileType: isImage ? "image" : "file",
//           userId: req.user._id,
//           projectId: req.body.projectId,
//           isFileFrom: "approval_form",
//         };

//         const myFile = new FileModel(fileData);
//         return myFile.save(isReplicaSet ? { session } : {});
//       });

//     await Promise.all(promises);
//     await otherData.save(isReplicaSet ? { session } : {});
//     await scaffoldLogDetails.save(isReplicaSet ? { session } : {});
//     await notificationForApprovalForm.save(isReplicaSet ? { session } : {});

//     if (isReplicaSet) await session.commitTransaction();
//     session.endSession();

//     res.status(200).json({
//       success: true,
//       message: "Approval Form Created Successfully",
//       data: savedApprovalForm,
//     });
//   } catch (error) {
//     if (isReplicaSet) await session.abortTransaction();
//     session.endSession();

//     console.error("Error creating approval form:", error);

//     res.status(500).json({
//       success: false,
//       message: "Error creating approval form",
//       error: error.message,
//     });
//   }
// };

exports.createApprovalForm = async (req, res) => {
  try {
    const approvalFormData = {
      ...req.body,
      userId: req.user._id,
      scaffoldIdentificationNumber: generateUnique5DigitNumber(),
      scaffoldUniqueNumber: generateUnique5DigitNumber(),
    };

    const approvalForm = new ApprovalForm(approvalFormData);
    const savedApprovalForm = await approvalForm.save();
    const approvalFormId = savedApprovalForm._id;
    const visualData = savedApprovalForm.visual;

    const otherData = new afterControlVisualInspectionForm({
      approvalFormId,
      visualData,
    });

    const scaffoldLogDetails = new ScaffoldLogSchema({
      projectId: req.body.projectId,
      userId: req.user._id,
      approvalFormId,
      isDeleted: false,
      scaffoldName: savedApprovalForm.scaffoldName[0].value,
      location: savedApprovalForm.location,
      scaffoldIdentificationNumber: savedApprovalForm.scaffoldIdentificationNumber,
      date: savedApprovalForm.date,
    });

    const notificationForApprovalForm = new ActionLogsSchema({
      projectId: req.body.projectId,
      userId: req.user._id,
      approvalFormDetail: approvalFormId,
      isApprovalDetail: true,
    });

    const promises = visualData
      .filter((ele) => ele?.inspection === "yes")
      .map((ele) => {
        const url = ele?.documentFile;
        if (!url) {
          return Promise.resolve();
        }

        const fileType = extractFileType(url);
        const isImage = fileExtensions.includes(fileType);

        const fileData = {
          fileName: createFileName(formatString(ele?.documentList)),
          file: url,
          fileType: isImage ? "image" : "file",
          userId: req.user._id,
          projectId: req.body.projectId,
          isFileFrom: "approval_form",
        };

        const myFile = new FileModel(fileData);
        return myFile.save();
      });

    await Promise.all(promises);
    await otherData.save();
    await scaffoldLogDetails.save();
    await notificationForApprovalForm.save();

    res.status(200).json({
      success: true,
      message: "Approval Form Created Successfully",
      data: savedApprovalForm,
    });
  } catch (error) {
    console.error("Error creating approval form:", error);

    res.status(500).json({
      success: false,
      message: "Error creating approval form",
      error: error.message,
    });
  }
};


exports.editApprovalForm = async (req, res) => {
  try {
    const updatedApprovalForm = await ApprovalForm.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );

    const makeNotificationForThisApprovalForm = await ActionLogsSchema({
      projectId: req.body.projectId,
      userId: req.user._id,
      approvalFormDetail: req?.body?._id,
      isEditApprovalDetail: true,
    });
    await makeNotificationForThisApprovalForm.save();

    res.status(200).json({
      success: true,
      message: "Approval Form Updated Successfully",
      data: updatedApprovalForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getApprovalForm = async (req, res) => {
  try {
    const approvalForm = await ApprovalForm.find();
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

exports.getApprovalFormByUserId = async (req, res) => {
  try {
    const approvalForm = await ApprovalForm.find({ userId: req.params.userId });
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

exports.getApprovalFormById = async (req, res) => {
  try {
    const approvalForm = await ApprovalForm.find({ _id: req.params.id });
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

exports.deleteApprovalFormData = async (req, res) => {
  try {
    const file = await ApprovalForm.findByIdAndUpdate(
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

exports.changeApprovalFormStatus = async (req, res) => {
  try {
    const file = await ApprovalForm.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { status: req.body.status } },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    if (req.body.status === "disassembled") {
      const ScaffoldLogUpdateStatus = await ScaffoldLogSchema.updateMany(
        { approvalFormId: file._id },
        { $set: { isDismantled: true } }
      );
    } else if (req.body.status === "active") {
      const ScaffoldLogUpdateStatus = await ScaffoldLogSchema.updateMany(
        { approvalFormId: file._id },
        { $set: { isDismantled: false } }
      );
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

exports.getApprovalFormByProjectId = async (req, res) => {
  try {
    const approvalForm = await ApprovalForm.find({ projectId: req.params.id });
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

exports.searchApprovalForms = async (req, res) => {
  const { searchTerm } = req.query;
  const statusArray = ["active", "inactive", "disassembled"];
  try {
    const projectId = req.params.id;
    if (typeof searchTerm !== "string") {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid searchTerm format" });
    }
    const matchedStatuses = statusArray.filter(
      (status) => status.toLowerCase() === searchTerm.toLowerCase()
    );
    const approvalForm = await ApprovalForm.find({
      projectId,
      $or: [
        { projectNumber: { $regex: searchTerm, $options: "i" } },
        { projectName: { $regex: searchTerm, $options: "i" } },
        { status: { $in: matchedStatuses } },
        { scaffoldName: { $regex: searchTerm, $options: "i" } },
        { workOrderNumber: { $regex: searchTerm, $options: "i" } },
      ],
    });
    if (approvalForm.length === 0) {
      return res.status(404).json({ status: "error", error: "No form founds" });
    }
    res.json({ status: "success", approvalForm });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

// exports.searchLogs = async (req, res) => {
//   const { searchTerm } = req.query;
//   const statusArray = ["active", "inactive", "disassembled"];
//   try {
//     const userId = req.params.id;
//     if (typeof searchTerm !== "string") {
//       return res
//         .status(400)
//         .json({ status: "error", error: "Invalid searchTerm format" });
//     }
//     const matchedStatuses = statusArray.filter(
//       (status) => status.toLowerCase() === searchTerm.toLowerCase()
//     );
//     const approvalForm = await ApprovalForm.find({
//       userId,
//       $or: [
//         { location: { $regex: searchTerm, $options: "i" } },
//         { scaffoldIdentificationNumber: { $regex: searchTerm, $options: "i" } },
//         { status: { $in: matchedStatuses } },
//         { "scaffoldName.value": { $regex: searchTerm, $options: "i" } },
//       ],
//     });
//     if (approvalForm.length === 0) {
//       return res.status(404).json({ status: "error", error: "No form founds" });
//     }
//     res.json({ status: "success", approvalForm });
//   } catch (error) {
//     res.status(500).json({ status: "error", error: "Server error" });
//   }
// };

exports.searchLogs = async (req, res) => {
  const { searchTerm, sortOrder } = req.query;
  const statusArray = ["active", "inactive", "disassembled"];
  try {
    const userId = req.params.id;
    if (typeof searchTerm !== "string") {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid searchTerm format" });
    }
    const matchedStatuses = statusArray.filter(
      (status) => status.toLowerCase() === searchTerm.toLowerCase()
    );

    let sortOption = {};
    if (sortOrder === "asc") {
      sortOption = { createdAt: 1 };
    } else if (sortOrder === "desc") {
      sortOption = { createdAt: -1 };
    }

    let approvalForm;

    const searchTermDate = new Date(searchTerm.substring(0, 10));
    if (isNaN(searchTermDate.getTime())) {
      approvalForm = await ApprovalForm.find({
        userId,
        $or: [
          { location: { $regex: searchTerm, $options: "i" } },
          {
            scaffoldIdentificationNumber: { $regex: searchTerm, $options: "i" },
          },
          { status: { $in: matchedStatuses } },
          { "scaffoldName.value": { $regex: searchTerm, $options: "i" } },
        ],
      }).sort(sortOption);
    } else {
      approvalForm = await ApprovalForm.find({
        userId,
        $or: [
          { location: { $regex: searchTerm, $options: "i" } },
          {
            scaffoldIdentificationNumber: { $regex: searchTerm, $options: "i" },
          },
          { status: { $in: matchedStatuses } },
          { "scaffoldName.value": { $regex: searchTerm, $options: "i" } },
          {
            date: {
              $gte: new Date(`${searchTerm.substring(0, 10)}T00:00:00.000Z`),
              $lt: new Date(`${searchTerm.substring(0, 10)}T23:59:59.999Z`),
            },
          },
        ],
      }).sort(sortOption);
    }

    if (approvalForm.length === 0) {
      return res
        .status(404)
        .json({ status: "No data found", error: "No forms found" });
    }
    res.json({ status: "success", approvalForm });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};



exports.changeDismantleDateByID = async (req, res) => {
  try {
    const file = await ApprovalForm.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { dismantledDate: req.body.date } },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({
        message: "Approval Form not found",
      });
    }

    res.status(200).json({
      message: "Approval form dismantle date changed successfully",
      file,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};