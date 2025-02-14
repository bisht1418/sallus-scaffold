const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FileModel = require('../model/fileSchema');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.user._id;

        let uploadDirectory = path.join('public', 'upload', userId);

        if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
        }

        if (file.mimetype.startsWith('image/')) {
            uploadDirectory = path.join(uploadDirectory, 'images');
        } else {
            uploadDirectory = path.join(uploadDirectory, 'files');
        }
        if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
        }

        cb(null, uploadDirectory);
    },
    filename: async function (req, file, cb) {
        const uniqueDate = Date.now()
        const originalname = file.originalname;
        const newFile = await new FileModel({
            fileName: `${uniqueDate}_${originalname}`,
            fileType: file.mimetype.startsWith('image/') ? "image" : "file",
            userId: req.user._id,
        });
        newFile.save();
        cb(null, `${uniqueDate}_${originalname}`);
    },
});

const upload = multer({ storage: storage });
module.exports = upload;
