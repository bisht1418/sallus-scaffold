// imagesController.js
const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/:userId/images/:fileName', (req, res) => {
    try {
        const { userId, fileName } = req.params;
        const filePath = path.join(__dirname + `/../../public/upload/${userId}/images/${fileName}`);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).send('Error serving the image');
    }
});

module.exports = router;
