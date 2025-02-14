import React, { useEffect, useState } from "react";
import { LiaFileUploadSolid } from "react-icons/lia";
import { MdOutlineEditNote } from "react-icons/md";
import SignatureModal from "../SignatureModal";
import {
  approvalFormDownloadService,
  getApprovalFormByIdService,
} from "../../Services/approvalFormService";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import TopSection from "./TopSection";
import { toast } from "react-toastify";
import {
  afterControlFormUpdateService,
  getAfterControlFormDataById,
} from "../../Services/afterControlFormListingService";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import _ from "lodash";
import { t } from "../../utils/translate";
const schema = yup.object().shape({
  name: yup.string().required(t("nameIsRequired")),
  dateOfCheck: yup.string().required(t("dateIsRequired")),
});
const styles = {
  color: "red",
};

const EditAfterControlForm = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const [showInput, setShowInput] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [showComment, setShowComment] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [buttonText, setButtonText] = useState("Add Comment");
  const documentList = [
    "Scaffold Signage",
    "Dimensioning",
    "Load Bearing Structure",
    "Access and Safe Use",
    "Scaffold Decking",
    "Guardrails",
    "Splash/Guardrail",
    "Handrails",
    "Roof Safety",
    "Midrails",
    "Tarpaulin/Netting",
    "Toeboards",
    "Foundation",
    "Bracing",
    "Anchoring",
    "Anchoring Hardware",
  ];
  const documentFile = [
    "scaffoldSignageFile",
    "dimensioningFile",
    "loadBearingStructureFile",
    "accessAndSafeUseFile",
    "scaffoldDeckingFile",
    "guardrailsFile",
    "splashGuardrailFile",
    "handrailsFile",
    "roofSafetyFile",
    "midrailsFile",
    "tarpaulinNettingFile",
    "toeboardsFile",
    "foundationFile",
    "bracingFile",
    "anchoringFile",
    "anchoringHardwareFile",
  ];
  const documentComment = [
    "scaffoldSignageComment",
    "dimensioningComment",
    "loadBearingStructureComment",
    "accessAndSafeUseComment",
    "scaffoldDeckingComment",
    "guardrailsComment",
    "splashGuardrailComment",
    "handrailsComment",
    "roofSafetyComment",
    "midrailsComment",
    "tarpaulinNettingComment",
    "toeboardsComment",
    "foundationComment",
    "bracingComment",
    "anchoringComment",
    "anchoringHardwareComment",
  ];
  const [approvalForm, setApprovalForm] = useState([]);
  const [url, setUrl] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { approvalId, controlFormId } = useParams();

  const userId = useSelector((state) => state?.auth?.loggedInUser?._id);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenTwo, setModalOpenTwo] = useState(false);
  const [viewCustomerSignature, setViewCustomerSignature] = useState(null);
  const [viewInspectorSignature, setViewInspectorSignature] = useState(null);
  const [controlFormDetails, setControlFormDetails] = useState();
  const [reCheckResponsiblePerson, setReCheckResponsiblePerson] = useState("");
  const [recheckResponsibleSignature, setRecheckResponsibleSignature] =
    useState(null);
  const [userResponsiblePerson, setUserResponsiblePerson] = useState("");
  const [ResponsibleSignature, setUserResponsibleSignature] = useState(null);
  const [projectId, setProjectId] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [scaffoldDetails, setscaffoldDetails] = useState({
    scaffoldName: "",
    Date: "",
    scaffoldIdentificationNumber: "",
  });
  const [generalInformation, setGeneralInformation] = useState({
    scaffolderowner: "",
    inspectedBy: "",
    builtBy: "",
    userResponsible: "",
    identificationNumber: "",
    location: "",
    responsibleForScaffold: "",
    scaffoldClass: "",
    totalWeightPerM2: "",
    amountWallAnkers: "",
    wallAnchorsCapacity: "",
    sizeScaffold: "",
  });
  const [specificCondition, serSpecificCondition] = useState({
    followUp: "",
    comments: "",
  });
  const [visualInspection, setVisualInspection] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    getApprovalFormById();
    handleDownloadApprovalForm();
  }, []);

  const handleAddSignature = () => {
    setModalOpen(true);
  };

  const handleAddSignatureTwo = () => {
    setModalOpenTwo(true);
  };

  const handleRecheckResponsibleSignature = (signatureDataUrl, name) => {
    setRecheckResponsibleSignature(signatureDataUrl);
    setReCheckResponsiblePerson(name);
  };

  const handleUserResponsibleSignature = (signatureDataUrl, name) => {
    setUserResponsibleSignature(signatureDataUrl);
    setUserResponsiblePerson(name);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const closeModalTwo = () => {
    setModalOpenTwo(false);
  };

  const handleAddCommentClick = (index) => {
    const newArr = showComment.map((item, i) => {
      if (index === i) {
        return true;
      } else {
        return false;
      }
    });
    setShowComment(newArr);
  };

  const handleUploadClick = (index) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";

    const uploadButton = document.querySelectorAll("#uploadButton")[index];

    fileInput.addEventListener("change", (e) => {
      const selectedFile = e.target.files[0];
      setVisualInspection({
        ...visualInspection,
        [documentList[index]]: {
          ...visualInspection[[documentList[index]]],
          file: selectedFile,
        },
      });

      if (selectedFile) {
        uploadButton.innerText = truncateString(selectedFile.name, 15);
      }
    });

    fileInput.click();
  };

  function truncateString(inputString, wordCount) {
    if (typeof inputString !== "string") {
      inputString = "No Files";
    }

    if (inputString?.length <= wordCount) {
      return inputString;
    }
    const truncatedWords = inputString.slice(0, wordCount);
    if (/\.[a-zA-Z0-9]+$/.test(inputString)) {
      return `${truncatedWords}...`;
    }
    return truncatedWords + "...";
  }

  const handleAddComment = (event, index) => {
    setVisualInspection({
      ...visualInspection,
      [documentList[index]]: {
        ...visualInspection[[documentList[index]]],
        comment: event.target.value,
      },
    });
  };

  const handleDownloadApprovalForm = async () => {
    const response = await approvalFormDownloadService(approvalId);
    const fileName =
      response?.data?.data[response?.data?.data?.length - 1]?.approvalForm;
    const url = `${process.env.REACT_APP_BASE_URL}/upload/${userId}/approval-forms/${fileName}`;
    setUrl(url);
  };

  async function getApprovalFormById() {
    setLoading(true);
    const response = await getApprovalFormByIdService(approvalId);
    const getAfterControlForm = await getAfterControlFormDataById(
      controlFormId
    );
    setControlFormDetails(getAfterControlForm?.data);
    const data = response?.data?.data[0];
    if (data?.date) {
      var originalDate = response?.data?.data[0]?.date;
      var formattedDate =
        new Date(originalDate)?.toISOString()?.slice(0, 10) || "";
      setLoading(false);
    } else {
      var originalDate = "";
      var formattedDate = "";
      setLoading(true);
    }
    function convertISOToYMD(isoString) {
      return new Date(isoString)?.toISOString()?.slice(0, 10) || "";
    }

    setReCheckResponsiblePerson(
      getAfterControlForm?.data?.reCheckResponsiblePersonName
    );
    setUserResponsiblePerson(
      getAfterControlForm?.data?.userResponsibleSignatureName
    );
    setRecheckResponsibleSignature(
      getAfterControlForm?.data?.reCheckResponsiblePerson
    );
    setUserResponsibleSignature(
      getAfterControlForm?.data?.userResponsibleSignature
    );

    setControlFormDetails({
      ...getAfterControlForm?.data,
      dateOfCheck: convertISOToYMD(getAfterControlForm?.data?.dateOfCheck),
    });
    setProjectId(data?.projectId);
    setApprovalForm(response?.data?.data[0]);
    setscaffoldDetails({
      scaffoldName: data?.scaffoldName,
      Date: formattedDate,
      scaffoldIdentificationNumber: data?.scaffoldIdentificationNumber,
    });
    setGeneralInformation({
      scaffolderowner: data?.scaffolderowner,
      inspectedBy: data?.inspectedBy,
      builtBy: data?.builtBy,
      userResponsible: data?.userResponsible,
      location: data?.location,
      responsibleForScaffold: data?.responsibleForScaffold,
      scaffoldClass: data?.scaffoldClass,
      totalWeightPerM2: data?.totalWeightPerM2,
      amountWallAnkers: data?.amountWallAnkers,
      wallAnchorsCapacity: data?.wallAnchorsCapacity,
      sizeScaffold: data?.sizeScaffold,
    });

    serSpecificCondition({
      followUp: data?.followUp,
      comments: data?.comments,
    });
    setViewCustomerSignature(data?.customerSignature);
    setViewInspectorSignature(data?.inspectorSignature);

    const obj = {};
    const showInput = [];
    for (let i = 0; i < documentList?.length; i++) {
      obj[documentList[i]] = {
        file: data?.[documentFile[i]] ? data?.[documentFile[i]] : null,
        comment: data?.[documentComment[i]] ? data?.[documentComment[i]] : null,
      };
      if (data?.[documentFile[i]] || data?.[documentComment[i]]) {
        showInput.push(true);
      } else {
        showInput.push(false);
      }
    }
    setShowInput(showInput);
    setVisualInspection(obj);
  }
  useEffect(() => {
    reset({ ...controlFormDetails });
  }, [controlFormDetails]);
  const onSubmit = async (datas) => {
    try {
      setButtonLoading(true);
      if (recheckResponsibleSignature && ResponsibleSignature) {
        const formData = new FormData();
        const data = {
          ...datas,
          reCheckResponsiblePerson: recheckResponsibleSignature,
          userResponsibleSignature: ResponsibleSignature,
          reCheckResponsiblePersonName: reCheckResponsiblePerson,
          userResponsibleSignatureName: userResponsiblePerson,
          projectId,
          userId,
          approvalFormId: approvalId,
        };
        formData.append("name", data?.name);
        formData.append("comment", data?.comment);
        formData.append("dateOfCheck", data?.dateOfCheck);
        formData.append("projectId", data?.projectId);
        formData.append("userId", data?.userId);
        formData.append("approvalFormId", data.approvalFormId);
        formData.append(
          "reCheckResponsiblePerson",
          data?.reCheckResponsiblePerson
        );
        formData.append(
          "userResponsibleSignature",
          data?.userResponsibleSignature
        );
        formData.append(
          "reCheckResponsiblePersonName",
          data?.reCheckResponsiblePersonName
        );
        formData.append(
          "userResponsibleSignatureName",
          data?.userResponsibleSignatureName
        );

        const response = await afterControlFormUpdateService(
          data,
          controlFormId
        );
        if (response?.data?._id) {
          toast.success(t("controlFormCreatedSuccessfully"));
          navigate(`/after-control-listing-form/${projectId}`);
        } else {
          toast.error(t("errorInCreatingControlForm"));
        }
      } else {
        toast.error(t("signatureIsCompulsoryToProcess"));
      }
    } catch (err) {
      toast.error(t("anErrorOccurredWhileSubmittingTheForm"));
    } finally {
      setButtonLoading(false);
    }
  };
  return (
    <>
      <Header />
      <TopSection
        keys={projectId}
        title={t("afterControlForm")}
        breadcrumData={[t("home"), t("afterControlForm")]}
      />
      {loading ? (
        <>
          <div className="text-center ">
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
                {t("loading")}
              </h1>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className=" pb-[50px] border-b-[#cccccc] border-b">
            <div className="custom-container flex flex-col md:flex-row gap-[20px] justify-between items-center">
              <p className="title-text">{t("editAfterControlForm")}</p>
              <div className="relative">
                <div className="flex justify-between items-center">
                  <div className="flex justify-center items-center gap-[1rem]">
                    <div
                      className="flex justify-between rounded-[5px] items-center gap-[30px] px-[10px] py-[11px] bg-[white]"
                      style={{ border: "1px solid #ccc" }}
                    >
                      <p className="project-number leading-0">
                        {t("projectNumber")}
                      </p>
                      <p className="medium-title leading-0">
                        {controlFormDetails?.projectId?.projectNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="custom-container">
              <div>
                <div className="flex flex-col gap-[30px] mt-10">
                  <div className="flex justify-between items-center">
                    <p className="medium-title">{t("scaffoldDetail")}</p>
                    <div className="flex justify-center items-center gap-[1rem]"></div>
                  </div>
                  <div className="flex justify-between items-center gap-[20px] flex-wrap w-full">
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        disabled
                        className="input-without-icon"
                        type="text"
                        placeholder="Scaffold Name"
                        onChange={(e) =>
                          setscaffoldDetails({
                            ...scaffoldDetails,
                            scaffoldName: e.target.value,
                          })
                        }
                        value={scaffoldDetails?.scaffoldName}
                      />
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        disabled
                        className="input-without-icon"
                        type="text"
                        placeholder="Scaffold Identification/Number"
                        onChange={(e) =>
                          setscaffoldDetails({
                            ...scaffoldDetails,
                            scaffoldIdentificationNumber: e.target.value,
                          })
                        }
                        value={scaffoldDetails?.scaffoldIdentificationNumber}
                      />
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        disabled
                        className="input-without-icon"
                        type="text"
                        placeholder="Location"
                        onChange={(e) =>
                          setGeneralInformation({
                            ...generalInformation,
                            location: e.target.value,
                          })
                        }
                        value={generalInformation?.location}
                      />
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        disabled
                        className="input-without-icon"
                        type="date"
                        placeholder="Date of Inspection"
                        onChange={(e) =>
                          setscaffoldDetails({
                            ...scaffoldDetails,
                            Date: e.target.value,
                          })
                        }
                        value={scaffoldDetails?.Date}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-[30px] mt-[60px]">
                  <div className="flex justify-between items-center">
                    <p className="medium-title">{t("generalInformation")}</p>
                  </div>
                  <div className="flex justify-between items-center gap-[20px] flex-wrap w-full">
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        disabled
                        className="input-without-icon"
                        type="text"
                        placeholder={t("scaffolderOwner")}
                        onChange={(e) =>
                          setGeneralInformation({
                            ...generalInformation,
                            scaffolderowner: e.target.value,
                          })
                        }
                        value={generalInformation?.scaffolderowner}
                      />
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        disabled
                        className="input-without-icon"
                        type="text"
                        placeholder={t("inspectedBy")}
                        onChange={(e) =>
                          setGeneralInformation({
                            ...generalInformation,
                            inspectedBy: e.target.value,
                          })
                        }
                        value={generalInformation.inspectedBy}
                      />
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        disabled
                        className="input-without-icon"
                        type="text"
                        placeholder={t("builtBy")}
                        onChange={(e) =>
                          setGeneralInformation({
                            ...generalInformation,
                            builtBy: e.target.value,
                          })
                        }
                        value={generalInformation?.builtBy}
                      />
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        disabled
                        className="input-without-icon"
                        type="text"
                        placeholder={t("userResponsible")}
                        onChange={(e) =>
                          setGeneralInformation({
                            ...generalInformation,
                            userResponsible: e.target.value,
                          })
                        }
                        value={generalInformation?.userResponsible}
                      />
                    </div>

                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <select
                        disabled
                        value={generalInformation.scaffoldClass}
                        onChange={(e) =>
                          setGeneralInformation({
                            ...generalInformation,
                            scaffoldClass: e.target.value,
                          })
                        }
                        id=""
                        className="bg-white border border-gray-300  text-sm rounded-lg  block w-full p-[1rem] outline-none"
                      >
                        <option selected>{t("selectScaffoldClass")}</option>
                        <option value="class1">Class 1</option>
                        <option value="class2">Class 2</option>
                        <option value="class3">Class 3</option>
                        <option value="class4">Class 4</option>
                        <option value="class5">Class 5</option>
                        <option value="class6">Class 6</option>
                      </select>
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        disabled
                        className="input-without-icon"
                        type="text"
                        placeholder="Specify Total Weight per m2"
                        onChange={(e) =>
                          setGeneralInformation({
                            ...generalInformation,
                            totalWeightPerM2: e.target.value,
                          })
                        }
                        value={generalInformation.totalWeightPerM2}
                      />
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        disabled
                        className="input-without-icon"
                        type="text"
                        placeholder={t("amountOfWallAnkers")}
                        onChange={(e) =>
                          setGeneralInformation({
                            ...generalInformation,
                            amountWallAnkers: e.target.value,
                          })
                        }
                        value={generalInformation?.amountWallAnkers}
                      />
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        disabled
                        className="input-without-icon"
                        type="text"
                        placeholder={t("WallAnchorsCapacity")}
                        onChange={(e) =>
                          setGeneralInformation({
                            ...generalInformation,
                            wallAnchorsCapacity: e.target.value,
                          })
                        }
                        value={generalInformation?.wallAnchorsCapacity}
                      />
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        disabled
                        className="input-without-icon"
                        type="text"
                        placeholder={t("sizeOfTheScaffold")}
                        onChange={(e) =>
                          setGeneralInformation({
                            ...generalInformation,
                            sizeScaffold: e.target.value,
                          })
                        }
                        value={generalInformation?.sizeScaffold}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-[30px] mt-[60px]">
                  <div className="flex justify-between items-center">
                    <p className="medium-title">{t("visualInspection")}</p>
                  </div>
                  <div className="flex justify-between items-center gap-x-[100px] flex-wrap w-full">
                    {documentList.map((item, index) => (
                      <div
                        key={index}
                        className="block w-full lg:w-[calc(50%-50px)] px-[20px] py-[12px] justify-between items-start"
                      >
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full">
                          <div className="flex justify-between lg:justify-end lg:flex-row-reverse flex-row items-center w-full gap-[10px]">
                            <p className="project-number">{item}</p>
                          </div>
                          <div className="flex justify-center items-center gap-[20px] lg:gap-[64px]">
                            <div className="flex gap-[20px]">
                              <input
                                type="radio"
                                name={`option-${index}`}
                                disabled
                                checked={showInput[index]}
                                onClick={() =>
                                  setShowInput(
                                    showInput.map((ele, ind) => {
                                      if (ind === index) return true;
                                      else return ele;
                                    })
                                  )
                                }
                              />{" "}
                              Yes
                            </div>
                            <div className="flex gap-[20px]">
                              <input
                                type="radio"
                                name={`option-${index}`}
                                disabled
                                value="no"
                                onClick={() =>
                                  setShowInput(
                                    showInput.map((ele, ind) => {
                                      if (ind === index) {
                                        setVisualInspection({
                                          ...visualInspection,
                                          [documentList[index]]: {
                                            file: null,
                                            comment: null,
                                          },
                                        });
                                        return false;
                                      } else return ele;
                                    })
                                  )
                                }
                              />{" "}
                              No
                            </div>
                          </div>
                        </div>
                        <div
                          className={`flex flex-row mt-[10px] gap-[1rem] px-[10px] leading-[28px] text-[12px] font-[400] ${
                            showInput[index] ? "" : "hidden"
                          }`}
                        >
                          <div
                            onClick={() => {
                              handleUploadClick(index);
                            }}
                            className="flex flex-row gap-[10px] items-center border-[1px] border-[#CCCCCC] px-[10px] rounded-[5px]"
                          >
                            <LiaFileUploadSolid color="#000000" size={20} />
                            <button id="uploadButton">
                              {truncateString(
                                visualInspection[[documentList[index]]]?.file,
                                10
                              )}
                            </button>
                          </div>
                          <div className="flex flex-row gap-[10px] items-center border-[1px] border-[#CCCCCC] px-[10px] rounded-[5px]">
                            <MdOutlineEditNote color="#000000" size={20} />
                            <button
                              onClick={() => {
                                handleAddCommentClick(index);
                              }}
                            >
                              {buttonText}
                            </button>
                          </div>
                        </div>
                        {showInput[index] && (
                          <div
                            className={`flex flex-col mt-[10px] gap-[1rem] px-[10px] leading-[28px] text-[12px] font-[400] ${
                              showInput[index] ? "" : "hidden"
                            }`}
                          >
                            <label
                              htmlFor="message"
                              className="block mb-2 text-sm font-medium  dark:text-black"
                            >
                              {t("yourMessage")}
                            </label>
                            <textarea
                              id="message"
                              rows="4"
                              disabled
                              className="block p-2.5 w-full text-sm text-gray-90"
                              value={
                                visualInspection[[documentList[index]]]
                                  ?.comment || ""
                              }
                              onChange={(event) =>
                                handleAddComment(event, index)
                              }
                              placeholder="Write your thoughts here..."
                            ></textarea>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-[30px] mt-[60px]">
                  <div className="flex justify-between items-end">
                    <p className="w-full lg:w-[calc(50%-10px)] medium-title">
                      {t("areThereAnySpecific")}
                    </p>
                    <p className="w-full lg:w-[calc(50%-10px)] medium-title hidden lg:block">
                      {t("comments")}
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-[20px] flex-wrap w-full">
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <textarea
                        disabled
                        className="w-full p-[20px] border rounded-[5px]"
                        name="demo1"
                        id="demo1"
                        rows="3"
                        placeholder={t("writeHere")}
                        onChange={(e) =>
                          serSpecificCondition({
                            ...specificCondition,
                            followUp: e.target.value,
                          })
                        }
                        value={specificCondition.followUp}
                      ></textarea>
                    </div>
                    <p className="w-full lg:w-[calc(50%-10px)] medium-title block lg:hidden">
                      {t("comments")}
                    </p>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <textarea
                        disabled
                        className="w-full p-[20px] border rounded-[5px]"
                        name="demo1"
                        id="demo1"
                        rows="3"
                        placeholder={t("writeHere")}
                        onChange={(e) =>
                          serSpecificCondition({
                            ...specificCondition,
                            comments: e.target.value,
                          })
                        }
                        value={specificCondition.comments}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-[30px] mt-[60px]">
                  <div className="flex justify-between items-center">
                    <p className="medium-title">{t("signature")}</p>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-[50px] justify-between items-center lg:pl-[100px]">
                    <div className="flex flex-col gap-[20px] w-full lg:w-[380px] items-center">
                      {viewCustomerSignature && (
                        <>
                          <img
                            className="m-auto"
                            width={169}
                            src={viewCustomerSignature}
                            alt="Signature"
                          />
                          <p className="text-black  text-[cap] font-Montserrat font-bold text-base leading-7">
                            {_.startCase(
                              _.toLower(
                                controlFormDetails?.viewCustomerSignatureName
                              )
                            )}
                          </p>
                        </>
                      )}
                      <div className="w-full border"></div>
                      <p> {t("signatureOfTheCustomer")}</p>
                    </div>
                    <div className="flex flex-col gap-[20px] w-full lg:w-[380px] items-center">
                      <div className="w-full flex gap-[20px] flex-col items-center">
                        {viewInspectorSignature && (
                          <>
                            <img
                              className="m-auto"
                              width={169}
                              src={viewInspectorSignature}
                              alt="Signature"
                            />
                            <p className="text-black  text-[cap] font-Montserrat font-bold text-base leading-7">
                              {_.startCase(
                                _.toLower(
                                  controlFormDetails?.viewInspectorSignatureName
                                )
                              )}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="w-full border"></div>
                      <p>{t("signatureOfTheInspector")}</p>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-[30px] mt-[60px]">
                    <div className="flex justify-between items-center">
                      <p className="medium-title">{t("controlFormDetails")}</p>
                    </div>
                    <div className="lg:flex justify-between items-center gap-[20px]">
                      <div className="w-full lg:w-[calc(50%-10px)]">
                        <input
                          className="input-without-icon"
                          type="text"
                          placeholder="Name"
                          {...register("name", { required: true })}
                        />
                        {errors?.name && (
                          <span style={styles}>{errors?.name?.message}</span>
                        )}
                      </div>
                      <div className="w-full lg:w-[calc(50%-10px)]">
                        <input
                          className="input-without-icon"
                          type="date"
                          placeholder="Date of Inspection"
                          {...register("dateOfCheck", { required: true })}
                        />
                        {errors?.dateOfCheck && (
                          <span style={styles}>
                            {errors?.dateOfCheck?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <textarea
                        className="w-full p-[20px] border rounded-[5px]"
                        name="demo1"
                        id="demo1"
                        rows="3"
                        placeholder="Comment Write Here..."
                        {...register("comment", { required: true })}
                      ></textarea>
                      {errors?.comment && (
                        <span style={styles}>{errors?.comment?.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-[30px] mt-[60px]">
                    <div className="flex justify-between items-center">
                      <p className="medium-title">{t("signature")}</p>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-[50px] justify-between items-center lg:pl-[100px]">
                      <div className="flex flex-col gap-[20px] w-full lg:w-[380px] items-center">
                        {ResponsibleSignature ? (
                          <>
                            <img
                              className="m-auto"
                              width={169}
                              src={ResponsibleSignature}
                              alt="Signature"
                            />
                            <p className="text-black  text-[cap] font-Montserrat font-bold text-base leading-7">
                              {_.startCase(
                                _.toLower(
                                  userResponsiblePerson ||
                                    controlFormDetails?.reCheckResponsiblePerson
                                )
                              )}
                            </p>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setUserResponsibleSignature(null);
                              }}
                            >
                              {t("clearSignature")}
                            </button>
                          </>
                        ) : (
                          <div
                            className="flex flex-col cursor-pointer justify-center  gap-[20px] items-center"
                            onClick={(e) => {
                              e.preventDefault();
                              handleUserResponsibleSignature();
                              handleAddSignature();
                            }}
                          >
                            <img src="/addShape.svg" alt="sign-add" />
                            <button>{t("AddSignature")}</button>
                          </div>
                        )}
                        <div className="w-full border"></div>
                        <p>{t("recheckResponsibleSignature")}</p>
                      </div>
                      <div className="flex flex-col gap-[20px] w-full lg:w-[380px] items-center">
                        <div className="w-full flex gap-[20px] flex-col items-center">
                          {recheckResponsibleSignature ? (
                            <>
                              <img
                                className="m-auto"
                                width={169}
                                src={recheckResponsibleSignature}
                                alt="Signature"
                              />
                              <p className="text-black  text-[cap] font-Montserrat font-bold text-base leading-7">
                                {_.startCase(
                                  _.toLower(
                                    reCheckResponsiblePerson ||
                                      controlFormDetails?.userResponsibleSignature
                                  )
                                )}
                              </p>
                              <button
                                onClick={() =>
                                  setRecheckResponsibleSignature(null)
                                }
                              >
                                {t("clearSignature")}
                              </button>
                            </>
                          ) : (
                            <div
                              className="flex flex-col cursor-pointer justify-center  gap-[20px] items-center"
                              onClick={(e) => {
                                e.preventDefault();
                                handleRecheckResponsibleSignature();
                                handleAddSignatureTwo();
                              }}
                            >
                              <img src="/addShape.svg" alt="sign-add" />
                              <button>{t("AddSignature")}</button>
                            </div>
                          )}
                        </div>
                        <div className="w-full border"></div>
                        <p>{t("userResponsibleSignature")}</p>
                      </div>
                    </div>
                    <SignatureModal
                      isOpen={isModalOpen}
                      onClose={closeModal}
                      onSave={handleUserResponsibleSignature}
                    />
                    <SignatureModal
                      isOpen={isModalOpenTwo}
                      onClose={closeModalTwo}
                      onSave={handleRecheckResponsibleSignature}
                    />
                  </div>

                  <div className="flex justify-center gap-10 mt-[60px] mb-[5px]">
                    {!buttonLoading ? (
                      <button
                        type="submit"
                        className="button-text bg-[#0072BB] px-[20px] py-[10px] rounded-[5px] text-white"
                      >
                        {t("update")}
                      </button>
                    ) : (
                      <button
                        disabled
                        type="button"
                        className="text-white bg-[#0072BB] hover:bg-[#0072BB] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center"
                      >
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="inline w-4 h-4 mr-3 text-white animate-spin"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                          />
                        </svg>
                        {t("loading")}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
      <Footer />
    </>
  );
};

export default EditAfterControlForm;
