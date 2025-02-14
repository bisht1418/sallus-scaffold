/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import SignatureModal from "../components/SignatureModal";
import { RiAddFill } from "react-icons/ri";
import _ from "lodash";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateSafeJobAnalysis } from "../Services/safeJobAnalysisService";
import { Link, useParams } from "react-router-dom";
import { getProjectByIdService } from "../Services/projectService";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getSafeJobAnalysisById } from "../Services/safeJobAnalysisService";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TopSection from "../components/forms/TopSection";
import no_data from "../Assets/noData.svg";
import SignaturePersonModal from "../components/SignaturePersonModal";
import { t } from "../utils/translate";
import { useSelector } from "react-redux";
import { VscEdit } from "react-icons/vsc";
import SafetyChecklist from "../components/SafetyChecklist";
import RequiredPermitChecklist from "../components/RequiredPermitChecklist";
import DesignatedWorkChecklist from "../components/DesignatedWorkChecklist";
import PdfGenerator from "../components/PdfGenerator";
const schema = yup.object().shape({
  projectDetail: yup.object().shape({
    safeJobAnalysisName: yup
      .string()
      .required(t("safeJobAnalysisNameIsRequired")),
    dateOfAnalysis: yup.string().required(t("dateOfAnalysisIsRequired")),
    workDescription: yup.string().required(t("workDescriptionIsRequired")),
  }),
  emergencyProcedure: yup.string()
});

const SafeJobAnalysisPdf = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const { accessLevel: roleOfUser } = useSelector((state) => state?.project);
  const { projectId, safeJobAnalysisId } = useParams();
  const navigate = useNavigate();
  const [getSafeJobAnalysisData, setGetJobAnalysisData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenone, setModalOpenone] = useState(false);
  const [isModalOpentwo, setModalOpentwo] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const [signPersonImage, setSigPersonImage] = useState([]);
  const [signatureImageone, setSignatureImageone] = useState(null);
  const [addSignatureData, SetAddSignatureData] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPersonName, setCustomerPersonName] = useState([]);
  const [approverName, setApproverName] = useState("");
  const [projectDetail, setProjectDetail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [personSignatures, setPersonSignatures] = useState([]);
  const [isPersonModalOpen, setPersonModalOpen] = useState(false);
  const [addData, setAddData] = useState({
    name: "",
    signature: "",
  });
  const [scaffoldData, setScaffoldData] = useState([]);
  const [selectedSubTask, setSelectedSubTask] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("");
  const [selectedMeasure, setSelectedMeasure] = useState("");
  const [divCount, setDivCount] = useState(1);
  const [data, setData] = useState(
    [...Array(divCount)].map(() => ({ risk: "", measure: "" }))
  );

  const defaultItems = [
    { checkListName: 'Hard Hat', yes: false, na: false, no: false },
    { checkListName: 'Safety Glasses', yes: false, na: false, no: false },
    { checkListName: 'Gloves', yes: false, na: false, no: false },
    { checkListName: 'Safety Boots', yes: false, na: false, no: false },
    { checkListName: 'High-Visibility Clothes', yes: false, na: false, no: false },
    { checkListName: 'Hearing Protection', yes: false, na: false, no: false },
    { checkListName: 'Dust/Filter Mask', yes: false, na: false, no: false },
    { checkListName: 'Protection Harness', yes: false, na: false, no: false },
  ];

  const defaultRequirePermit = [
    { checkListName: 'Work In Heights', yes: false, na: false, no: false },
    { checkListName: 'Confined Space', yes: false, na: false, no: false },
    { checkListName: 'Hot work', yes: false, na: false, no: false },
  ]

  const defaultDesignatedWorkArea = [
    { checkListName: 'Cordon off area', yes: false, na: false, no: false },
    { checkListName: 'Is there sufficient lighting?', yes: false, na: false, no: false },
    { checkListName: 'Does the work team have the right skills for the task?', yes: false, na: false, no: false },
    { checkListName: 'Does everyone on the work team agree that the job can be done safely?', yes: false, na: false, no: false },
    { checkListName: 'Is there other work in the area?', yes: false, na: false, no: false },
  ]

  const [items, setItems] = useState(defaultItems);
  const [requiredPermit, setRequiredPermit] = useState(defaultRequirePermit)
  const [designatedWorkArea, setDesignatedWorkArea] = useState(defaultDesignatedWorkArea)

  const styles = {
    color: "red",
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      projectDetail: {
        projectName: projectDetail?.projectName ?? "",
      },
    },
  });

  useEffect(() => {
    getProjectDetail();
    getSafeJobAnalysisDataById();
  }, []);

  const getSafeJobAnalysisDataById = async () => {
    try {
      setLoading(true);
      const response = await getSafeJobAnalysisById(safeJobAnalysisId);
      const responseData = response?.data;
      setScaffoldData(responseData?.scaffoldData);
      setGetJobAnalysisData(responseData);

      setSignatureImage(responseData?.signature?.customer?.signature);
      setSigPersonImage(responseData?.signature?.person);
      setCustomerName(responseData?.signature?.customer?.name);
      setCustomerPersonName(responseData?.signature?.person);
      setSignatureImageone(responseData?.signature?.approver?.signature);
      setApproverName(responseData?.signature?.approver?.name);
      setPersonSignatures(responseData?.signature?.person);
      SetAddSignatureData(responseData?.responsibleWorkers);
      setItems(responseData?.protectiveEquipment)
      setRequiredPermit(responseData?.typeOfWork)
      setDesignatedWorkArea(responseData?.designatedWorkArea)

      reset(responseData);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      return error;
    } finally {
      setLoading(false);
    }
  };

  const handleAddSignature = () => {
    setModalOpen(true);
  };

  const handleAddSignatureone = () => {
    setModalOpenone(true);
  };

  const handleAddSignaturetwo = () => {
    setModalOpentwo(true);
  };

  const handleSaveSignature = (signatureDataUrl, name) => {
    setSignatureImage(signatureDataUrl, name);
    setCustomerName(name);
  };
  const signatureDate = new Date();
  const formattedDate = signatureDate.toLocaleDateString();
  const handlePersonSaveSignature = (signatureDataUrl, name) => {
    setSigPersonImage(signatureDataUrl, name);
    setCustomerPersonName(name);
    setPersonSignatures([
      ...personSignatures,
      { signatureDataUrl, name, date: formattedDate },
    ]);
  };
  const handleDeleteSignature = (name) => {
    setPersonSignatures((prevSignatures) =>
      prevSignatures.filter((el) => el.name !== name)
    );
  };

  const handleSaveSignatureone = (signatureDataUrl, name) => {
    setSignatureImageone(signatureDataUrl, name);
    setApproverName(name);
  };

  const handleSaveSignaturetwo = async (signatureDataUrl) => {
    const uploadedSignURL = await handleUpload(signatureDataUrl);
    setAddData({ ...addData, signature: uploadedSignURL });
  };

  const closeModal = () => {
    setModalOpen(false);
    setPersonModalOpen(false);
  };

  const closeModalone = () => {
    setModalOpenone(false);
  };

  const handleAddPersonSignature = () => {
    setPersonModalOpen(true);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const signature = {
        customer: { name: customerName, signature: signatureImage },
        approver: { name: approverName, signature: signatureImageone },
        person: personSignatures?.length > 0 ? personSignatures : undefined,
      };
      if (!signature.person) {
        toast.error(t("atLeastOnePersonSignatureIsRequired"));
        setIsLoading(false);
        return;
      }
      const payload = {
        ...data,
        signature,
        responsibleWorkers: addSignatureData,
        userId: projectDetail?.userId,
        projectNumber: projectDetail?.projectNumber,
        projectId,
        scaffoldData: scaffoldData,
        notificationToAdminEdit: roleOfUser === 0 ? false : true,
      };
      const response = await updateSafeJobAnalysis(safeJobAnalysisId, payload);
      if (response?.status === "success") {
        toast.success(t("safeJobAnalysisCreatedSuccessfully"));
        navigate(`/safe-job-analysis-listing/${projectId}`);
      } else {
        toast.error(t("failedToCreateSafeJobAnalysis"));
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

  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (base64Image) => {
    setLoading(true);
    try {
      const file = base64Image;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "cyby2hpr");
      const folderName = "signature";
      const publicId = `users/${projectDetail?.userId}/${folderName}/${addData.name || `${projectDetail?.userId}_signature`
        }`;
      formData.append("public_id", publicId);
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/ddrvpin2u/image/upload",
        formData
      );
      setImage(response.data.url);
      return response?.data?.url;
    } catch (error) {
      setError(t("errorUploadingImagePleaseTryAgain"));
    } finally {
      setLoading(false);
    }
  };
  const handleSubtask = (e) => {
    setSelectedSubTask(e.target.value);
  };
  const handleRisk = (index, event, isRiskLevel) => {
    const newData = [...data];

    if (isRiskLevel) {
      newData[index].riskLevel = event.target.value;
    } else {
      newData[index].risk = event.target.value;
      setData(newData);
    }
  };

  const handleMeasure = (index, event) => {
    const newData = [...data];
    newData[index].measure = event.target.value;
    setData(newData);
  };
  const handleAddDiv = () => {
    setDivCount(divCount + 1);
    setData([...data, { risk: "", measure: "" }]);
  };
  const condition = data.every(
    (item) => item.risk !== "" && item.measure !== ""
  );
  const handleSave = () => {
    if (condition) {
      const newData = {
        id: scaffoldData?.length + 1,
        subtask: selectedSubTask,
        subtaskData: data,
      };

      setScaffoldData([...scaffoldData, newData]);
      setSelectedMeasure("");
      setSelectedSubTask("");
      setSelectedRisk("");
      setData([{ risk: "", measure: "" }]);
    } else {
      toast.error("Fill risk and measure");
      setData([{ risk: "", measure: "" }]);
    }
  };
  const handleDelete = (id) => {
    const updatedFormData = [...scaffoldData];
    const filteredData = updatedFormData?.filter((ele, ind) => ind !== id);
    setScaffoldData(filteredData);
  };

  const [addSubtak, setSubTask] = useState(false);
  const handelAdd = () => {
    setSubTask(!addSubtak);
    setDivCount(1);
  };
  const [editProject, setEditProject] = useState(true);
  const [editSignature, setEditSignature] = useState(true);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <div>
      <Header />

      <PdfGenerator isSafeJobAnalysis={true}>
        <div className="md:pb-[50px] pb-6 border-b-[#cccccc] border-b mt-14 sm:mt-0">
          <div className="custom-container flex flex-col md:flex-row gap-[20px] justify-between items-center">
            <p className="title-text uppercase">{t("safeJobAnalysis")}</p>

          </div>
          <div className="custom-container flex flex-col md:flex-row gap-[20px] justify-between items-center !mt-[10px]">
            <div className="flex justify-between items-center gap-[1rem]  w-full">
              <div className="flex justify-center items-center gap-[1rem]">
                <div className="flex justify-between rounded-[5px] items-center gap-[30px] border border-[rgb(204, 204, 204)] px-[10px] py-[11px] bg-[white]">
                  <p className="project-number leading-0 uppercase">{t("projectName")}</p>
                  <p className="medium-title leading-0 uppercase">
                    {projectDetail?.projectName || "No data found"}
                  </p>
                </div>
              </div>
              <div className="flex justify-between rounded-[5px] items-center gap-[30px] border border-[rgb(204, 204, 204)] px-[10px] py-[11px] bg-[white]">
                <p className="project-number leading-0">{t("projectNumber")}</p>
                <p className="medium-title leading-0">
                  {projectDetail?.projectNumber || "No data found"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <>
            <div className="text-center mt-10 ">
              <div
                className="flex flex-col justify-center items-center  gap-[10px]"
                role="status"
              >
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                <h1 className="text-[20px] font-[700] text-[#0072BB]">
                  {t("loading ")}
                </h1>
              </div>
            </div>
          </>
        ) : (
          <>
            {getSafeJobAnalysisData ? (
              <>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="custom-container">
                    <div className="flex flex-col gap-[30px]">
                      <div className="flex gap-4 items-center md:py-[50px] sm:py-8 py-4">
                        <p className="medium-title">{t("safeJobAnalysis")}</p>
                        <button
                          onClick={(event) => {
                            event?.preventDefault();
                            setEditProject(!editProject);
                            handleKeyDown(event);
                          }}
                        >
                          <VscEdit
                            onClick={(event) => handleKeyDown(event)}
                            size={24}
                            color="#212121"
                          />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between sm:gap-8 gap-4 flex-wrap w-full">
                      <div className="w-full lg:w-[calc(50%-20px)] flex flex-col justify-between gap-[6px]">
                        <lable className="project-number w-full">
                          {/* {t("dateOfAnalysis")} */}
                          {t("safeJobAnalysisName")}
                          <span style={{ color: "red", fontSize: "1.5em" }}>
                            *
                          </span>
                        </lable>
                        <div className="">
                          <input
                            className="input-without-icon-1 h-[50px] fullWidth"
                            type="text"
                            placeholder={t("SafeJobAnalysisName")}
                            {...register("projectDetail.safeJobAnalysisName", {
                              required: true,
                            })}
                            onKeyDown={handleKeyDown}
                            disabled={editProject}
                          />
                          {errors?.projectDetail?.safeJobAnalysisName && (
                            <span style={styles} className="mt-2 block">
                              {
                                errors?.projectDetail?.safeJobAnalysisName
                                  ?.message
                              }
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full lg:w-[calc(50%-20px)] flex flex-col justify-between gap-[6px]">
                        <lable className="project-number w-full">
                          {t("dateOfAnalysis")}
                          <span style={{ color: "red", fontSize: "1.5em" }}>
                            *
                          </span>
                        </lable>
                        <div className="">
                          <input
                            className="input-without-icon-1 h-[50px] fullWidth"
                            type="date"
                            placeholder="Scaffold Identification/Number"
                            {...register("projectDetail.dateOfAnalysis", {
                              required: true,
                            })}
                            onKeyDown={handleKeyDown}
                            disabled={editProject}
                          />
                          {errors.projectDetail?.dateOfAnalysis && (
                            <span style={styles} className="mt-2 block">
                              {errors.projectDetail.dateOfAnalysis.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full lg:w-[calc(50%-20px)] flex flex-col gap-[6px]">
                        <lable className="project-number w-full">
                          {/* {t("dateOfAnalysis")} */}
                          {t("WorkDescription")}
                          <span style={{ color: "red", fontSize: "1.5em" }}>
                            *
                          </span>
                        </lable>
                        <div className="">
                          <textarea
                            className="w-full p-[20px] border rounded-[5px]"
                            type="text"
                            placeholder={t("WorkDescription")}
                            {...register("projectDetail.workDescription", {
                              required: true,
                            })}
                            disabled={editProject}
                          />
                          {errors?.projectDetail?.workDescription && (
                            <span style={styles} className="mt-2 block">
                              {errors?.projectDetail?.workDescription?.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full lg:w-[calc(50%-20px)] flex flex-col gap-[6px]">
                        <label className="project-number w-full flex items-center justify-between">
                          {t("responsibleWorkers")}
                          <span style={{ color: "red", fontSize: "1.5em" }}>
                            *
                          </span>
                          {personSignatures?.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (!editProject) handleAddPersonSignature();
                              }}
                              className="text-[#0072BB] project-number flex items-center justify-center gap-[10px] underline focus-visible:outline-0 border border-[#CCCCCC] p-[4px] px-[12px] rounded-[5px]"
                            >
                              <div
                                className={`border-[#0072BB] cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] flex justify-center items-center`}
                              >
                                <RiAddFill size={18} color={"#0072BB"} />
                              </div>
                              <div>{t("addPerson")}</div>
                            </button>
                          )}
                        </label>
                        <div className="w-full flex flex-col gap-[20px]">
                          {personSignatures?.length > 0 ? (
                            <div className=" w-[100%] rounded-[10px] border overflow-hidden">
                              {personSignatures.map((el, index) => {
                                return (
                                  <div className="flex justify-between py-[10px] px-[20px] sm:gap-4 gap-2 items-center w-full border-b">
                                    <p className="project-number !font-[600]">
                                      {el?.name}
                                    </p>
                                    <p className="project-number !font-[600]">
                                      {el?.date}
                                    </p>
                                    <div className="flex items-center sm:gap-5 gap-2">
                                      <img
                                        alt={el?.name}
                                        className="h-[30px]"
                                        src={el?.signatureDataUrl}
                                      />
                                      <button
                                        onClick={(event) => {
                                          event.preventDefault();
                                          if (!editProject)
                                            handleDeleteSignature(el.name, index);
                                        }}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="25"
                                          height="24"
                                          viewBox="0 0 25 24"
                                          fill="none"
                                        >
                                          <path
                                            d="M4.34545 4.3871L4.42864 4.29289C4.78912 3.93241 5.35635 3.90468 5.74864 4.2097L5.84285 4.29289L12.1357 10.585L18.4286 4.29289C18.8192 3.90237 19.4523 3.90237 19.8428 4.29289C20.2334 4.68342 20.2334 5.31658 19.8428 5.70711L13.5507 12L19.8428 18.2929C20.2033 18.6534 20.2311 19.2206 19.926 19.6129L19.8428 19.7071C19.4824 20.0676 18.9151 20.0953 18.5228 19.7903L18.4286 19.7071L12.1357 13.415L5.84285 19.7071C5.45232 20.0976 4.81916 20.0976 4.42864 19.7071C4.03811 19.3166 4.03811 18.6834 4.42864 18.2929L10.7207 12L4.42864 5.70711C4.06815 5.34662 4.04042 4.77939 4.34545 4.3871L4.42864 4.29289L4.34545 4.3871Z"
                                            fill="#212121"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="w-[100%] flex justify-between">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (!editProject) handleAddPersonSignature();
                                }}
                                className="text-[#0072BB] project-number min-h-[84px] flex flex-col items-center justify-center gap-[10px] underline focus-visible:outline-0 border border-[#CCCCCC] pl-[20px] w-full h-[50px] rounded-[5px]"
                              >
                                <div
                                  className={`border-[#0072BB] cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] flex justify-center items-center`}
                                >
                                  <RiAddFill size={18} color={"#0072BB"} />
                                </div>
                                <div>{t("addPerson")}</div>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="my-8">
                      <div className="mb-8 overflow-auto">
                        {scaffoldData?.length > 0 && (
                          <table
                            className="w-full rounded overflow-hidden"
                            style={{ borderCollapse: "collapse" }}
                          >
                            <thead className="border-b-2 border-b-[#CCCCCC]">
                              <tr>
                                <th className="sm:p-4 py-2 px-3 sm:text-base text-sm text-left">
                                  {t("Subtask")}
                                </th>
                                <th className="sm:p-4 py-2 px-3 sm:text-base text-sm text-left">
                                  {t("Risk")}
                                </th>
                                <th className="sm:p-4 py-2 px-3 sm:text-base text-sm text-left">
                                  {t("Measure")}
                                </th>
                                <th className="w-14 sm:p-4 py-2 px-3"></th>
                              </tr>
                            </thead>
                            <tbody className="border-b border-b-[#CCCCCC]">
                              {scaffoldData?.map((element, index) => (
                                <React.Fragment key={index}>
                                  <tr
                                    className={
                                      index % 2 === 0
                                        ? "border-t border-t-[#CCCCCC]"
                                        : "border-t border-t-[#CCCCCC]"
                                    }
                                  >
                                    <td className="sm:p-4 py-2 px-3 sm:text-base text-sm font-medium">
                                      {element.subtask}
                                    </td>
                                    <td className="sm:p-4 py-2 px-3">
                                      {element.subtaskData &&
                                        element.subtaskData.map((data, dataIndex) => (
                                          <ul
                                            className="flex flex-col gap-3"
                                            key={dataIndex}
                                          >
                                            <li className="sm:text-base text-sm font-medium flex gap-2">
                                              {data.risk} <span className="flex justify-center items-center gap-1 ">{data?.riskLevel === "low" ? "🟢" : data?.riskLevel === "medium" ? "🟡" : data?.riskLevel === "high" ? "🔴" : ""} </span>
                                            </li>
                                          </ul>
                                        ))}
                                    </td>
                                    <td className="sm:p-4 py-2 px-3">
                                      {element.subtaskData &&
                                        element.subtaskData.map((data, dataIndex) => (
                                          <ul
                                            className="flex flex-col gap-3"
                                            key={dataIndex}
                                          >
                                            <li className="sm:text-base text-sm font-medium">
                                              {data.measure}  <span>{data?.measureLevel === "low" ? "🟢" : data?.measureLevel === "medium" ? "🟡" : data?.riskLevel === "high" ? "🔴" : ""}</span>
                                            </li>
                                          </ul>
                                        ))}
                                    </td>
                                    <td className="sm:p-4 py-2 px-3 text-center">
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDelete(index);
                                        }}
                                        className="text-[#0072BB] w-4"
                                      >
                                        {/* <img className="w-full" src={CloseIcon} alt="edit_document" /> */}
                                        <BsTrash3 color="#FF4954" size={20} />
                                      </button>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        )}

                        {addSubtak && (
                          <div>
                            {[...Array(divCount)].map((_, index) => (
                              <div className="flex sm:flex-row flex-col justify-between items-center w-full  gap-5 mt-5" key={index}>
                                <div className="flex flex-col justify-start items-start  gap-3  w-full">
                                  <label className="project-number">
                                    Risk
                                  </label>
                                  <div className="flex justify-center items-center gap-5">
                                    <input
                                      type="text"
                                      className="w-32 p-2 border rounded-md shadow-md input-without-icon"
                                      value={data[index]?.risk}
                                      onChange={(event) => handleRisk(index, event)}
                                      placeholder={t("Risk")}
                                      onKeyDown={handleKeyDown}
                                    />
                                    <div className="relative inline-block w-64">
                                      <select
                                        onChange={(event) => handleRisk(index, event, true)}
                                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                      >
                                        <option value="">🌟 {t("riskLevel")}</option>
                                        <option value="low">🟢 Low</option>
                                        <option value="medium">🟡 Medium</option>
                                        <option value="high">🔴 High</option>
                                      </select>
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M14.348 7.852a.5.5 0 0 0-.697-.716L10 10.788 6.348 7.136a.5.5 0 1 0-.696.717l4 4a.5.5 0 0 0 .696 0l4-4z" /></svg>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                                <div className="flex flex-col justify-start items-start  gap-3  w-full">
                                  <label className="project-number">
                                    Measures
                                  </label>
                                  <div className="flex justify-center items-center gap-5">
                                    <input
                                      type="text"
                                      className="w-32 p-2 border rounded-md shadow-md input-without-icon"
                                      value={data[index]?.measure}
                                      onChange={(event) => handleMeasure(index, event)}
                                      placeholder={t("Measure")}
                                      onKeyDown={handleKeyDown}
                                    />
                                    <div className="relative inline-block w-64">
                                      <select
                                        onChange={(event) => handleMeasure(index, event, true)}
                                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                      >
                                        <option value="">🌟 {t("riskLevel")}</option>
                                        <option value="low">🟢 Low</option>
                                        <option value="medium">🟡 Medium</option>
                                        <option value="high">🔴 High</option>
                                      </select>
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M14.348 7.852a.5.5 0 0 0-.697-.716L10 10.788 6.348 7.136a.5.5 0 1 0-.696.717l4 4a.5.5 0 0 0 .696 0l4-4z" /></svg>
                                      </div>
                                    </div>

                                  </div>

                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {addSubtak && (
                          <>
                            <div>
                              <div className="w-[100%] flex justify-end gap-5 items-center mt-6">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleAddDiv();
                                  }}
                                  className="text-[#0072BB] project-number flex items-end gap-[10px] underline focus-visible:outline-0"
                                >
                                  <div
                                    className={`border-[#0072BB] cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] flex justify-center items-center`}
                                  >
                                    <RiAddFill size={18} color={"#0072BB"} />
                                  </div>
                                  <div>{t("AddMore")}</div>
                                </button>
                                <button
                                  className="button-text bg-[#0072BB] hover:bg-[#0073bbde] transition-all delay-100 text-[white] px-[20px] py-[10px] rounded-[5px]"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleSave();
                                    handelAdd();
                                  }}
                                >
                                  {t("Save")}
                                </button>
                              </div>
                            </div>
                          </>
                        )}

                      </div>

                      <lable classname="project-number w-full">
                        {t("AddTask")}
                      </lable>
                      <div className="flex gap-3 mt-3">
                        <input
                          type="text"
                          className="w-32 p-2 border rounded-md shadow-md input-without-icon"
                          value={selectedSubTask}
                          onChange={handleSubtask}
                          placeholder={t("Subtask")}
                          disabled={editProject}
                          onKeyDown={handleKeyDown}
                        />
                        <button
                          className={`button-text ${selectedSubTask?.length <= 0
                            ? `bg-[gray]`
                            : `bg-[#0072BB]`
                            }
                             ${selectedSubTask?.length <= 0
                              ? `hover:bg-[gray]`
                              : `hover:bg-[#0073bbde]`
                            } transition-all delay-100 text-[white] px-[20px] py-[10px] rounded-[5px]`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (!editProject) handelAdd();
                          }}
                          disabled={selectedSubTask?.length <= 0}
                        >
                          {t("Add")}
                        </button>
                      </div>
                    </div>

                    <div className="shadow-lg p-10 bg-gray-100">
                      <SafetyChecklist setItems={setItems} items={items} />
                    </div>

                    <div className="flex lg:flex-row flex-col justify-center items-start gap-10 shadow-lg p-10 bg-gray-100 mt-2">
                      <div className="w-1/2">
                        <RequiredPermitChecklist setRequiredPermit={setRequiredPermit} requiredPermit={requiredPermit} />
                      </div>

                      <div className="w-1/2">
                        <DesignatedWorkChecklist setDesignatedWorkArea={setDesignatedWorkArea} designatedWorkArea={designatedWorkArea} />
                      </div>
                    </div>

                    <div className="w-full lg:w-[calc(50%-20px)] flex flex-col gap-[6px] mt-10">
                      <lable className="project-number w-full">
                        {t("emergencyProcedure")}
                      </lable>
                      <div className="">
                        <textarea
                          className="w-full p-[20px] border rounded-[5px]"
                          type="text"
                          placeholder={t("emergencyProcedure")}
                          {...register("emergencyProcedure", {

                          })}

                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:gap-[30px] gap-4 sm:mt-[60px] mt-10">
                      <div className="flex gap-4">
                        <p className="medium-title">{t("signature")}</p>
                        <button
                          onClick={(event) => {
                            event?.preventDefault();
                            setEditSignature(!editSignature);
                          }}
                        >
                          <VscEdit size={24} color="#212121" />
                        </button>
                      </div>
                      <div className="flex flex-col lg:flex-row sm:gap-[50px] gap-6 justify-around items-center">
                        <div className="flex flex-col sm:gap-[20px] gap-3 w-full lg:w-[380px] items-center">
                          {signatureImage ? (
                            <>
                              <img
                                className="m-auto"
                                width={169}
                                src={signatureImage}
                                alt="Signature"
                              />
                              <p className="text-black  text-[cap] font-Montserrat font-bold text-base leading-7">
                                {_.startCase(_.toLower(customerName))}
                              </p>
                            </>
                          ) : (
                            ""
                          )}
                          {signatureImage ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (!editSignature) setSignatureImage(null);
                              }}
                            >
                              {t("clearSignature")}
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (!editSignature) handleAddSignature();
                              }}
                              className="sigbtn"
                            >
                              <img src="/addShape.svg" alt="sign-add" />
                              {t("AddSignature")}
                            </button>
                          )}
                          <div className="w-full border"></div>
                          <p>{t("customer’sSignature")}</p>
                        </div>
                        <div className="flex flex-col sm:gap-[20px] gap-3 w-full lg:w-[380px] items-center">
                          <div className="w-full flex gap-[20px] flex-col items-center">
                            {signatureImageone ? (
                              <>
                                <img
                                  className="m-auto"
                                  width={169}
                                  src={signatureImageone}
                                  alt="Signature"
                                />
                                <p className="text-black  text-[cap] font-Montserrat font-bold text-base leading-7">
                                  {_.startCase(_.toLower(approverName))}
                                </p>
                              </>
                            ) : (
                              ""
                            )}
                            {signatureImageone ? (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (!editSignature) setSignatureImageone(null);
                                }}
                              >
                                {t("clearSignature")}
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (!editSignature) handleAddSignatureone();
                                }}
                                className="sigbtn"
                              >
                                <img src="/addShape.svg" alt="sign-add" />
                                {t("AddSignature")}
                              </button>
                            )}
                          </div>
                          <div className="w-full border"></div>
                          <p> {t("TeamleaderSignature")}</p>
                        </div>
                      </div>
                      <SignatureModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        onSave={handleSaveSignature}
                      />

                      <SignaturePersonModal
                        isOpen={isPersonModalOpen}
                        onClose={closeModal}
                        onSave={handlePersonSaveSignature}
                      />
                      <SignatureModal
                        isOpen={isModalOpenone}
                        onClose={closeModalone}
                        onSave={handleSaveSignatureone}
                      />
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="flex justify-center items-center mt-[10px]">
                  <img src={no_data} alt="no data found" />
                </div>
              </>
            )}
          </>
        )}
      </PdfGenerator>
    </div>
  );
};

export default SafeJobAnalysisPdf;
