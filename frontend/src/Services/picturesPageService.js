import baseService from "./baseService";
import { store } from "../Redux/store";

export const getPicturesPageService = async (id) => {
  try {
    const response = await baseService.get(`/file/${id}`, {
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

export const deletePictureService = async (id) => {
  try {
    const response = await baseService.put(`/file/${id}`, {
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
