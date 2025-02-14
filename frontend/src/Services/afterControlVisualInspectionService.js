import baseService from "./baseService";

export const getAfterControlVisualInspectionService = async (
  approvalFormId
) => {
  try {
    const response = await baseService.get(
      `/after-control-visual-inspection/${approvalFormId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateAfterControlVisualInspectionService = async (
  approvalFormId,
  data
) => {
  try {
    const response = await baseService.put(
      `/after-control-visual-inspection/${approvalFormId}`,
      data
    );
    return response;
  } catch (error) {
    return error;
  }
};
