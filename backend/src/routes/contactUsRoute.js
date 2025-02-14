const express = require('express');
const ContactUsForm = express.Router();
const contactUsController = require('../controller/contactUsController');

ContactUsForm.post('/contact-us', contactUsController.sendContactUsForm);
ContactUsForm.post('/question-request', contactUsController.sendQuestionRequest);

module.exports = ContactUsForm;