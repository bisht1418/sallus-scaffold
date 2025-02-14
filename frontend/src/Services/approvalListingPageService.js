import baseService from "./baseService";
import { store } from "../Redux/store";

export const getApprovalListingPageService = async (id) => {
  try {
    const response = await baseService.get(`/approval-form/${id}`, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-auth-token": store.getState().auth.token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getApprovalListingPageByProjectId = async (id) => {
  try {
    const response = await baseService.get(`approval-form/project/${id}`, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-auth-token": store.getState().auth.token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
