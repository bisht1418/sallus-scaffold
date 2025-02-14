import { setFile } from "../Redux/Slice/filesSlice";
import { store } from "../Redux/store";
import baseService from "./baseService";

export const filesService = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await baseService.get(`/file/${id}`, {
      headers: {
        "x-auth-token": token,
      },
    });
    store.dispatch(setFile(response?.data?.files));
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};

export const createFilesService = async (data) => {
  try {
    const response = await baseService.post("/file", data);
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};

export const deleteFilesService = async (id) => {
  try {
    const response = await baseService.put(`/file/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};

export const searchFilesService = async (search) => {
  try {
    const response = await baseService.get(
      `/file/file-search/search?searchTerm=${search}`,
      {
        headers: {
          "x-auth-token": store.getState().auth.token,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
