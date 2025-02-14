import baseService from "./baseService";
import { store } from "../Redux/store";

export const getAfterControlListingPageService = async (id) => {
  try {
    const response = await baseService.get(
      `/after-control-form/get-control-form`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": store.getState().auth.token,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getAfterControlByProjectId = async (projectId) => {
  try {
    const response = await baseService.get(
      `/after-control-form/get-project/${projectId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAfterControlListingPageByProjectId = async (id) => {
  try {
    const response = await baseService.get(
      `/after-control-form/get-control-form/${id}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": store.getState().auth.token,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteAfterControlFormService = async (id) => {
  try {
    const response = await baseService.delete(
      `/after-control-form/delete-control-form/${id}`,
      {
        headers: {
          "x-auth-token": store.getState().auth.token,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const afterControlFormUpdateService = async (data, id) => {
  try {
    const response = await baseService.put(
      `/after-control-form/update-control-form/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": store.getState().auth.token,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const createAfterControlFormService = async (data) => {
  try {
    const response = await baseService.post(
      `/after-control-form/create-control-form`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": store.getState().auth.token,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getAfterControlFormDataById = async (id) => {
  try {
    const response = await baseService.get(
      `/after-control-form/get-control-form-by-id/${id}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": store.getState().auth.token,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};
