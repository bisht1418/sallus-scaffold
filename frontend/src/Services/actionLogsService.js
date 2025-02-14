import baseService from "./baseService";
import { store } from "../Redux/store";

export const getActionLogsList = async () => {
 try {
  const actionLogsResponse = await baseService.get(`/action-logs/get-notification`);
  return actionLogsResponse?.data
 } catch (error) {
  return error
 }
}

export const deleteNotification = async (id) => {
 try {
  const deleteResponse = await baseService.delete(`/action-logs/delete-notification/${id}`);
  return deleteResponse?.data
 } catch (error) {
  return error
 }
}