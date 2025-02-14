import baseService from "../baseService";

export const getAllUsersService = async (data) => {
  try {
    const response = await baseService.get("/all-users", data);
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};

export const deleteUser = async (data) => {
  try {
    const deleteResponse = await baseService.post("/delete-user", data);
    return deleteResponse.data;
  } catch (error) {
    return error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await baseService.post(`/admin/user/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getVisitorDetailsList = async () => {
  try {
    const response = await baseService.get(`/visitor/get-visitor`);
    return response.data;
  } catch (error) {
    return error;
  }
};
