import baseService from "./baseService";
import { store } from "../Redux/store";

export const approvalFormCreateService = async (data) => {
  try {
    const response = await baseService.post("/approval-form", data, {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": store.getState().auth.token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const approvalFormGetService = async () => {
  try {
    const response = await baseService.get("/approval-form");
    return response;
  } catch (error) {
    return error;
  }
};

export const approvalFormDownloadService = async (id) => {
  try {
    const response = await baseService.get(`/approval-form/get-by-id/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const getApprovalFormByIdService = async (id) => {
  try {
    const response = await baseService.get(`/approval-form/get-by-id/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const approvalFormUpdateService = async (data, id) => {
  try {
    const response = await baseService.put(
      `/approval-form/update-approval-form/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": store.getState().auth.token,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const approvalFormUpdateStatusService = async (data, id) => {
  try {
    const response = await baseService.put(
      `/approval-form/change-approval-status/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": store.getState().auth.token,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const changeDismantleDateService = async (data, id) => {
  try {
    const response = await baseService.put(
      `/approval-form/change-dismantle-date/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": store.getState().auth.token,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteApprovalFormService = async (id) => {
  try {
    const response = await baseService.put(
      `/approval-form/delete-approval-form/${id}`,
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

export const getApprovalFormSearchData = async (projectId, searchTerm) => {
  try {
    const response = await baseService.get(
      `approval-form/${projectId}/search?searchTerm=${searchTerm}`,
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

export const getApprovalFormByProjectId = async (projectId) => {
  try {
    const response = await baseService.get(
      `/approval-form/project/${projectId}`,
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

export const getApprovalFormByUserId = async (userId) => {
  try {
    const approvalResponse = await baseService.get(`approval-form/${userId}`, {
      headers: {
        "x-auth-token": store.getState().auth.token,
      },
    });
    return approvalResponse?.data;
  } catch (error) {
    return error;
  }
};

export const searchProjectLogs = async (userId, searchTerm) => {
  try {
    const logsResponse = await baseService.get(
      `approval-form/${userId}/search-logs`,
      {
        params: searchTerm,
      }
    );
    return logsResponse.data;
  } catch (error) {
    return error;
  }
};
