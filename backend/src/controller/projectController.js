const Project = require("../model/project");
const Invite = require("../model/invite");
const ApprovalForm = require("../model/approvalForm");
const MaterialListWithProject = require("../model/materialListWithProject");
const ObservationSchema = require("../model/observation");
const SafeJobAnalysis = require("../model/safeJobAnalysis");
const FileModel = require("../model/fileSchema");
const PriceForm = require("../model/priceSchema");

const generateDefaultScaffoldPrices = () => {
  const defaultPrices = {
    "LM": "0",
    "HM": "0",
    "m²": "0",
    "m³": "0",
    "Volume": "0",
    "Rent": "0"
  };

  const scaffoldTypes = [
    "Standard scaffold",
    "Fasade scaffold",
    "Hanging scaffold",
    "Rolling scaffold",
    "Support scaffolding"
  ];

  return scaffoldTypes.map(scaffoldName => ({
    id: Date.now() + Math.floor(Math.random() * 1000), // Generate unique ID
    scaffoldName,
    prices: defaultPrices
  }));
};

exports.createProject = async (req, res) => {
  const {
    projectName,
    companyDetails,
    projectDetails,
    projectNumber,
    userId,
    projectBackgroundImage,
    Calendar,
    notificationToAdminCreate,
    notificationToAdminEdit,
    status,
  } = req.body;

  try {
    // Create new project
    const newProject = await new Project({
      projectName,
      companyDetails,
      projectDetails,
      projectNumber,
      userId,
      Calendar,
      projectBackgroundImage,
      notificationToAdminCreate,
      notificationToAdminEdit,
      status,
    });

    // Format date and create filename functions
    function formatDate() {
      const date = new Date();
      const day = date.getDate();
      const month = date
        .toLocaleString("default", { month: "short" })
        .toUpperCase();
      const year = date.getFullYear();
      return `${day}${month}${year}`;
    }

    function createFileName() {
      const projectName = newProject.projectName;
      const fileName = projectName.replace(/\s+/g, "_");
      const createdAt = formatDate();
      return `${fileName}_${createdAt}`;
    }

    // Create file data
    const fileData = {
      fileName: createFileName(),
      file: projectBackgroundImage || false,
      fileType: "image",
      userId: userId,
      projectId: newProject?._id,
      isFileFrom: "project",
    };

    if (newProject) {
      // Save file
      const myFile = new FileModel(fileData);
      await myFile.save();

      // Generate default scaffold prices
      const defaultScaffolds = generateDefaultScaffoldPrices();

      // Create price form with default values
      const priceFormData = {
        projectId: newProject._id,
        rent: defaultScaffolds,
        volume: defaultScaffolds,
        isDeleted: false
      };

      // Save price form
      const priceForm = new PriceForm(priceFormData);
      await priceForm.save();

      // Save project
      await newProject.save();

      res.send({
        status: "success",
        project: newProject,
        priceForm: priceForm
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "An error occurred while creating the project.",
      error: error.message,
    });
  }
};
exports.getAllProjects = async (req, res) => {
  try {
    const { createdAt = 1, updatedAt = 1 } = req.query
    const projects = await Project.find({
      userId: req.user._id,
      isDeleted: false,
    }).sort({ createdAt, updatedAt }).lean();
    const invite = await Invite.find({ email: req.user.user.email }).lean();
    const projectDetails = await Promise.all(
      invite.map(async (inviteObj) => {
        const { projectId, type: accessLevel } = inviteObj;
        return { projectId, accessLevel };
      })
    );
    const findInvitedProject = await Promise.all(
      projectDetails.map(async (project) => {
        const { projectId, accessLevel } = project;
        const data = await Project.findById(projectId).lean();

        return { ...data, isInvited: true, accessLevel };
      })
    );
    const updatedData = projects.map((ele) => {
      return {
        ...ele,
        accessLevel: 0,
      };
    });
    res.json({
      status: "success",
      projects: [...updatedData, ...findInvitedProject],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", error: error });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      userId: req.user._id,
      isDeleted: false,
    }).lean();
    const invite = await Invite.find({ userId: req.user._id }).lean();
    const projectDetails = await Promise.all(
      invite.map(async (inviteObj) => {
        const { projectId, type: accessLevel } = inviteObj;
        return { projectId, accessLevel };
      })
    );
    findInvitedProject = await Promise.all(
      projectDetails.map(async (project) => {
        const { projectId, accessLevel } = project;
        const data = await Project.findById(projectId);
        return { ...data?.toObject(), accessLevel };
      })
    );
    const updateddata = projects.map((ele) => {
      return {
        ...ele,
        accessLevel: 1,
      };
    });
    res.json({
      status: "success",
      projects: [...updateddata, ...findInvitedProject],
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Server error" });
  }
};

exports.getAllProjectsById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId).exec();

    if (!project) {
      return res
        .status(404)
        .json({ status: "error", error: "Project not found" });
    }

    res.json({
      status: "success",
      project: project,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Server error" });
  }
};

exports.deleteProjectDataById = async (req, res) => {
  const projectUserId = await Project.findById({ _id: req.params.id });
  let idString = projectUserId?.userId.toString();
  try {
    if (req.user._id === idString) {
      const project = await Project.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { isDeleted: true } },
        { new: true }
      );
      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      res.status(200).json({
        message: "Project soft-deleted successfully",
        project,
        status: "success",
      });
    } else {
      res.status(500).json({
        message: "invite project Not delete",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.editProjectById = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project updated successfully",
      project,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    let material_list_weight_total = 0;
    const approval_forms = await ApprovalForm.find({
      projectId: req.params.id,
    }).count();
    const observations = await ObservationSchema.find({
      projectId: req.params.id,
    }).count();
    const SJAs = await SafeJobAnalysis.find({
      projectId: req.params.id,
    }).count();
    const material_lists = await MaterialListWithProject.find({
      projectId: req.params.id,
    });
    material_lists.forEach((material_list) => {
      material_list.materialList.forEach((item) => {
        if (!material_list?.isDeleted) {
          material_list_weight_total += item.quantity * item.kg;
        }
      });
    });
    material_lists.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    const transferWeights = material_lists.map(
      (material_list) => material_list.transferWeight
    );
    const materialWeight = material_list_weight_total.toFixed(2);
    const project = await Project.findById(req.params.id).lean();
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const invite = await Invite.find({ userId: req.user._id, projectId: req.params.id }).lean();

    res.status(200).json({
      message: "Project fetched successfully",
      project: {
        ...project,
        accessLevel: invite[0]?.type || 0,
        approval_forms,
        SJAs,
        observations,
        material_list_weight_total: materialWeight,
        total_material_list_items: material_lists.flatMap(
          (item) => item.materialList
        ).length,
        transferWeight: transferWeights[0],
      },
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.searchProjects = async (req, res) => {
  const { searchTerm } = req.query;
  const statusArray = ["active", "inactive", "completed"];
  try {
    const userId = req.user._id;
    if (typeof searchTerm !== "string") {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid searchTerm format" });
    }

    const matchedStatuses = statusArray.filter(
      (status) => status.toLowerCase() === searchTerm.toLowerCase()
    );
    const projects = await Project.find({
      userId,
      $or: [
        { projectNumber: { $regex: searchTerm, $options: "i" } },
        { projectName: { $regex: searchTerm, $options: "i" } },
        { status: { $in: matchedStatuses } },
      ],
    });
    if (projects.length === 0) {
      return res
        .status(404)
        .json({ status: "error", error: "No projects foundsssss" });
    }
    res.json({ status: "success", projects });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Server error" });
  }
};

exports.getAllNotification = async (req, res) => {
  try {
    // Use Promise.all for parallel database queries
    const [projects, approval, material, observation, sja, invites] = await Promise.all([
      Project.find().populate("userId").lean(),
      ApprovalForm.find().populate("userId").populate("projectId").lean(),
      MaterialListWithProject.find().populate("projectId").populate("userId").lean(),
      ObservationSchema.find().populate("projectId").populate("userId").lean(),
      SafeJobAnalysis.find().populate("projectId").populate("userId").lean(),
      Invite.find().populate("projectId").populate("userId").lean()
    ]).catch(error => {
      console.error('Database query error:', error);
      throw new Error('Failed to fetch data from database');
    });

    const notifications = [];
    const formatTimestamp = date => date instanceof Date ? date.toLocaleString() : new Date(date).toLocaleString();

    // Helper function to add notification
    const addNotification = (data) => {
      if (!data.userId || !data.projectNumber || !data.projectName) {
        console.warn('Missing required notification data:', data);
        return;
      }

      notifications.push({
        status: "success",
        userId: data.userId._id || data.userId,
        projectNumber: data.projectNumber,
        projectName: data.projectName,
        message: data.message,
        createdAt: formatTimestamp(data.timestamp)
      });
    };

    // Process projects
    projects.forEach(project => {
      if (project.notificationToAdminCreate) {
        addNotification({
          userId: project.userId,
          projectNumber: project.projectNumber,
          projectName: project.projectName,
          message: `Project ${project.projectName} (Project Number: ${project.projectNumber}) Created Project by Username: ${project.userId?.name}`,
          timestamp: project.createdAt
        });
      }
      if (project.notificationToAdminEdit) {
        addNotification({
          userId: project.userId,
          projectNumber: project.projectNumber,
          projectName: project.projectName,
          message: `Project ${project.projectName} (Project Number: ${project.projectNumber}) Edited Project by Username: ${project.userId?.name}`,
          timestamp: project.updatedAt
        });
      }
    });

    // Process approvals
    approval.forEach(item => {
      if (item.notificationToAdminCreate) {
        addNotification({
          userId: item.userId,
          projectNumber: item.projectNumber,
          projectName: item.projectId?.projectName,
          message: `Project ${item.projectId?.projectName} (Project Number: ${item.projectNumber}) Created Approval from by Username: ${item.userId?.name}`,
          timestamp: item.createdAt
        });
      }
      if (item.notificationToAdminEdit) {
        addNotification({
          userId: item.userId,
          projectNumber: item.projectNumber,
          projectName: item.projectId?.projectName,
          message: `Project ${item.projectId?.projectName} (Project Number: ${item.projectNumber}) edited Approval from by Username: ${item.userId?.name}`,
          timestamp: item.updatedAt
        });
      }
    });

    // Process materials
    material.forEach(item => {
      if (item.notificationToAdminCreate) {
        addNotification({
          userId: item.userId,
          projectNumber: item.projectId?.projectNumber,
          projectName: item.projectId?.projectName,
          message: `Project ${item.projectId?.projectName} (Project Number: ${item.projectId?.projectNumber}) Created Material Lists from by Username: ${item.userId?.name}`,
          timestamp: item.createdAt
        });
      }
      if (item.notificationToAdminEdit) {
        addNotification({
          userId: item.userId,
          projectNumber: item.projectId?.projectNumber,
          projectName: item.projectId?.projectName,
          message: `Project ${item.projectId?.projectName} (Project Number: ${item.projectId?.projectNumber}) Edited Material Lists from by Username: ${item.userId?.name}`,
          timestamp: item.updatedAt
        });
      }
    });

    // Process observations
    observation.forEach(item => {
      if (item.notificationToAdminCreate) {
        addNotification({
          userId: item.userId,
          projectNumber: item.projectId?.projectNumber,
          projectName: item.projectId?.projectName,
          message: `Project ${item.projectId?.projectName} (Project Number: ${item.projectNumber}) Created observation Lists from by Username: ${item.userId?.name}`,
          timestamp: item.createdAt
        });
      }
      if (item.notificationToAdminEdit) {
        addNotification({
          userId: item.userId,
          projectNumber: item.projectId?.projectNumber,
          projectName: item.projectId?.projectName,
          message: `Project ${item.projectId?.projectName} (Project Number: ${item.projectNumber}) Edited observation Lists from by Username: ${item.userId?.name}`,
          timestamp: item.updatedAt
        });
      }
    });

    // Process SJA
    sja.forEach(item => {
      if (item.notificationToAdminCreate) {
        addNotification({
          userId: item.userId,
          projectNumber: item.projectId?.projectNumber,
          projectName: item.projectId?.projectName,
          message: `Project ${item.projectId?.projectName} (Project Number: ${item.projectNumber}) Created Safe Job Analysics from by Username: ${item.userId?.name}`,
          timestamp: item.createdAt
        });
      }
      if (item.notificationToAdminEdit) {
        addNotification({
          userId: item.userId,
          projectNumber: item.projectId?.projectNumber,
          projectName: item.projectId?.projectName,
          message: `Project ${item.projectId?.projectName} (Project Number: ${item.projectNumber}) Edited Safe Job Analysics from by Username: ${item.userId?.name}`,
          timestamp: item.updatedAt
        });
      }
    });

    // Process invites
    invites.forEach(item => {
      if (item) {

        addNotification({
          userId: item.userId,
          projectNumber: item.projectId?.projectNumber,
          projectName: item.projectId?.projectName,
          message: `Project ${item.projectId?.projectName} (Project Number: ${item.projectId?.projectNumber}) New Invite Created by Username: ${item.userId?.name}`,
          timestamp: item.createdAt,
          isInviteDetails: true
        });

        // Only add update notification if updatedAt exists and is different from createdAt
        if (item.updatedAt && item.updatedAt !== item.createdAt) {
          addNotification({
            userId: item.userId,
            projectNumber: item.projectId?.projectNumber,
            projectName: item.projectId?.projectName,
            message: `Project ${item.projectId?.projectName} (Project Number: ${item.projectId?.projectNumber}) Invite Updated by Username: ${item.userId?.name}`,
            timestamp: item.updatedAt,
            isInviteDetails: true
          });
        }
      }
    });



    // Sort notifications by date
    try {
      notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (sortError) {
      console.error('Error sorting notifications:', sortError);
      // Continue with unsorted notifications rather than failing
    }

    // Send response
    return res.status(200).json(
      notifications.length > 0
        ? notifications
        : { status: "success", message: "No notifications found" }
    );

  } catch (error) {
    console.error('Error in getAllNotification:', error);
    return res.status(500).json({
      status: "error",
      error: "Server error",
      message: error.message || "An unexpected error occurred"
    });
  }
};

exports.getAllProjectForSuperAdmin = async (req, res) => {
  try {
    const projects = await Project.find().populate("userId");
    res.status(200).json({ status: true, data: projects });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

exports.getProjectByUserId = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.userId }).populate(
      "userId"
    );
    res.status(200).json({ status: true, data: projects });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
exports.getProjectNameByProjectId = async (req, res) => {
  const projectId = req.params.id;
  try {
    const project = await Project.findOne({ _id: projectId });

    if (project) {
      res.status(200).json({ status: true, projectName: project?.projectName });
    } else {
      res.status(404).json({ status: false, error: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
