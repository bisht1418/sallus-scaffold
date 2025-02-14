import baseService from "./baseService";
import { store } from "../Redux/store";
import {
  SetAfterControl,
  SetAfterControlForm,
  SetApprovalData,
  SetVisualInspection,
} from "../Redux/Slice/afterControlFormSlice";

export const getAfterControlFormService = async (id) => {
  try {
    const response = await baseService.get(
      `/after-control-form/get-project/${id}`
    );
    store.dispatch(SetAfterControl(response?.data?.data));
    return response.data;
  } catch (error) {
    return error;
  }
};
export const createAfterControlFormService = async (dataToSend) => {
  try {
    const response = await baseService.post(
      `/after-control-form/create-after-control-from`,
      dataToSend
    );
    // store.dispatch(SetAfterControl(response?.data?.data))
    return response.data;
  } catch (error) {
    return error;
  }
};
export const getAfterControlFormByProjectService = async (id) => {
  try {
    const response = await baseService.get(
      `/after-control-form/get-after-control-from/${id}`
    );
    // store.dispatch(SetAfterControl(response?.data?.data))
    return response.data;
  } catch (error) {
    return error;
  }
};
export const deleteAfterControlFormService = async (id) => {
  try {
    const response = await baseService.delete(
      `/after-control-form/delete-after-control-from/${id}`
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};
export const updateAfterControlFormService = async (id, data) => {
  try {
    const response = await baseService.put(
      `/after-control-form/update-after-control-from/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
// working
export const getAfterControlFormByIdService = async (id) => {
  try {
    const response = await baseService.get(
      `/after-control-form/after-control-from/${id}`
    );
    store.dispatch(SetAfterControlForm(response?.data?.data));
    return response.data;
  } catch (error) {
    return error;
  }
};
export const storeVisualinspection = async (data) => {
  try {
    store.dispatch(SetVisualInspection(data));
    return data;
  } catch (error) {
    return error;
  }
};

export const storeApprovalData = async (data) => {
  try {
    store.dispatch(SetApprovalData(data));
    return data;
  } catch (error) {
    return error;
  }
};
