import baseService from "../baseService";

export const getAllProjectService = async () => {
  try {
    const response = await baseService.get("/project/get-all-project/admin");
    return response?.data;
  } catch (error) {
    return error;
  }
};
export const getProjectByUserIdService = async (userId) => {
  try {
    const response = await baseService.get(`/project/get-project/${userId}`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const projectDeleteService = async (id) => {
  try {
    const response = await baseService.put(`/project/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};
