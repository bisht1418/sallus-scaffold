import { store } from "../Redux/store";
import baseService from "./baseService";

// Price Form Services

// Create Price Form
export const createPriceFormService = async (data) => {
    try {
        const response = await baseService.post("/price-form/create-price-form", data);
        // store.dispatch(SetPriceFormCreated(response?.data?.status));
        // store.dispatch(SetPriceForm(response?.data?.data));
        return response.data;
    } catch (error) {
        return error.response?.data ? error.response?.data : error.message;
    }
};

// Get Price Form by Project ID
export const getPriceFormByProjectIdService = async (projectId) => {
    try {
        const response = await baseService.get(`/price-form/price-form?projectId=${projectId}`);
        // store.dispatch(SetPriceForm(response?.data?.data));
        return response.data;
    } catch (error) {
        return error.response?.data ? error.response?.data : error.message;
    }
};

// Delete Price Form by ID
export const deletePriceFormByIdService = async (id) => {
    try {
        const response = await baseService.delete(`/price-form/delete-price-form?id=${id}`);
        // store.dispatch(SetPriceFormDeleted(response?.data?.status));
        return response.data;
    } catch (error) {
        return error.response?.data ? error.response?.data : error.message;
    }
};

// Edit Price Form by ID
export const editPriceFormByIdService = async (id, data) => {
    try {
        const response = await baseService.put(`/price-form/edit-price-form?id=${id}`, data);
        // store.dispatch(SetPriceFormUpdated(response?.data?.status));
        // store.dispatch(SetPriceForm(response?.data?.data));
        return response.data;
    } catch (error) {
        return error.response?.data ? error.response?.data : error.message;
    }
};
