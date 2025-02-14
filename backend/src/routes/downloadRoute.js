const express = require('express');
const { getDownloadFile } = require('../controller/downloadFileController');
const downloadRoute = express.Router()

downloadRoute.get('/:userId/files/:fileName', getDownloadFile)

module.exports = downloadRoute;