import baseService from "./baseService";

export const getObservation = async (id) => {
  try {
    const response = await baseService.get(`/observation/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const createObservation = async (observation) => {
  try {
    const response = await baseService.post("/observation", observation);
    return response.data;
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

export const updateObservation = async (id, observation) => {
  try {
    const response = await baseService.put(`/observation/${id}`, observation);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteObservation = async (id) => {
  try {
    const response = await baseService.delete(`/observation/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getObservationById = async (id) => {
  try {
    const response = await baseService.get(`/observation/project/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};
export const updateStatusObservation = async (id, data) => {
  try {
    const response = await baseService.put(
      `observation/change-observation-status/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
