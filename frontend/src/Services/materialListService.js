import baseService from "./baseService";
import { store } from "../Redux/store";
import {
  SetMaterialList,
  CreateMaterialList,
  UpdateMaterialList,
  setSearchMaterialLits,
} from "../Redux/Slice/materialListSlice";
export const materialListgetService = async () => {
  try {
    const response = await baseService.get("/material-list");
    const lang = store.getState().global.current_language;
    await store.dispatch(
      SetMaterialList({ data: response?.data?.data, lang: lang })
    );
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};
export const craeteMaterialList = async (data) => {
  store.dispatch(CreateMaterialList(data));
};
export const updateMaterialListIteam = async (data) => {
  store.dispatch(UpdateMaterialList(data));
};

export const createMaterialListWithUserId = async (data) => {
  try {
    const response = await baseService.post("/material-list", data);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const checkMaterialListWithMaterialId = async (id) => {
  try {
    const response = await baseService.get(
      `/material-list/check-material/${id}`
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getMaterialListWithUserId = async (id) => {
  try {
    const response = await baseService.get(`/material-list/user-id/${id}`);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getMaterialListSearch = async (data) => {
  try {
    const response = await baseService.get(
      `material-list/material/search?description=${data}`
    );
    store.dispatch(setSearchMaterialLits(response?.data?.data));
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};
