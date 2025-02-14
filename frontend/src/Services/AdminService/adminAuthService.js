import baseService from ".././baseService";
import { store } from "../../Redux/store";

export const adminSignUpService = async (data) => {
  try {
    const response = await baseService.post("/admin/admin-signup", data);
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};

export const AdminSignInService = async (data) => {
  try {
    const response = await baseService.post("/admin/admin-signin", data);
    return response.data;
  } catch (error) {
    console.log("error", error);
    return error?.response;
  }
};

export const onlyAdminSignInService = async (data) => {
  try {
    const response = await baseService.post("/admin/only-admin-signin", data);
    return response.data;
  } catch (error) {
    return error;
  }
};
