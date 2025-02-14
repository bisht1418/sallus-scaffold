import baseService from "./baseService";

export const createSafeJobAnalysis = async (data) => {
  try {
    const response = await baseService.post(`/safe-job-analysis/create`, data);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getSafeJobAnalysis = async (data) => {
  try {
    const response = await baseService.get(`/safe-job-analysis`, data);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getSafeJobAnalysisById = async (id) => {
  try {
    const response = await baseService.get(`/safe-job-analysis/${id}`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const updateSafeJobAnalysis = async (id, data) => {
  try {
    const response = await baseService.put(`/safe-job-analysis/${id}`, data);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const deleteSafeJobAnalysis = async (id) => {
  try {
    const response = await baseService.delete(`/safe-job-analysis/${id}`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getSafeJobAnalysisByProjectId = async (projectId) => {
  try {
    const response = await baseService.get(
      `/safe-job-analysis/projectId/${projectId}`
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};
