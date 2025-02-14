import {
  SetProjectCreated,
  SetProjectinvite,
  SetProject,
  SetProjectinviteupdate,
  SetProjectFilterinvite,
  SetscaffoldingWeight,
  SetProjectName,
} from "../Redux/Slice/projectSlice";
import { store } from "../Redux/store";
import baseService from "./baseService";

export const projectCreateService = async (data) => {
  try {
    const response = await baseService.post("/project/create", data);
    store.dispatch(SetProjectCreated(response?.data?.status));
    store.dispatch(SetProject(response?.data?.project));
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};
export const projectInviteService = async (data) => {
  try {
    const response = await baseService.post("/invite/invite-store", data);
    store.dispatch(SetProjectinvite(response?.data));
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};
export const projectInviteUpdateService = async (id, data) => {
  console.log(data);
  try {
    const response = await baseService.put(`/invite/update-invite/${id}`, data);
    store.dispatch(SetProjectinviteupdate(response?.data));
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};

export const projectgetService = async (filter) => {
  const token = localStorage.getItem("token");
  try {
    const response = await baseService.get(`/project?${filter}`, {
      headers: {
        "x-auth-token": token,
      },
    });
    const projectData = response?.data?.projects;
    const filterProjectData = projectData?.filter((item) => !item?.isDeleted);
    store.dispatch(SetProject(filterProjectData));
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};

export const getProjectByIdService = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await baseService.get(`/project/get-project-by-id/${id}`, {
      headers: {
        "x-auth-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const projectDeleteService = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await baseService.put(`/project/${id}`, null, {
      headers: {
        "x-auth-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const editProjectService = async (data, id) => {
  try {
    const response = await baseService.put(
      `/project/update-project/${id}`,
      data
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getProjectSearchData = (searchTerm) => {
  try {
    const response = baseService.get(
      `/project/project-search/search?searchTerm=${searchTerm}`,
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
export const projectInviteFilterService = async (id) => {
  try {
    const response = await baseService.get(`invite/invite-user/${id}`);
    store.dispatch(SetProjectFilterinvite(response?.data?.invite));
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};
export const projectCalendarService = async (projectId, userId) => {
  try {
    const response = await baseService.get(
      `/calendar-notes/${projectId}/${userId}`
    );
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};

export const projectPostCalendarService = async (eventsData) => {
  try {
    const response = await baseService.post(`/calendar-notes`, eventsData);
    return response.data;
  } catch (error) {
    return error.response?.data ? error.response?.data : error.message;
  }
};
export const scaffoldingWeight = async (data) => {
  try {
    store.dispatch(SetscaffoldingWeight(data));
  } catch (error) {
    return error;
  }
};

export const getAllInvite = async () => {
  try {
    const response = await baseService.get(`/invite`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const removeInviteService = async (data) => {
  console.log("data", data);
  try {
    const removeInviteResponse = await baseService.put(
      `/invite/remove-invite`,
      data
    );
    return removeInviteResponse;
  } catch (error) {
    return error;
  }
};

export const getProjectName = async (id) => {
  try {
    const response = await baseService.get(`/project/get-project-name/${id}`);
    store.dispatch(SetProjectName(response?.data?.projectName));
    return response.data;
  } catch (error) {
    return error;
  }
};

export const acceptInviteService = async (data) => {
  try {
    const response = await baseService.post(`/invite/accept-invite`, data);
    return response.data;
  } catch (error) {
    return error;
  }
};
