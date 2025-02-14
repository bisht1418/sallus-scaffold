import baseService from "./baseService";

// Invite service functions
export const updateInviteStatus = async (id, status) => {
    try {
      const response = await baseService.put(`/invite/update-invite/${id}`, { status });
      return response.data;
    } catch (error) {
      return error.response;
    }
  };
  
  export const deleteNotification = async (id) => {
    try {
      const response = await baseService.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      return error.response;
    }
  };