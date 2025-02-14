import baseService from "./baseService";

export const getScaffoldLogService = async (id) => {
  try {
    const response = await baseService.get(`/scaffold-log`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getScaffoldLogByIdService = async (id) => {
  try {
    const response = await baseService.get(`/scaffold-log/${id}`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getScaffoldLogs = async (searchParams) => {
  try {
    const response = await baseService.get(
      "/scaffold-log/scaffold-search/search",
      {
        params: searchParams,
      }
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};
