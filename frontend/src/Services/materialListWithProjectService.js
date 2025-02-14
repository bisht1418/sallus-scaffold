import baseService from "./baseService";
import { store } from "../Redux/store";
import {
  SetMaterialListsAdmin,
  SetMaterialListsuser,
  SetNotification,
  SetProjectTransfer,
  SetTransferProject,
} from "../Redux/Slice/materialListWithProjectSlice";
export const materialListWithProjectCreateService = async (data) => {
  try {
    const response = await baseService.post("/material", data, {
      headers: {
        "x-auth-token": store.getState().auth.token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
export const materialListWithProjectGetService = async (id) => {
  try {
    const response = await baseService.get(`/material/project-id/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteMaterialListWithProjectService = async (id) => {
  try {
    const response = await baseService.delete(`/material/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const updateMaterialListWithProjectService = async (id, data) => {
  try {
    const response = await baseService.put(`/material/${id}`, data);
    return response;
  } catch (error) {
    return error;
  }
};

export const getMaterialListWithProjectByIdService = async (id) => {
  try {
    const response = await baseService.get(`/material/material-id/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const getMaterialListByCustomId = async (id) => {
  try {
    const response = await baseService.get(`/material/${id}`);
    return response?.data;
  } catch (error) {
    return error;
  }
};
export const updateStatusMaterialList = async (id, data) => {
  try {
    const response = await baseService.put(
      `material/change-materiallist-status/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
export const getMaterialListSearchData = (searchTerm, id) => {
  try {
    const response = baseService.get(
      `material/materiallist-search/search?searchTerm=${searchTerm}&projectId=${id}`,
      // /material/materiallist-search/search?searchTerm=sdvf&projectId=6577fe9340889f7445185b49
      {
        headers: {
          "x-auth-token": store.getState().auth.token,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};
//oldcode
export const getTransferProject = async (id) => {
  try {
    const response = await baseService.get(`material/project/${id}`);
    const uniqueProjects = {};
    const transferData = response?.data?.filteredProjects.filter(
      (ele) => !ele?.isDeleted
    );
    transferData.forEach((el) => {
      if (!uniqueProjects[el.projectName]) {
        uniqueProjects[el.projectName] = [];
      }
      uniqueProjects[el.projectName].push({
        id: el?._id,
        name: el?.materialListName,
        projectId: el?.projectId?._id,
      });
    });
    const data = Object.entries(uniqueProjects);
    store.dispatch(SetTransferProject(data));
    return response.data;
  } catch (error) {
    return error;
  }
};
export const getMaterialListAdmin = async () => {
  try {
    const response = await baseService.get("material/admin-permission");
    store.dispatch(
      SetMaterialListsAdmin(
        response?.data.filter((item) => item?.permisssionUserToAdmin === true)
      )
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};
export const getMaterialListUser = async () => {
  try {
    const response = await baseService.get("material/admin-permission");
    store.dispatch(
      SetMaterialListsuser(
        response?.data.filter((item) => item?.permisssionAdminToUser === true)
      )
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};

// change code
export const getProjectTransfer = async (searchTerm) => {
  try {
    const response = await baseService.get(
      `/material/project-transfer?query=${searchTerm}`,
      {
        headers: {
          "x-auth-token": store.getState().auth.token,
        },
      }
    );
    store.dispatch(SetProjectTransfer(response?.data?.data));
    return response;
  } catch (error) {
    return error;
  }
};
export const getNotification = async () => {
  try {
    const response = await baseService.get(`/project/notification`);
    store.dispatch(SetNotification(response?.data));
    return response;
  } catch (error) {
    return error;
  }
};
