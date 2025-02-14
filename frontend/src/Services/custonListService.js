import baseService from "./baseService";

export const createCustomList = async (data) => {
  try {
    const response = await baseService.post(`/custom-material-list`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const editCustomList = async (data, customListId) => {
  try {
    const response = await baseService.put(
      `/custom-material-list/update-custom-material/${customListId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getAllCustomListData = async () => {
  try {
    const response = await baseService.get(`/custom-material-list`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getAllUserExceptAdmin = async () => {
  try {
    const response = await baseService.get(`/get-all-user`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getCustomListDataByProjectId = async (projectId) => {
  try {
    const response = await baseService.get(
      `/custom-material-list/project-id/${projectId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteCustomListById = async (customListId) => {
  try {
    const response = await baseService.delete(
      `/custom-material-list/delete-custom-material/${customListId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const shareCustomList = async (data) => {
  try {
    const response = await baseService.post(
      `/custom-material-list/share-custom-list`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
