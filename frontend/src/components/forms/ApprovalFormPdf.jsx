import React, { useEffect, useState } from "react";
import { getApprovalFormByIdService } from "../../Services/approvalFormService";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../Header";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import _ from "lodash";
import CloseIcon from "../../Assets/iconclose.svg";
import { t } from "../../utils/translate";
import PdfGenerator from "../PdfGenerator";

const schema = yup.object().shape({
  scaffoldIdentificationNumber: yup
    .string()
    .required(t("scaffoldIdentification/NumberIsRequired")),
  date: yup.string().required(t("dateIsRequired")),
  location: yup.string().required(t("locationIsRequired")),
  scaffolderowner: yup.string(),
  inspectedBy: yup.string(),
  builtBy: yup.string(),
  userResponsible: yup.string(),
  scaffoldClass: yup.string(),
  totalWeightPerM2: yup.string().typeError(t("totalWeightPerM2MustBeNumber")),
  amountWallAnkers: yup.string().typeError(t("amountOfWallAnkersMustBeNumber")),
});

const styles = {
  color: "red",
};

let english = [
  {
    id: 1,
    documentList: "Scaffold Signage",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 2,
    documentList: "Dimensioning",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 3,
    documentList: "Load Bearing Structure",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 4,
    documentList: "Access and Safe Use",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 5,
    documentList: "Scaffold Decking",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 6,
    documentList: "Guardrails",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 7,
    documentList: "Splash/Guardrail",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 8,
    documentList: "Handrails",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 9,
    documentList: "Roof Safety",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 10,
    documentList: "Midrails",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 11,
    documentList: "Tarpaulin/Netting",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 12,
    documentList: "Toeboards",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 13,
    documentList: "Foundation",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 14,
    documentList: "Bracing",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 15,
    documentList: "Anchoring",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 16,
    documentList: "Anchoring Hardware",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
];
let norway = [
  {
    id: 1,
    documentList: "Stillas skilting",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 2,
    documentList: "Dimensjonering",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 3,
    documentList: "Bærende konstruksjon",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 4,
    documentList: "Tilgang og sikker bruk",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 5,
    documentList: "Stillasgulv",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 6,
    documentList: "Rekkverk",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 7,
    documentList: "Sprutbeskyttelse / rekkverk",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 8,
    documentList: "Håndrekkverk",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 9,
    documentList: "Tak sikkerhet",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 10,
    documentList: "Midtrekkverk",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 11,
    documentList: "Presenning / nett",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 12,
    documentList: "Tåbrett",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 13,
    documentList: "Fundament",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 14,
    documentList: "Forsterkning",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 15,
    documentList: "Forankring",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
  {
    id: 16,
    documentList: "Forankringsbeslag",
    documentFile: null,
    documentComment: null,
    inspection: null,
  },
];

const ApprovalFormPdf = (props) => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const [approvalForm, setApprovalForm] = useState([]);
  const approvalFormId = useParams().id;

  const {
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [editData, setEditData] = useState();
  const [scaffoldData, setScaffoldData] = useState([]);

  const [scaffoldName, setScaffoldName] = useState([]);
  const [classs, setClasss] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    getApprovalFormById();
  }, [approvalFormId]);

  async function getApprovalFormById() {
    try {
      const response = await getApprovalFormByIdService(approvalFormId);
      const data = response?.data?.data[0];
      const updatedVisual = data?.visual?.map((ele) => {
        const updatedImageUrl = convertToHttps(ele?.documentFile);
        return { ...ele, documentFile: updatedImageUrl };
      });
      const updatedData = { ...data, visual: updatedVisual };
      setVisual(updatedVisual);
      setEditData(updatedData);
      if (updatedData) {
        var originalDate = updatedData.date;
        var formattedDate =
          new Date(originalDate)?.toISOString()?.slice(0, 10) || "";
        updatedData.date = formattedDate;
      } else {
        var originalDate = "";
        var formattedDate = "";
      }
      setScaffoldData(updatedData?.sizeScaffold || []);
      setScaffoldName(updatedData?.scaffoldName || []);
      setApprovalForm(updatedData);
    } catch (error) {
      console.error("Error fetching approval form:", error);
      // Handle error here
      return error;
    } finally {
    }
  }

  useEffect(() => {
    reset({ ...editData });
  }, [editData]);

  const initialValues = {};
  Object.keys(schema.fields).forEach((key) => {
    initialValues[key] = true;
  });

  const getWeightForClass = (classs) => {
    switch (classs) {
      case "class1":
        setValue("totalWeightPerM2", "75 kg per m2");
        return "75 kg per m2";
      case "class2":
        setValue("totalWeightPerM2", "150 kg per m2");
        return "150 kg per m2";
      case "class3":
        setValue("totalWeightPerM2", "200 kg per m2");
        return "200 kg per m2";
      case "class4":
        setValue("totalWeightPerM2", "300 kg per m2");
        return "300 kg per m2";
      case "class5":
        setValue("totalWeightPerM2", "450 kg per m2");
        return "450 kg per m2";
      case "class6":
        setValue("totalWeightPerM2", "600 kg per m2");
        return "600 kg per m2";
      default:
        return "";
    }
  };

  function handleInput(event) {
    const inputField = event.target;
    const placeholder = inputField.nextElementSibling;

    if (inputField.value.trim() !== "") {
      placeholder.style.display = "none";
    } else {
      placeholder.style.display = "inline";
    }
  }

  function moveCursorToBeginning(event) {
    const inputField = event.target.previousElementSibling;
    inputField.focus();
    inputField.setSelectionRange(0, 0);
  }
  const placeholders = document.querySelectorAll(".placeholder");

  placeholders.forEach((placeholder) => {
    placeholder.addEventListener("click", moveCursorToBeginning);
  });

  const inputFields = document.querySelectorAll(".with-placeholder");
  inputFields.forEach((inputField) => {
    inputField.addEventListener("input", handleInput);
  });

  const [visual, setVisual] = useState(
    currentLanguage === "en" ? english : norway
  );

  useEffect(() => {
    setVisual(currentLanguage === "en" ? english : norway);
  }, [currentLanguage]);

  function convertToHttps(imageUrl) {
    if (typeof imageUrl === "string" && imageUrl.startsWith("http://")) {
      return imageUrl.replace("http://", "https://");
    }
    return imageUrl;
  }

  return (
    <>
      {
        <>
          <div>
            <Header />
            <p className="title-text !text-[20px] mt-10 flex justify-center items-center ">
              {"APPROVAL FORM PDF"}
            </p>
            <PdfGenerator>
              <form className="border p-10 mx-100 pb-20 pointer-events-none ">
                <div>
                  <div className=" pb-[50px] border-b-[#cccccc] border-b">
                    <div className="custom-container">
                      <div className="flex flex-col gap-[30px] mt-10">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4">
                            <p className="medium-title">
                              {t("projectDetails")}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center gap-[20px] flex-wrap w-full">
                          <div className="w-full lg:w-[calc(50%-10px)] border rounded-md  p-[10px]">
                            <div className="flex flex-wrap gap-2 mb-[10px]">
                              {scaffoldName?.length > 0 &&
                                scaffoldName?.map((element, index) => (
                                  <>
                                    <div className="p-2 rounded flex items-center gap-3 text-[12px] bg-[#0072BB1A]">
                                      <div className="input-without-icon">
                                        {element?.value} - ({element?.key})
                                      </div>
                                    </div>
                                  </>
                                ))}
                            </div>
                          </div>
                          <div className="w-full lg:w-[calc(50%-10px)]">
                            <input
                              className="input-without-icon with-placeholder"
                              type="text"
                              {...register("scaffoldIdentificationNumber", {
                                required: true,
                              })}
                            />
                            <span
                              className="placeholder"
                              style={
                                editData?.scaffoldIdentificationNumber
                                  ? { display: "none" }
                                  : {}
                              }
                            >
                              {t("scaffoldIdentification/Number")}
                            </span>
                          </div>
                          <div className="w-full lg:w-[calc(50%-10px)]">
                            <input
                              className="input-without-icon with-placeholder"
                              type="text"
                              {...register("location", { required: true })}
                            />
                            <span
                              className="placeholder"
                              style={
                                editData?.location ? { display: "none" } : {}
                              }
                            >
                              {t("specificLocation")}
                            </span>
                          </div>
                          <div className="w-full lg:w-[calc(50%-10px)]">
                            <input
                              className="input-without-icon with-placeholder"
                              type="date"
                              {...register("date", { required: true })}
                            />
                            <span
                              className="placeholder"
                              style={editData?.date ? { display: "none" } : {}}
                            ></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" pb-[50px] border-b-[#cccccc] border-b">
                    <div className="custom-container">
                      <div className="flex flex-col gap-[30px] mt-[60px]">
                        <div className="flex gap-4">
                          <p className="medium-title">
                            {t("generalInformation")}
                          </p>
                        </div>
                        <div className="flex justify-between items-center gap-[20px] flex-wrap w-full">
                          <div className="w-full lg:w-[calc(50%-10px)]">
                            <input
                              className="input-without-icon"
                              type="text"
                              placeholder={t("scaffolderOwner")}
                              {...register("scaffolderowner", {
                                required: true,
                              })}
                            />
                            {errors?.scaffolderowner && (
                              <span style={styles}>
                                {errors?.scaffolderowner?.message}
                              </span>
                            )}
                          </div>

                          <div className="w-full lg:w-[calc(50%-10px)]">
                            <input
                              className="input-without-icon"
                              type="text"
                              placeholder={t("inspectedBy")}
                              {...register("inspectedBy", { required: true })}
                            />
                            {errors?.inspectedBy && (
                              <span style={styles}>
                                {errors?.inspectedBy?.message}
                              </span>
                            )}
                          </div>

                          <div className="w-full lg:w-[calc(50%-10px)]">
                            <input
                              className="input-without-icon"
                              type="text"
                              placeholder={t("builtBy")}
                              {...register("builtBy", { required: true })}
                            />
                            {errors?.builtBy && (
                              <span style={styles}>
                                {errors?.builtBy?.message}
                              </span>
                            )}
                          </div>

                          <div className="w-full lg:w-[calc(50%-10px)]">
                            <input
                              className="input-without-icon"
                              type="text"
                              placeholder={t("userResponsible")}
                              {...register("userResponsible", {
                                required: true,
                              })}
                            />
                            {errors?.userResponsible && (
                              <span style={styles}>
                                {errors?.userResponsible?.message}
                              </span>
                            )}
                          </div>

                          <div className="w-full lg:w-[calc(50%-10px)]">
                            <select
                              {...register("scaffoldClass")}
                              onChange={(e) => setClasss(e.target.value)}
                              className="bg-white border border-gray-300  text-sm rounded-lg  block w-full p-[1rem] outline-none"
                            >
                              <option selected>
                                {t("selectScaffoldClass")}
                              </option>
                              <option value="class1">{t("Class1")}</option>
                              <option value="class2">{t("Class2")}</option>
                              <option value="class3">{t("Class3")}</option>
                              <option value="class4">{t("Class4")}</option>
                              <option value="class5">{t("Class5")}</option>
                              <option value="class6">{t("Class6")}</option>
                            </select>
                            {errors?.scaffoldClass && (
                              <span style={styles}>
                                {errors?.scaffoldClass?.message}
                              </span>
                            )}
                          </div>
                          <div className="w-full lg:w-[calc(50%-10px)]">
                            <input
                              className="input-without-icon"
                              type="text"
                              value={getWeightForClass(classs)}
                              placeholder={t("maximumWeightPerm2Inkilograms")}
                              {...register("totalWeightPerM2", {
                                required: true,
                              })}
                            />
                            {errors?.totalWeightPerM2 && (
                              <span style={styles}>
                                {errors?.totalWeightPerM2?.message}
                              </span>
                            )}
                          </div>
                          <div className="w-full lg:w-[calc(50%-10px)] sx={{ m: 1 }} ">
                            <div className="flex">
                              <input
                                className="input-without-icon "
                                type="text"
                                placeholder={t("WallAnchorsCapacity")}
                                {...register("wallAnchorsCapacity", {
                                  required: true,
                                })}
                                style={{ borderRadius: "5px 0px 0px 5px" }}
                              />
                              <div className="w-full lg:w-[calc(50%-10px)]">
                                <select
                                  {...register("AnchorCapacityUnit")}
                                  className="border border-gray-300  text-sm rounded-r-lg  block w-full h-[50px] p-[1rem] outline-none"
                                >
                                  <option selected>
                                    {t("AnchorCapacityUnit")}
                                  </option>
                                  <option value="KN">KN</option>
                                  <option value="KG">KG</option>
                                </select>
                                {errors?.AnchorCapacityUnit && (
                                  <span style={styles}>
                                    {errors?.AnchorCapacityUnit?.message}
                                  </span>
                                )}
                              </div>
                            </div>
                            {errors?.wallAnchorsCapacity && (
                              <span style={styles}>
                                {errors?.wallAnchorsCapacity?.message}
                              </span>
                            )}
                          </div>

                          <div className="w-full lg:w-[calc(50%-10px)]">
                            <input
                              className="input-without-icon"
                              type="text"
                              placeholder={t("amountOfWallAnkers")}
                              {...register("amountWallAnkers", {
                                required: true,
                              })}
                            />
                            {errors?.amountWallAnkers && (
                              <span style={styles}>
                                {errors?.amountWallAnkers?.message}
                              </span>
                            )}
                          </div>
                          <div className="w-full lg:w-[calc(50%-10px)] border rounded-md  p-[10px]">
                            <div className="flex flex-wrap gap-2 mb-[10px]">
                              {scaffoldData?.length > 0 &&
                                scaffoldData?.map((element, index) => (
                                  <>
                                    <div className="p-2 rounded flex items-center gap-3 text-[12px] bg-[#0072BB1A]">
                                      <div className="input-without-icon">
                                        {element?.value} - ({element?.key})
                                      </div>

                                      <button>
                                        <img
                                          className="text-[#0072BB]"
                                          src={CloseIcon}
                                          alt="edit_document"
                                        />
                                      </button>
                                    </div>
                                  </>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" pb-[50px] border-b-[#cccccc] border-b">
                    <div className="custom-container">
                      <div className="flex flex-col gap-[30px] mt-[60px]">
                        <div className="flex gap-4">
                          <p className="medium-title">
                            {t("visualInspection")}
                          </p>
                        </div>
                        <div className="flex justify-between items-center gap-x-[100px] flex-wrap w-full">
                          {visual.map((item, index) => (
                            <div className="block w-full lg:w-[calc(50%-50px)] sm:px-[20px] sm:py-3 py-2 justify-between items-start border mb-2 rounded-lg">
                              <div>
                                <div className="flex flex-col lg:flex-col justify-start items-start lg:items-start w-full gap-3">
                                  <div className="flex justify-between lg:justify-end lg:flex-row-reverse flex-row items-center w-full gap-[10px]">
                                    <p className="project-number">
                                      {item?.documentList}
                                    </p>
                                  </div>
                                  <div className="flex justify-center items-center gap-[20px] lg:gap-[64px]">
                                    <div className="flex sm:gap-5 gap-2">
                                      <input
                                        type="radio"
                                        name={`option-${index}`}
                                        value="yes"
                                        checked={
                                          item.inspection === "yes" || ""
                                        }
                                      />{" "}
                                      {t("Yes")}
                                    </div>
                                    <div className="flex sm:gap-5 gap-2">
                                      <input
                                        type="radio"
                                        name={`option-${index}`}
                                        value="no"
                                        checked={item.inspection === "no"}
                                      />{" "}
                                      {t("No")}
                                    </div>
                                    <div className="flex sm:gap-5 gap-2">
                                      <input
                                        type="radio"
                                        name={`option-${index}`}
                                        value="NA"
                                        checked={
                                          item.inspection !== "yes" &&
                                          item.inspection !== "no"
                                        }
                                      />{" "}
                                      N/A
                                    </div>
                                  </div>
                                </div>
                                {
                                  item?.documentFile && <div className="mt-5">
                                    <div>
                                      <a
                                        href={item?.documentFile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <img
                                          className={` ${item?.documentFile ? "h-[180px] w-[400px] object-cover object-center rounded-lg shadow-md" : ""
                                            } `}
                                          src={
                                            item?.documentFile
                                              ? item?.documentFile
                                              : null
                                          }
                                          alt=""
                                          loading=""
                                        />
                                      </a>
                                    </div>
                                    <p className="project-number !text-[14px] mt-2">
                                      Comment:{" "}
                                      {item?.documentComment
                                        ? item.documentComment
                                        : "No Comment"}
                                    </p>
                                  </div>
                                }


                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="custom-container">
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
                            className="w-full p-[20px] border rounded-[5px]"
                            name="demo1"
                            id="demo1"
                            rows="3"
                            placeholder={t("writeHere")}
                            {...register("followUp", { required: true })}
                          ></textarea>
                        </div>
                        <p className="w-full lg:w-[calc(50%-10px)] medium-title block lg:hidden">
                          {t("comments")}
                        </p>
                        <div className="w-full lg:w-[calc(50%-10px)]">
                          <textarea
                            className="w-full p-[20px] border rounded-[5px]"
                            name="demo1"
                            id="demo1"
                            rows="3"
                            placeholder={t("writeHere")}
                            {...register("comments", { required: true })}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-[30px] mt-[60px]">
                      <div className="flex gap-4">
                        <p className="medium-title">{t("signature")}</p>
                      </div>
                      <div className="flex flex-col lg:flex-row gap-[50px] justify-between items-center lg:pl-[100px]">
                        <div className="flex flex-col gap-[20px] w-full lg:w-[380px] items-center">
                          {approvalForm?.customerSignature ? (
                            <>
                              <img
                                className="m-auto"
                                width={169}
                                src={approvalForm?.customerSignature}
                                alt="Signature"
                              />
                              <p className="text-black  text-[cap] font-Montserrat font-bold text-base leading-7">
                                {_.startCase(
                                  _.toLower(
                                    approvalForm?.customerSignatureName ||
                                    editData?.customerSignatureName
                                  )
                                )}
                              </p>
                            </>
                          ) : (
                            ""
                          )}
                          <div className="w-full "></div>
                        </div>
                        <div className="flex flex-col gap-[20px] w-full lg:w-[380px] items-center">
                          <div className="w-full flex gap-[20px] flex-col items-center">
                            {approvalForm?.inspectorSignature ? (
                              <>
                                <img
                                  className="m-auto"
                                  width={169}
                                  src={approvalForm?.inspectorSignature}
                                  alt="Signature"
                                />
                                <p className="text-black  text-[cap] font-Montserrat font-bold text-base leading-7">
                                  {_.startCase(
                                    _.toLower(
                                      approvalForm?.inspectorSignatureName ||
                                      editData?.inspectorSignatureName
                                    )
                                  )}
                                </p>
                              </>
                            ) : (
                              <div className="flex flex-col cursor-pointer justify-center  gap-[20px] items-center">
                                <img src="/addShape.svg" alt="sign-add" />
                              </div>
                            )}
                          </div>
                          <div className="w-full "></div>
                          <p></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </PdfGenerator>
          </div>
        </>
      }
    </>
  );
};

export default ApprovalFormPdf;
