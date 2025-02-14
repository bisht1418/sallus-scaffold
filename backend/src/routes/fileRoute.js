const express = require('express');
const { createFileData, searchFiles } = require('../controller/fileController');
const { getFileData } = require("../controller/fileController")
const { getFileDataByUserId } = require("../controller/fileController")
const { deleteFileDataById } = require("../controller/fileController")

const auth = require("../middleware/auth")
const fileRoute = express.Router()

fileRoute.post('/', createFileData)
fileRoute.get('/:projectId', getFileData)
fileRoute.get('/:id', getFileDataByUserId)
fileRoute.put('/:id', deleteFileDataById)
fileRoute.get('/file-search/search', auth, searchFiles)

module.exports = fileRoute;