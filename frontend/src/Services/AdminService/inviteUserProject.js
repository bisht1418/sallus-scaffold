import baseService from "../baseService";

export const getInviteFormByUserId = async (userId) => {
  try {
    const inviteResponse = await baseService.get(
      `/invite/invite-user/user-id/${userId}`
    );
    return inviteResponse.data;
  } catch (error) {
    return error;
  }
};

export const getAllInviteForm = async (userId) => {
  try {
    const inviteResponse = await baseService.get(`/invite`);
    return inviteResponse.data;
  } catch (error) {
    return error;
  }
};
