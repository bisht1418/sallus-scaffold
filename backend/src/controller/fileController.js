const FileModel = require('../model/fileSchema');

exports.createFileData = async (req, res) => {
    try {
        const myFile = new FileModel(req.body);
        await myFile.save();
        res.status(200).json({
            message: "File uploaded successfully",
            data: myFile
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getFileData = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        if (!projectId) {
            return res.status(400).json({
                status: "error",
                message: "Project ID is missing in the query parameters"
            });
        }

        const files = await FileModel.find({ projectId }).sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            files: files
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}



exports.getFileDataByUserId = async (req, res) => {
    try {
        const file = await FileModel.find({ userId: req.params.id });
        res.status(200).json({
            file
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.deleteFileDataById = async (req, res) => {

    try {
        const file = await FileModel.findByIdAndUpdate(
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
            status: "success"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

exports.searchFiles = async (req, res) => {
    const { searchTerm } = req.query;

    try {
        const userId = req.user._id;
        if (typeof searchTerm !== "string") {
            return res
                .status(400)
                .json({ status: "error", error: "Invalid searchTerm format" });
        }
        const files = await FileModel.find({
            userId,
            $or: [
                { fileName: { $regex: searchTerm, $options: "i" } },
                { file: { $regex: searchTerm, $options: "i" } },

            ],
        });
        if (files.length === 0) {
            return res
                .status(404)
                .json({ status: "error", error: "No projects founds" });
        }
        res.json({ status: "success", files });
    } catch (error) {

        res.status(500).json({ status: "error", error: "Server error" });
    }
}; 