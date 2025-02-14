const express = require("express");
const {
    createPriceForm,
    getPriceFormByProjectId,
    deletePriceFormById,
    editPriceFormById
} = require("../controller/priceController");

const priceFormRoute = express.Router();

// Route to create a new price form
priceFormRoute.post("/create-price-form", createPriceForm);

// Route to get a price form by project ID
priceFormRoute.get("/price-form", getPriceFormByProjectId);

// Route to delete a price form by its ID
priceFormRoute.delete("/delete-price-form", deletePriceFormById);

// Route to edit a price form by its ID
priceFormRoute.put("/edit-price-form", editPriceFormById);

module.exports = priceFormRoute;
