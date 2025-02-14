import baseService from "./baseService";

export const createVisitorService = async (data) => {
  try {
    const response = await baseService.post("/visitor/create-visitor", data);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getVisitorService = async () => {
  try {
    const response = await baseService.post("/visitor/get-visitor");
    return response.data;
  } catch (error) {
    return error;
  }
};
