import baseService from "./baseService";

export const createContactUsFormService = async (data) => {
  try {
    const response = await baseService.post(
      `/contact-us-form/contact-us`,
      data,
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

export const createQuestionRequestFormService = async (data) => {
  try {
    const response = await baseService.post(
      `/contact-us-form/question-request`,
      data,
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
