import baseService from "../baseService";

export const getAllFormService = async () => {
  try {
    const getAllFormResponse = await baseService.get("/all-form/get-all-form");
    return getAllFormResponse.data;
  } catch (error) {
    return error;
  }
};
export const getAllFormByUserIdService = async (userId) => {
  try {
    const getAllFormResponse = await baseService.get(
      `/all-form/get-all-form/user-id/${userId}`
    );
    return getAllFormResponse.data;
  } catch (error) {
    return error;
  }
};

export const getApprovalFormByUserId = async (id) => {
  try {
    const response = await baseService.get(`/approval-form/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getSJAByUserId = async (userId) => {
  try {
    const response = await baseService.get(
      `/safe-job-analysis/admin-sja/${userId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getMaterialListByUserId = async (userId) => {
  try {
    const response = await baseService.get(
      `/material/material-list/user-id/${userId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getObservationByUserId = async (userId) => {
  try {
    const response = await baseService.get(`/observation/user-id/${userId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAfterControlFormByUserId = async (userId) => {
  try {
    const response = await baseService.get(
      `/after-control-form/after-control/user-id/${userId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
