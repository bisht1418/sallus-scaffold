const path = require('path');
exports.getDownloadFile = async (req, res) => {
    try {
        const { userId, fileName } = req.params;
        const filePath = path.join(__dirname + `/../../public/upload/${userId}/files/${fileName}`);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).send('Error serving the image');
    }
};