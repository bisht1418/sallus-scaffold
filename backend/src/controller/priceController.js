const PriceForm = require("../model/priceSchema"); // Assuming the schema is in models/priceFormModel.js

/**
 * Create a Price Form
 */
const createPriceForm = async (req, res) => {
    try {
        const { projectId, rent, volume } = req.body;

        // Basic validation
        if (!projectId) {
            return res.status(200).json({ success: false, message: "Project ID is required" });
        }
        if (!rent || typeof rent !== "object") {
            return res.status(200).json({ success: false, message: "Valid rent data is required" });
        }
        if (!volume || typeof volume !== "object") {
            return res.status(200).json({ success: false, message: "Valid volume data is required" });
        }

        // Check if a price form already exists for the project
        const existingPriceForm = await PriceForm.findOne({ projectId, isDeleted: false });

        if (existingPriceForm) {
            // Update the existing price form
            existingPriceForm.rent = rent;
            existingPriceForm.volume = volume;
            await existingPriceForm.save();

            return res.status(200).json({
                success: true,
                message: "Price form updated successfully",
                data: existingPriceForm
            });
        }

        // Create a new price form if none exists
        const priceForm = new PriceForm({ projectId, rent, volume });
        await priceForm.save();

        return res.status(201).json({
            success: true,
            message: "Price form created successfully",
            data: priceForm
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}           ;


/**
 * Get Price Form by Project ID
 */
const getPriceFormByProjectId = async (req, res) => {
    try {
        const { projectId } = req.query;

        if (!projectId) {
            return res.status(400).json({ success: false, message: "Project ID is required" });
        }

        const priceForm = await PriceForm.findOne({ projectId, isDeleted: false }).populate("projectId");

        if (!priceForm) {
            return res.status(404).json({ success: false, message: "Price form not found" });
        }

        return res.status(200).json({ success: true, data: priceForm });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/**
 * Delete Price Form by ID
 */
const deletePriceFormById = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ success: false, message: "Price form ID is required" });
        }

        const priceForm = await PriceForm.findById(id);

        if (!priceForm || priceForm.isDeleted) {
            return res.status(404).json({ success: false, message: "Price form not found" });
        }

        priceForm.isDeleted = true;
        await priceForm.save();

        return res.status(200).json({ success: true, message: "Price form deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/**
 * Edit Price Form by ID
 */
const editPriceFormById = async (req, res) => {
    try {
        const { id } = req.query;
        const { projectId, rent, volume } = req.body;

        if (!id) return res.status(400).json({ success: false, message: "Price form ID is required" });
        if (!projectId) return res.status(400).json({ success: false, message: "Project ID is required" });
        if (!rent || typeof rent !== "object") return res.status(400).json({ success: false, message: "Valid rent data is required" });
        if (!volume || typeof volume !== "object") return res.status(400).json({ success: false, message: "Valid volume data is required" });

        const priceForm = await PriceForm.findById(id);

        if (!priceForm || priceForm.isDeleted) {
            return res.status(404).json({ success: false, message: "Price form not found" });
        }

        priceForm.projectId = projectId;
        priceForm.rent = rent;
        priceForm.volume = volume;
        await priceForm.save();

        return res.status(200).json({ success: true, message: "Price form updated successfully", data: priceForm });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = {
    createPriceForm,
    getPriceFormByProjectId,
    deletePriceFormById,
    editPriceFormById,
};
