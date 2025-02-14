import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { getProjectByIdService } from "../../Services/projectService";
import { toast } from "react-toastify";
import { createObservation } from "../../Services/observationService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { t } from "../../utils/translate";
import ImageUpload from "../FileUpload";

const schema = yup.object().shape({
  projectDetail: yup.object().shape({
    projectName: yup.string(),
    observationTitle: yup.string().required("Observation Title is required"),
    Observationisrelatedto: yup.string(),
    Didyoutakeaction: yup.string(),
    Isthereneedforfurtheraction: yup.string(),
  }),
});

const ObservationForms = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const { accessLevel: roleOfUser } = useSelector((state) => state?.project);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectDetail, setProjectDetail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [observationData, setObservationData] = useState([]);
  const [mediaAttachment, setMediaAttachment] = useState("");
  const [action, setAction] = useState({
    takeAction: { isTakeAction: false, value: "" },
    furtherAction: { isFurtherAction: false, value: "" },
  });
  const [selectedOption, setSelectedOption] = useState({
    takeAction: "",
    furtherAction: "",
  });

  const [riskAssessment, setRiskAssessment] = useState({
    value: "",
    riskLevel: "",
  });

  const [observationDetails, setObservationDetails] = useState({
    observationCategory: "",
    observationDescription: "",
  });

  const [observerDetails, setObserverDetails] = useState({
    observerDetail: "",
    observerDate: "",
  });

  const [yourNames, setYourNames] = useState({
    yourName: "",
    anonymous: "",
  });

  const {
    register,
    handleSubmit,

    setValue,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      projectDetail: {
        projectName: projectDetail?.projectName,
        Didyoutakeaction: projectDetail?.Didyoutakeaction,
      },
    },
  });
  const styles = {
    color: "red",
  };
  useEffect(() => {
    getProjectDetail();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        userId: projectDetail?.userId,
        projectNumber: projectDetail?.projectNumber,
        projectId: projectId,
        ...observationData,
        notificationToAdminCreate: roleOfUser === 0 ? false : true,
        observationAction: action,
        observationMedia: mediaAttachment,
        riskAssessment,
        observationDetails,
        observerDetails,
        status: action?.furtherAction?.isFurtherAction ? "latest" : "under",
        yourNames,
      };

      const response = await createObservation(payload);
      if (response?.success) {
        toast.success(t("observationFormCreatedSuccessfully"));
        navigate(`/observation-listing/${projectId}`);
      } else {
        toast.error(t("thereIsSomeError"));
      }
    } catch (error) {
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectDetail = async () => {
    const response = await getProjectByIdService(projectId);
    setProjectDetail(response?.data?.project);
  };

  const handleMediaAttachment = (url) => {
    setObservationData(setMediaAttachment(""));
  };

  const handleOptionChange = (e, actionType) => {
    const value = e.target.value;
    setSelectedOption((prev) => ({ ...prev, [actionType]: value }));

    if (value === "yes") {
      setAction((prevState) => ({
        ...prevState,
        [actionType]: {
          ...prevState[actionType],
          [`is${capitalizeFirstLetter(actionType)}`]: true,
        },
      }));
    } else {
      setAction((prevState) => ({
        ...prevState,
        [actionType]: {
          ...prevState[actionType],
          [`is${capitalizeFirstLetter(actionType)}`]: false,
          value: "",
        },
      }));
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <div className=" border-b-[#cccccc] border-b">
        <div className="custom-container flex flex-col md:flex-row gap-[20px] justify-between items-center ">
          <p className="title-text uppercase">{t("observation")}</p>
          <div className="flex flex-col gap-[30px]">
            <div className="flex justify-between items-center mb-5">
              <div className="flex justify-center items-center gap-[1rem]">
                <div className="flex justify-between rounded-[5px] items-center gap-[30px] border border-[rgb(204, 204, 204)] px-[10px] py-[11px] bg-[white]">
                  <p className="project-number leading-0">{t("projectName")}</p>
                  <p className="medium-title leading-0 uppercase">
                    {projectDetail?.projectName || (
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div>
                    )}
                  </p>
                </div>
                <div className="flex justify-between rounded-[5px] items-center gap-[30px] border border-[rgb(204, 204, 204)] px-[10px] py-[11px] bg-[white]">
                  <p className="project-number leading-0">
                    {t("projectNumber")}
                  </p>
                  <p className="medium-title leading-0">
                    {projectDetail?.projectNumber || (
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="custom-container !mt-10">
          <p className="medium-title mb-3">{t("observerDetail")}:</p>
          <div className="flex justify-between items-start gap-[30px] flex-wrap w-full mb-10">
            <div className="lg:w-[calc(50%-20px)] flex flex-col md:flex-row justify-between gap-[20px] w-full">
              <lable className="project-number w-full md:w-[calc(30%-10px)]">
                <label className="project-number w-full md:w-[calc(30%-10px)]">
                  {t("observation-title")}
                  <span style={{ color: "red", fontSize: "1.5em" }}>*</span>
                </label>
              </lable>
              <div>
                <input
                  className="input-without-icon-1 w-[70%]"
                  type="text"
                  placeholder={t("observation-title")}
                  {...register("projectDetail.observationTitle", {
                    required: true,
                  })}
                  value={observerDetails.observerDetail}
                  onChange={(e) =>
                    setObserverDetails({
                      ...observerDetails,
                      observerDetail: e.target.value,
                    })
                  }
                />

                <div>
                  {errors.projectDetail?.observationTitle && (
                    <span style={styles} className="mt-2 whitespace-nowrap">
                      {errors?.projectDetail?.observationTitle?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[calc(50%-20px)] flex flex-col md:flex-row justify-between gap-[20px]">
              <lable className="project-number w-full md:w-[calc(20%-10px)] flex  justify-start items-start">
                {t("observationDate")}
                <span
                  style={{ color: "red", fontSize: "1.5em" }}
                  className="z-50 "
                >
                  *
                </span>
              </lable>
              <div className="w-[70%]">
                <input
                  className="input-without-icon-1 h-[50px]"
                  type="date"
                  placeholder="Scaffold Identification/Number"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  {...register("projectDetail.dateOfObservation", {
                    required: true,
                  })}
                  value={observerDetails.observerDate}
                  onChange={(e) =>
                    setObserverDetails({
                      ...observerDetails,
                      observerDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <p className="medium-title mb-3">{t("observationDetails")}:</p>
          <div className="flex justify-between items-start gap-[30px] flex-wrap w-full ">
            <div className="w-full lg:w-[calc(50%-20px)] flex flex-col md:flex-row justify-between gap-[20px]">
              <label className="project-number w-full md:w-[calc(30%-10px)] text-nowrap">
                {t("observationCategory")}{" "}
                <span style={{ color: "red", fontSize: "1.5em" }}>*</span>
              </label>
              <div className="w-[70%]">
                <select
                  className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500"
                  {...register("projectDetail.Observationisrelatedto", {
                    required: true,
                  })}
                  value={observationDetails.observationCategory}
                  onChange={(e) =>
                    setObservationDetails({
                      ...observationDetails,
                      observationCategory: e.target.value,
                    })
                  }
                >
                  <option value="">{t("Observationisrelatedto")}</option>
                  <option value="safety">{t("safety")}</option>
                  <option value="quality"> {t("quality")}</option>
                  <option value="environmental">{t("environmental")}</option>
                  <option value="efficiency">{t("efficiency")}</option>
                  <option value="equipment">{t("equipment")}</option>
                  <option value="positive">{t("positive")}</option>
                  <option value="other">{t("other")}</option>
                </select>
                {errors.projectDetail?.Observationisrelatedto && (
                  <span className="mt-2 whitespace-nowrap" style={styles}>
                    {errors?.projectDetail?.Observationisrelatedto?.message}
                  </span>
                )}
              </div>
            </div>

            <div className="w-full lg:w-[calc(50%-20px)] flex flex-col md:flex-row justify-between gap-[20px]">
              <lable className="project-number w-full md:w-[calc(20%-10px)] flex  justify-start items-start">
                {t("observationDescription")}:{" "}
                <span
                  style={{ color: "red", fontSize: "1.5em" }}
                  className="z-50 "
                >
                  *
                </span>
              </lable>
              <div className="w-[70%]">
                <textarea
                  className="textarea-without-icon-1 p-[10px] "
                  type="text"
                  placeholder={t("What-Is-Observed")}
                  value={observationDetails.observationDescription}
                  onChange={(e) =>
                    setObservationDetails({
                      ...observationDetails,
                      observationDescription: e.target.value,
                    })
                  }
                />
                {errors.projectDetail?.WhatIsObserved && (
                  <span className="mt-2 whitespace-nowrap" style={styles}>
                    {errors?.projectDetail?.WhatIsObserved?.message}
                  </span>
                )}
              </div>
            </div>

            <div className="w-full lg:w-[calc(50%-20px)] flex flex-col md:flex-row gap-[20px]">
              <lable className="project-number w-full md:w-[calc(30%-10px)]">
                {t("Didyoutakeaction")}{" "}
                <span style={{ color: "red", fontSize: "1.5em" }}>*</span>
              </lable>
              <div>
                <div className="w-[70%] flex gap-10 ">
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      id="yes"
                      value="yes"
                      onChange={(e) => {
                        handleOptionChange(e, "takeAction");
                      }}
                      checked={selectedOption.takeAction === "yes"}
                    />
                    <label htmlFor="yes">{t("Yes")}</label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      id="no"
                      value="no"
                      onChange={(e) => {
                        handleOptionChange(e, "takeAction");
                      }}
                      checked={selectedOption.takeAction === "no"}
                    />
                    <label htmlFor="no">{t("No")}</label>
                  </div>
                </div>
                {action.takeAction.isTakeAction && (
                  <textarea
                    className="textarea-without-icon-1 p-[10px] mt-2"
                    type="text"
                    placeholder={t("describeAction")}
                    value={action.takeAction.value}
                    onChange={(e) =>
                      setAction((prevState) => ({
                        ...prevState,
                        takeAction: {
                          ...prevState.takeAction,
                          value: e.target.value,
                        },
                      }))
                    }
                  />
                )}
              </div>
            </div>

            <div className="w-full lg:w-[calc(50%-20px)] flex flex-col md:flex-row gap-[20px]">
              <lable className="project-number w-full md:w-[calc(30%-10px)]">
                {t("describeFurtherAction")}{" "}
                <span style={{ color: "red", fontSize: "1.5em" }}>*</span>
              </lable>
              <div>
                <div className="w-[70%] flex gap-10 ">
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      id="yes"
                      value="yes"
                      onChange={(e) => handleOptionChange(e, "furtherAction")}
                      checked={selectedOption.furtherAction === "yes"}
                    />
                    <label htmlFor="yes">{t("Yes")}</label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      id="no"
                      value="no"
                      onChange={(e) => handleOptionChange(e, "furtherAction")}
                      checked={selectedOption.furtherAction === "no"}
                    />
                    <label htmlFor="no">{t("No")}</label>
                  </div>
                </div>
                {action.furtherAction.isFurtherAction && (
                  <textarea
                    className="textarea-without-icon-1 p-[10px] mt-2"
                    type="text"
                    placeholder={t("describeFurtherAction")}
                    value={action.furtherAction.value}
                    onChange={(e) =>
                      setAction((prevState) => ({
                        ...prevState,
                        furtherAction: {
                          ...prevState.furtherAction,
                          value: e.target.value,
                        },
                      }))
                    }
                  />
                )}
              </div>
            </div>

            <div className="w-full lg:w-[calc(50%-20px)] flex flex-col md:flex-row justify-between gap-[20px]">
              <lable className="project-number w-full md:w-[calc(30%-10px)]">
                {t("mediaAttachment")}{" "}
                {/* <span style={{ color: "red", fontSize: "1.5em" }}>*</span> */}
              </lable>
              <div className="w-[70%] flex flex-col gap-2">
                <ImageUpload
                  handleDeleteDocument={handleMediaAttachment}
                  status={mediaAttachment ? true : false}
                  setMediaAttachment={setMediaAttachment}
                  isObservationMedia={true}
                />
                {mediaAttachment && (
                  <div className="border max-w-[150px]">
                    <img src={mediaAttachment} alt="media" />
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-[calc(50%-20px)] flex flex-col md:flex-row justify-between gap-[20px] relative">
              {/* <lable className="project-number w-full md:w-[calc(30%-10px)]">
                {t("riskAssessment")}:
                <span style={{ color: "red", fontSize: "1.5em" }}>*</span>
              </lable>
              <div className="w-[70%]">
                <textarea
                  className="textarea-without-icon-1 p-[10px]"
                  type="text"
                  placeholder={t("riskAssessment")}
                  {...register("projectDetail.WhatIsObserved", {
                    required: true,
                  })}
                  value={riskAssessment.value}
                  onChange={(e) => {
                    setRiskAssessment({
                      ...riskAssessment,
                      value: e.target.value,
                    });
                  }}
                />
                {errors.projectDetail?.WhatIsObserved && (
                  <span className="mt-2 whitespace-nowrap" style={styles}>
                    {errors?.projectDetail?.WhatIsObserved?.message}
                  </span>
                )}
              </div> */}
              <div className="absolute md:w-[calc(100%)]  bottom-[-50px] left-0 sm:flex flex:col  justify-center items-center gap-10">
                <lable className="project-number w-full md:w-[calc(30%-10px)] text-nowrap mr-8">
                  Risk Level:
                </lable>
                <select
                  onChange={(e) => {
                    setRiskAssessment({
                      ...riskAssessment,
                      riskLevel: e.target.value,
                    });
                  }}
                  className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value={""}>Please Select The Risk</option>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>
          </div>
          <div className="sm:flex-row flex flex-col gap-3 justify-between mt-[100px]">
            <div className="w-full lg:w-[calc(50%-20px)] flex flex-col md:flex-row justify-between gap-[20px] relative">
              <label
                for="your_name"
                className="font-semibold text-sm text-[#0c4a72] text-nowrap"
              >
                Your Name
              </label>
              <input
                type="text"
                id="your_name"
                placeholder="Type Your Name"
                value={yourNames?.yourName}
                onChange={(e) =>
                  setYourNames({ ...yourNames, yourName: e.target.value })
                }
                className="text-sm font-medium !pl-2 !border"
              />
            </div>
            {/* <div className="w-full lg:w-[calc(50%-20px)] flex flex-col md:flex-row justify-between gap-[20px] relative">
              <label
                for="anonymous"
                className="font-semibold text-sm text-[#0c4a72]"
              >
                Anonymous
              </label>
              <input
                type="text"
                id="anonymous"
                placeholder="Anonymous Name"
                className="text-sm font-medium !pl-2 !border"
                value={yourNames?.anonymous}
                onChange={(e) =>
                  setYourNames({ ...yourNames, anonymous: e.target.value })
                }
              />
            </div> */}
          </div>

          <div className="text-center mt-[100px]">
            <button
              onClick={handleSubmit}
              type="submit"
              className="button-text bg-[#0072BB] px-[20px] py-[10px] rounded-[5px] text-white"
            >
              {isLoading ? t("loading") : t("sendforReview")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ObservationForms;
