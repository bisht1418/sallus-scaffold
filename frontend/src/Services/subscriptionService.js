import { setSubscription } from "../Redux/Slice/subscriptionSlice";
import { store } from "../Redux/store";
import baseService from "./baseService";

export const getSubscriptionDetails = async (data) => {
  try {
    const response = await baseService.get("/get-subscription-plan");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getSubscriptionDetailByUserId = async (id) => {
  try {
    const response = await baseService.get(`/get-subscription/${id}`);
    if (response?.data?.success) {
      store.dispatch(setSubscription(response?.data?.data));
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

export const removeSubscriptionByUserId = async (id, data) => {
  try {
    const response = await baseService.put(`/edit-subscription/${id}`, data);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const createSubscriptionAccessByOneToOtherUser = async (data) => {
  try {
    const response = await baseService.post(`/create-subscription`, data);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getSubscriptionData = async (subscribedBy) => {
  try {
    const response = await baseService.get(
      `/get-subscription-by-subscribedBy/${subscribedBy}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getSubscriptionActiveDataCount = async (subscribedBy) => {
  try {
    const response = await baseService.get(
      `/get-subscription-count/${subscribedBy}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const revokeSubscription = async (subscriptionId, currentEvent) => {
  try {
    const response = await baseService.put(
      `/revoke-subscription/${subscriptionId}`,
      currentEvent
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
export const deleteSubscriptionUser = async (subscriptionId) => {
  try {
    const response = await baseService.delete(
      `/delete-subscription-user/${subscriptionId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const cancelMainUserSubscription = async (userId) => {
  try {
    const response = await baseService.put(`/cancel-subscription/${userId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const sendSubscriptionMail = async (data) => {
  try {
    const response = await baseService.post(`/send-subscription-mail`, data);
    return response.data;
  } catch (error) {
    return error;
  }
};


export const sendSubscriptionPrizeMail = async (data) => {
  try {
    const response = await baseService.post(`/send-prize-mail`, data);
    return response.data;
  } catch (error) {
    return error;
  }
};