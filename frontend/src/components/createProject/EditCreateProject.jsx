import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { VscEdit, VscSend } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineCancel } from "react-icons/md";
import {
  editProjectService,
  getAllInvite,
  getProjectByIdService,
  getProjectName,
  projectInviteFilterService,
  projectInviteService,
  removeInviteService,
} from "../../Services/projectService";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import TopSection from "../../components/forms/TopSection";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ImageUpload from "../FileUpload";
import { t } from "../../utils/translate";
import { getApprovalFormByProjectId } from "../../Services/approvalFormService";
import { getSafeJobAnalysisByProjectId } from "../../Services/safeJobAnalysisService";
import { getObservationById } from "../../Services/observationService";
import { materialListWithProjectGetService } from "../../Services/materialListWithProjectService";
import Calendar from "./Bigcalendar";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Admin from "../../Assets/adminIcons.jpg";
import { getSubscriptionData } from "../../Services/subscriptionService";
import { FcInvite } from "react-icons/fc";
import { FcRemoveImage } from "react-icons/fc";
import { SetProjectAccessLevel } from "../../Redux/Slice/projectSlice";
import ScaffoldPricing from "./ScaffoldPricing";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Loader from "../loader";

const backgroundImageUrl = require("../../Assets/background_image.jpg");
const schema = yup.object().shape({
  projectName: yup.string().required(t("projectNameIsRequired")),
  company_name: yup.string(),
  company_organization_number: yup.string(),
  company_email: yup.string().email(t("pleaseEnterValidEmail")),
  company_phone_number: yup.string(),
  comapny_invoice_address: yup.string(),
  company_contact_person: yup.string(),
  project_contact_person: yup.string(),
  project_phone_number: yup.string(),
  project_email: yup.string().email(t("pleaseEnterValidEmail")),
  project_address: yup.string(),
  projectNumber: yup.lazy((val) => {
    if (val !== undefined && val !== null && val !== "") {
      return yup.string();
    } else {
      return yup.string().nullable();
    }
  }),
});

const styles = {
  color: "red",
};
const Form = () => {
  const dispatch = useDispatch();
  const [isInvite, setIsInvite] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isNameEdit, setIsNameEdit] = useState(false);
  const [email, setEmail] = useState("");
  const [can, setCan] = useState("1");
  const [emailError, setEmailError] = useState("");
  const [canError, setCanError] = useState("");
  const { isProjectCreated } = useSelector((store) => store.project);
  const { id: projectId } = useParams();
  const { loggedInUser } = useSelector((state) => state.auth);
  const [projectDetails, setProjectDetails] = useState();
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const { accessLevel: type } = useSelector((state) => state?.project);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendar, setCalendar] = useState(false);
  const [indicator, setIndicator] = useState(0);
  const [scaffoldStatus, setScaffoldStatus] = useState("inactive");
  const [eventsData, setEventsData] = useState([]);
  const [materialData, setMaterialData] = useState([]);
  const [editCompany, setEditComapny] = useState(true);
  const [scaffoldSize, setScaffoldSize] = useState([]);
  const [m2, setM2] = useState(0);
  const [m3, setM3] = useState(0);
  const [lm, setLm] = useState(0);
  const [hm, setHm] = useState(0);
  const [scaffoldingCount, setScaffoldingCount] = useState(0);
  const [sja, setSja] = useState(0);
  const [observationCount, setObservationCount] = useState(0);
  const [materialWeight, setMaterialWeight] = useState(0);
  const [scaffoldingItems, setScaffoldingItems] = useState(0);
  const [editNumber, setIsNumberEdit] = useState(false);
  const [sjaIsLoading, setSjaIsLoading] = useState(false);
  const [onservationIsLoading, setObservationIsLoading] = useState(false);
  const [scaffoldingWeightLoading, setScafoldingWeightCountLoading] =
    useState(false);
  const [editProject, setEditProject] = useState(true);
  const [isQuickInvitationSelected, setIsQuickInvitationSelected] =
    useState(false);
  const customerId = useSelector((state) => state?.auth?.loggedInUser?._id);
  const [userSubscriberData, setUserSubscriberData] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showAccessModel, setShowAccessModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEvent, setCurrentEvent] = useState("");
  const [projectUserId, setProjectUserId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState();
  const [selectedScaffoldBase, setSelectedScaffoldBase] =
    useState("Volume Based");

  const handleScaffoldSelectBase = (e) => {
    setSelectedScaffoldBase(e.target.value);
  };
  const scaffoldOptions = useSelector(
    (state) => state.scaffolds.scaffoldOptions
  );

  // const isAdminId = useSelector((state) => state?.admin?.loggedInAdmin?._id);
  const isAdminId = true;

  // const scaffoldOptions = {
  //   "Standard Scaffold": {
  //     pricePerM3: 10,
  //     pricePerM2: 8,
  //     pricePerLM: 3,
  //     pricePerHM: 2,
  //     hourlyRate: 20,
  //   },
  //   "Fasade Scaffold": {
  //     pricePerM3: 9,
  //     pricePerM2: 15,
  //     pricePerLM: 3,
  //     pricePerHM: 2,
  //     hourlyRate: 20,
  //   },
  //   "Hanging Scaffold": {
  //     pricePerM3: 15,
  //     pricePerM2: 12,
  //     pricePerLM: 8,
  //     pricePerHM: 8,
  //     hourlyRate: 20,
  //   },
  //   "Rolling Scaffold": {
  //     pricePerM3: 18,
  //     pricePerM2: 20,
  //     pricePerLM: 4,
  //     pricePerHM: 4,
  //     hourlyRate: 20,
  //   },
  //   "Support Scaffold": {
  //     pricePerM3: 40,
  //     pricePerM2: 40,
  //     pricePerLM: 10,
  //     pricePerHM: 10,
  //     hourlyRate: 20,
  //   },
  // };
  const [isSaved, setIsSaved] = useState(false);
  const [selectedScaffoldType, setSelectedScaffoldType] = useState("");
  const [selectedPriceDetailsUpdate, setSelectedPriceDetailsUpdate] =
    useState(scaffoldOptions);

  const handlePriceChange = (field, value) => {
    setSelectedPriceDetailsUpdate((prevPrices) => ({
      ...prevPrices,
      [selectedScaffoldType]: {
        ...prevPrices[selectedScaffoldType],
        [field]: parseFloat(value) || 0,
      },
    }));
    setIsSaved(false);
  };

  const handleSavePrices = () => {
    setIsSaved(true);
  };

  const handleScaffoldTypeChange = (type) => {
    setSelectedScaffoldType(type);
  };

  const selectedPriceDetails = scaffoldOptions[selectedScaffoldType] || null;

  const handleScaffoldSelectType = (event) => {
    const selectedType = event.target.value;
    setSelectedScaffoldType(selectedType);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getProjectDetailById(projectId);
    getApprovalFormByItsProjectId(projectId);
    getSaveJobAnalysis(projectId);
    getObservation(projectId);
    getMaterialListWithProjectWeight(projectId);
    getSubscriptionDataAndCount();
    fetchProjectName();
  }, []);

  useEffect(() => {
    calculateSums();
  }, [scaffoldSize]);

  useEffect(() => {
    calculateScaffoldingWeightAndItems(materialData);
  }, [materialData]);

  const calculateSums = () => {
    let scaffoldingCounts = 0;
    const totals = {
      m2: 0,
      m3: 0,
      lm: 0,
      hm: 0,
    };
    console.log("scaffoldSize", scaffoldSize);
    scaffoldSize
      ?.filter((scaffold) => scaffold.status === "active")
      ?.forEach((scaffoldGroup) => {
        scaffoldGroup?.scaffoldName?.forEach((scaffold) => {
          if (scaffold?.measurements?.m2?.length) {
            scaffold?.measurements?.m2?.forEach((measurement) => {
              const { length, width } = measurement;
              totals.m2 += parseFloat(length) * parseFloat(width);
            });
          }
          if (scaffold?.measurements?.m3?.length) {
            scaffold?.measurements?.m3?.forEach((measurement) => {
              const { length, width, height } = measurement;
              totals.m3 +=
                parseFloat(length) * parseFloat(width) * parseFloat(height);
            });
          }
          if (scaffold?.measurements?.lm?.length) {
            scaffold?.measurements?.lm?.forEach((measurement) => {
              const { length } = measurement;
              totals.lm += parseFloat(length);
            });
          }
          if (scaffold?.measurements?.hm?.length) {
            scaffold?.measurements?.hm?.forEach((measurement) => {
              const { height } = measurement;
              totals.hm += parseFloat(height);
            });
          }
        });
      });
    setM2(totals?.m2);
    setM3(totals?.m3);
    setLm(totals?.lm);
    setHm(totals?.hm);
    setScaffoldingCount(scaffoldingCounts);
  };

  const calculateScaffoldingWeightAndItems = (item) => {
    let scaffoldingSum = 0;
    let materialActiveItems = 0;
    item.forEach((ele) => {
      const { isDeleted } = ele;
      if (!isDeleted) {
        materialActiveItems += parseInt(ele?.materialList?.length, 10);
      }
    });

    item.forEach((ele) => {
      const { totalWeight, isDeleted } = ele;
      if (!isDeleted) {
        scaffoldingSum += parseInt(totalWeight, 10);
      }
    });
    setScaffoldingItems(materialActiveItems);
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const getApprovalFormByItsProjectId = async () => {
    try {
      const response = await getApprovalFormByProjectId(projectId);
      setScaffoldSize(response?.data?.data || []);
    } catch (error) {
      return error;
    }
  };

  const getSaveJobAnalysis = async () => {
    let sjaCount = 0;
    try {
      setSjaIsLoading(true);
      const checkProjectStatus = await getProjectByIdService(projectId);
      const projectStatus = checkProjectStatus?.data?.project?.status;
      if (projectStatus === "active") {
        const response = await getSafeJobAnalysisByProjectId(projectId);
        const sjaData = response?.data;

        sjaData?.forEach((ele) => {
          const { isDeleted } = ele;
          if (!isDeleted) {
            sjaCount++;
          }
        });
        setSja(sjaCount);
      }
    } catch (error) {
      return error;
    } finally {
      setSjaIsLoading(false);
    }
  };

  const getObservation = async (projectId) => {
    let observationCount = 0;
    try {
      setObservationIsLoading(true);
      const checkProjectStatus = await getProjectByIdService(projectId);
      const projectStatus = checkProjectStatus?.data?.project?.status;
      if (projectStatus === "active") {
        const response = await getObservationById(projectId);
        const observationData = response?.data;

        observationData?.forEach((ele) => {
          const { isDeleted } = ele;
          if (!isDeleted) {
            observationCount++;
          }
        });
        setObservationCount(observationCount);
      }
    } catch (error) {
      setObservationIsLoading(false);
      return error;
    } finally {
      setObservationIsLoading(false);
    }
  };

  function calculateTotalWeight(data) {
    return data
      .filter((item) => item.status === "latest")
      .reduce((totalWeight, item) => {
        const materialWeight = item.materialList?.reduce((sum, material) => {
          return sum + material.kg * material.quantity;
        }, 0);
        return (totalWeight + materialWeight).toFixed(2);
      }, 0);
  }

  const getMaterialListWithProjectWeight = async () => {
    try {
      setScafoldingWeightCountLoading(true);
      const checkProjectStatus = await getProjectByIdService(projectId);

      const projectStatus = checkProjectStatus?.data?.project?.status;
      if (projectStatus === "active") {
        const response = await materialListWithProjectGetService(projectId);
        const materialData = response?.data?.filter(
          (ele) => !ele?.isDeleted && ele?.status === "latest"
        );
        setMaterialData(materialData);
        setIndicator(checkProjectStatus?.data?.project?.transferWeight);
        const materialWeightCountDetail =
          checkProjectStatus?.data?.project?.material_list_weight_total;
        setMaterialWeight(calculateTotalWeight(materialData));
      }
    } catch (error) {
      setScafoldingWeightCountLoading(false);
      return error;
    } finally {
      setScafoldingWeightCountLoading(false);
    }
  };

  async function getProjectDetailById(id) {
    try {
      setLoading(true);
      const response = await getProjectByIdService(id);
      const projectData = response?.data?.project;
      dispatch(SetProjectAccessLevel(projectData?.accessLevel));
      setProjectUserId(projectData?.userId);
      setScaffoldStatus(projectData?.status);
      setValue("projectName", projectData?.projectName);
      setValue("company_name", projectData?.companyDetails?.company_name);
      setValue(
        "company_organization_number",
        projectData?.companyDetails?.company_organization_number
      );
      setValue("company_email", projectData?.companyDetails?.company_email);
      setValue(
        "comapny_invoice_address",
        projectData?.companyDetails?.comapny_invoice_address
      );
      setValue(
        "company_contact_person",
        projectData?.companyDetails?.company_contact_person
      );
      setValue(
        "company_phone_number",
        projectData?.companyDetails?.company_phone_number
      );
      setValue("company_address", projectData?.companyDetails?.company_address);
      setValue(
        "other_project_details",
        projectData?.projectDetails?.other_project_details
      );
      setValue(
        "other_company_details",
        projectData?.companyDetails?.other_company_details
      );
      setValue(
        "project_contact_person",
        projectData?.projectDetails?.project_contact_person
      );
      setValue(
        "project_phone_number",
        projectData?.projectDetails?.project_phone_number
      );
      setValue("project_email", projectData?.projectDetails?.project_email);
      setValue("project_address", projectData?.projectDetails?.project_address);
      setValue("projectNumber", projectData?.projectNumber);
      setProjectDetails(projectData);
      setBackgroundImage(projectData?.projectBackgroundImage);
      setEventsData(response?.data?.project?.Calendar || []);
    } catch (error) {
      setLoading(false);
      return error;
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data) => {
    try {
      setButtonLoading(true);
      const payload = {
        projectName: data?.projectName,
        companyDetails: {
          company_name: data?.company_name,
          company_organization_number: data?.company_organization_number,
          company_phone_number: data?.company_phone_number,
          company_email: data?.company_email,
          comapny_invoice_address: data?.comapny_invoice_address,
          company_contact_person: data?.company_contact_person,
          other_company_details: data?.other_company_details,
        },
        projectDetails: {
          project_contact_person: data?.project_contact_person,
          project_phone_number: data?.project_phone_number,
          project_email: data?.project_email,
          project_address: data?.project_address,
          other_project_details: data?.other_project_details,
        },
        projectNumber: data?.projectNumber?.toUpperCase(),
        userId: projectUserId,
        Calendar: eventsData,
        projectBackgroundImage: backgroundImage || "",
        notificationToAdminEdit: roleOfUser === 0 ? false : true,
        status: scaffoldStatus,
      };

      const response = await editProjectService(payload, projectId);
      if (response?.data?.status === "success") {
        toast.success(t("projectUpdatedSuccessfully"));
        getProjectDetailById(projectId);
        setEditComapny(true);
        setEditProject(true);
        reset();
      }
    } catch (error) {
      toast.error(t("failedToUpdateProject"));
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };

  const inviteEmail = async (e) => {
    try {
      e.preventDefault();
      setEmailError("");
      setCanError("");
      setLoadingInvite(true);

      if (!email) {
        setEmailError(t("emailIsRequired"));
        return;
      } else if (!isValidEmail(email)) {
        setEmailError(t("invalidEmailFormat"));
        return;
      }
      if (can !== "0" && can !== "1" && can !== "2") {
        setCanError(t("pleaseSelectAPermissionLevel"));
        return;
      }
      const payload = {
        email: email,
        type: +can,
        projectNumber: watch("projectNumber"),
        projectId: projectId,
        userId: loggedInUser._id,
      };
      const response = await projectInviteService(payload);
      if (response.status === "success") {
        toast.success(t("projectInvitedSuccessfully"));
        setIsInvite(!isInvite);
        setEmail("");
      } else {
        toast.error(`${response?.message}`);
      }
    } catch (Error) {
      return Error;
    } finally {
      setLoadingInvite(false);
    }
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleImageUpload = (imgUrl, fileTagName) => {
    setBackgroundImage(imgUrl);
  };

  const handleDeleteDocument = () => {
    setBackgroundImage("");
  };

  let statusColorClass = "";

  if (projectDetails?.status === "active") {
    statusColorClass = "bg-green-500";
  } else if (projectDetails?.status === "inactive") {
    statusColorClass = "bg-red-500";
  } else if (projectDetails?.status === "completed") {
    statusColorClass = "bg-orange-500";
  }
  const { accessLevel: roleOfUser } = useSelector((state) => state?.project);
  const inviteProjectFilter = async () => {
    await projectInviteFilterService(projectId);
  };
  const filterProject = useSelector((state) => state?.project?.filterProject);
  useEffect(() => {
    inviteProjectFilter();
  }, []);
  const weightindicator = useSelector(
    (store) => store?.project?.scaffoldingWeight
  );
  const handleSelect = async ({ start, end }) => {
    const title = window.prompt("Add notes");
    if (title) {
      const newEventData = {
        start,
        end,
        title,
      };

      setEventsData([...eventsData, newEventData]);
    }
  };
  const handleEventClick = (event) => {
    const newTitle = window.prompt("Edit Event name", event.title);
    if (newTitle !== null) {
      const updatedEvents = eventsData?.map((ev) => {
        if (ev === event) {
          return { ...ev, title: newTitle };
        }
        return ev;
      });
      setEventsData(updatedEvents);
    }
  };
  const handelCalender = () => {
    setCalendar(!calendar);
  };

  const handleComapnyEdit = () => {
    setEditComapny(!editCompany);
  };

  const handleProjectEdit = () => {
    setEditProject(!editProject);
  };

  async function getSubscriptionDataAndCount() {
    const dataResponse = await getSubscriptionData(customerId);
    const userDataResponse = dataResponse?.data;
    const filterUserDataResponse = userDataResponse?.filter(
      (item) => !item?.isDeleted && item?.isInvitedUser
    );
    setUserSubscriberData(filterUserDataResponse);
  }

  const handleConfirmation = async (event, isConfirmation) => {
    event.preventDefault();
    try {
      if (isConfirmation) {
        if (currentEvent === "invite_subscriber") {
          const payload = {
            email: email,
            type: +can,
            projectNumber: watch("projectNumber"),
            projectId: projectId,
          };
          const response = await projectInviteService(payload);
          if (response.status === "success") {
            toast.success(t("projectInvitedSuccessfully"));
            setIsInvite(!isInvite);
            setEmail("");
          } else {
            toast.error(`${response?.message}`);
          }
          setShowConfirmationModal(false);
          return;
        }

        if (currentEvent === "remove_invite_subscriber") {
          const response = await removeInviteService({ email, projectId });
          if (response.status === "success") {
            toast.success(t("inviteRemovedSuccessfully"));
            setShowConfirmationModal(false);
            inviteProjectFilter();
            getSubscriptionDataAndCount();
            return;
          }
        }

        setShowConfirmationModal(false);
        setIsLoading(false);
      }
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error handling confirmation:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  async function CheckInvitedOrNot(email) {
    try {
      const inviteResponse = await getAllInvite();
      const isInvited = inviteResponse?.invite?.some(
        (item) => item?.email === email && item?.projectId?._id === projectId
      );
      if (isInvited) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return error.message;
    }
  }
  const fetchProjectName = async () => {
    let res = await getProjectName(projectId);
  };

  const activeScaffolds = scaffoldSize.filter(
    (item) => item.status === "active"
  );

  const scaffoldTotals = [];
  scaffoldSize.forEach((scaffoldGroup) => {
    scaffoldGroup?.scaffoldName?.forEach((scaffold) => {
      const scaffoldTotal = {
        m2: 0,
        m3: 0,
        lm: 0,
        hm: 0,
      };

      if (scaffold?.measurements?.m2?.length) {
        scaffold.measurements.m2.forEach((measurement) => {
          const { length, width } = measurement;
          scaffoldTotal.m2 += parseFloat(length) * parseFloat(width);
        });
      }

      if (scaffold?.measurements?.m3?.length) {
        scaffold.measurements.m3.forEach((measurement) => {
          const { length, width, height } = measurement;
          scaffoldTotal.m3 +=
            parseFloat(length) * parseFloat(width) * parseFloat(height);
        });
      }

      if (scaffold?.measurements?.lm?.length) {
        scaffold.measurements.lm.forEach((measurement) => {
          const { length } = measurement;
          scaffoldTotal.lm += parseFloat(length);
        });
      }

      if (scaffold?.measurements?.hm?.length) {
        scaffold.measurements.hm.forEach((measurement) => {
          const { height } = measurement;
          scaffoldTotal.hm += parseFloat(height);
        });
      }
      scaffoldTotals.push(scaffoldTotal);
    });
  });

  return (
    <>
      <Header />
      <TopSection
        title={t("createForm/EditForm")}
        breadcrumData={[t("editYourProject")]}
        keys={projectId}
      />

      {!loading ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="pb-[50px] border-b">
            <div className="custom-container">
              <p className="medium-title uppercase font-bold text-2xl ">
                Project
              </p>
              <div className="flex flex-col sm:flex-row gap-[30px] justify-between items-center  w-full">
                <div className="relative flex w-full">
                  {isNameEdit ? (
                    <>
                      <input
                        placeholder={t("enterProjectName")}
                        className="border border-gray-200 "
                        type="text"
                        value={watch("projectName")}
                        {...register("projectName", { required: true })}
                      />
                    </>
                  ) : (
                    <div className="w-full border-2 border-gray-200 py-3 p-2 rounded-md flex justify-center items-center gap-3">
                      <p className="project-number text-nowrap">
                        {t("projectName")}:
                      </p>
                      <p className=" !w-full border-gray-400 font-bold text-lg uppercase text-[#0081c8]">
                        {watch("projectName") || t("enterProjectName")}
                      </p>
                      {errors?.projectName && (
                        <span style={styles}>{errors.projectName.message}</span>
                      )}
                    </div>
                  )}
                  <div>
                    {type === 0 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setIsNameEdit(!isNameEdit);
                        }}
                      >
                        <VscEdit
                          size={18}
                          className={`text-${
                            isNameEdit ? "green-600" : "red-500"
                          } absolute right-2 top-4`}
                        />
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex gap-2 relative ">
                    <div
                      className={`flex  rounded-[5px] items-center gap-[10px] lg:gap-[30px] px-[10px] py-[10px] bg-[white] border-2 w-full ${
                        editNumber ? "border border-[#ccc]" : ""
                      }`}
                    >
                      <p className="project-number">{t("projectNumber")}</p>
                      {!editNumber && (
                        <p className="flex medium-title leading-0 outline-none text-[#0072BB] ">
                          {watch("projectNumber")
                            ? watch("projectNumber")
                            : t("enterProjectNumber")}
                        </p>
                      )}
                      {editNumber && (
                        <input
                          className="medium-title"
                          defaultValue={watch("projectNumber") || ""}
                          {...register("projectNumber", { required: false })}
                        />
                      )}
                    </div>
                    {type === 0 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setIsNumberEdit(!editNumber);
                        }}
                        className=""
                      >
                        <VscEdit
                          size={18}
                          className={`${
                            !editNumber ? "text-red-500" : "text-green-600"
                          } absolute right-10 top-4`}
                        />
                      </button>
                    )}
                  </div>
                  {errors?.projectNumber && (
                    <span style={styles}>{errors?.projectNumber?.message}</span>
                  )}
                </div>
              </div>

              <div className="flex sm:justify-between justify-start sm:flex-row flex-col  lg:gap-[40px]   rounded-[10px] gap-3 mt-6">
                <div className="flex justify-between items-center gap-4 max-w-[200px] ">
                  <label className="text-sm font-semibold text-nowrap">
                    Active
                  </label>
                  <input
                    disabled={type === 2 || type === 1}
                    onChange={() => setScaffoldStatus("active")}
                    type="radio"
                    name="radio-1"
                    className="radio  !border border-[#0072bb]  radio-success"
                    checked={scaffoldStatus === "active"}
                  />

                  <label className="text-sm font-semibold text-nowrap ">
                    In Active
                  </label>
                  <input
                    disabled={type === 2 || type === 1}
                    onChange={() => setScaffoldStatus("inactive")}
                    type="radio"
                    name="radio-1"
                    className="radio  !border border-[#0072bb] radio-error"
                    checked={scaffoldStatus === "inactive"}
                  />

                  <label className="text-sm font-semibold text-nowrap">
                    Completed
                  </label>
                  <input
                    disabled={type === 2 || type === 1}
                    onChange={() => setScaffoldStatus("completed")}
                    type="radio"
                    name="radio-1"
                    className="radio  !border border-[#0072bb] radio-warning"
                    checked={scaffoldStatus === "completed"}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex justify-center items-center gap-[1rem] bg-[#0072bb] font-[600] text-[#fff] sm:text-[16px] rounded-md text-nowrap">
                    {backgroundImage ? (
                      <ImageUpload
                        onImageUpload={handleImageUpload}
                        documentFile={"projectBackgroundImage"}
                        handleDeleteDocument={handleDeleteDocument}
                        status={true}
                        editedImage={backgroundImage}
                      />
                    ) : (
                      <ImageUpload
                        onImageUpload={handleImageUpload}
                        documentFile={"projectBackgroundImage"}
                        status={false}
                      />
                    )}
                  </div>
                  {errors?.projectBackgroundImage && (
                    <span style={styles}>
                      {errors?.projectBackgroundImage?.message}
                    </span>
                  )}
                  <div className="lg:relative">
                    {type !== 2 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setIsInvite(!isInvite);
                        }}
                        className={`px-[20px] py-[10px] rounded-[5px]  ${
                          roleOfUser === 0
                            ? "bg-[#0072BB] text-white"
                            : "bg-[gray] text-white cursor-not-allowed"
                        }  lg:mb-0 font-semibold`}
                        disabled={roleOfUser !== 0}
                      >
                        {t("invite")}
                      </button>
                    )}

                    <div
                      id="defaultModal"
                      tabIndex="-1"
                      aria-hidden="true"
                      style={{
                        backgroundImage: `url(${backgroundImageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                      className={`${
                        !isInvite && "hidden"
                      } fixed inset-0 flex justify-center items-center bg-gray-400 bg-opacity-90  z-40`}
                    >
                      <div className="relative min-w-[100px] px-2">
                        <div className="flex items-start justify-between border-b-[#CCCCCC] p-[22px] rounded-t-[10px] bg-[#0072BB]">
                          <p className="medium-title text-white leading-0">
                            {t("shareThisProject")}
                          </p>
                          <MdOutlineCancel
                            size={30}
                            color={"white"}
                            className="cursor-pointer "
                            onClick={() => setIsInvite(false)}
                          />
                        </div>

                        {loadingInvite ? (
                          <div className="text-center mt-16 bg-[white] ">
                            <div
                              className="flex flex-col justify-center items-center   gap-[10px]"
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
                                {t("sending")}
                              </h1>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="bg-white p-[30px] ">
                              <p className="project-number">
                                {t("shareThisProjectViaEmail")}
                              </p>
                              <div className="flex w-full border-[#CCCCCC] mt-[30px] gap-5 rounded-md">
                                <input
                                  name="email"
                                  type="text"
                                  className="popup-input"
                                  placeholder={t("writeEmailHere")}
                                  value={email || ""}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                  onClick={inviteEmail}
                                  type="submit"
                                  className="bg-[#0072BB] p-[15px] rounded-r-[10px]"
                                >
                                  <VscSend size={20} color="#FFFFFF" />
                                </button>
                              </div>
                              {emailError && (
                                <p className="text-[red] text-[14px] font-[400] ">
                                  {emailError}
                                </p>
                              )}
                              {!isProjectCreated ||
                                (!projectId && (
                                  <p className="text-[red] text-[14px] font-[400] ">
                                    Firstly Create the project then move forward
                                  </p>
                                ))}
                              {/* <div className="flex mt-[30px] gap-[30px] justify-end">
                                <div className="flex gap-[5px]">
                                  <input
                                    type="radio"
                                    name="permission"
                                    onChange={() => setCan("0")}
                                    checked={can === "0"}
                                  />
                                  <p> {t("Admin")}</p>
                                </div>
                                <div className="flex gap-[5px]">
                                  <input
                                    type="radio"
                                    name="permission"
                                    onChange={(e) => setCan("1")}
                                    checked={can === "1"}
                                  />
                                  <p>{t("User")}</p>
                                </div>
                                <div className="flex gap-[5px]">
                                  <input
                                    type="radio"
                                    name="permission"
                                    onChange={(e) => setCan("2")}
                                    checked={can === "2"}
                                  />
                                  <p>{t("Guest")}</p>
                                </div>
                              </div> */}

                              {canError && (
                                <p className="text-[red] text-[14px] font-[400] flex justify-end ">
                                  {canError}
                                </p>
                              )}
                            </div>
                          </>
                        )}

                        <div className=" border-t border-t-[#CCCCCC] rounded-b-[10px] bg-white  h-[40vh]  overflow-auto">
                          <div className="flex justify-around items-center border-b border-b-black pb-5 cursor-pointer">
                            <p
                              onClick={() =>
                                setIsQuickInvitationSelected(false)
                              }
                              className={`font-semibold text-sm mt-5 ml-5  uppercase  ${
                                isQuickInvitationSelected
                                  ? ""
                                  : "bg-gray-200 rounded-lg p-3"
                              }`}
                            >
                              {t("invited_person")}
                            </p>
                            <p
                              onClick={() => setIsQuickInvitationSelected(true)}
                              className={`font-semibold text-sm mt-5 ml-5  uppercase ${
                                isQuickInvitationSelected
                                  ? "bg-gray-200 rounded-lg p-3"
                                  : ""
                              }`}
                            >
                              {t("my_company")}
                            </p>
                          </div>

                          {isQuickInvitationSelected ? (
                            <div className="relative overflow-x-auto  sm:rounded-lg overflow-auto">
                              <table className="w-full text-sm text-left rtl:text-right ">
                                <thead className="text-xs  uppercase ">
                                  <tr>
                                    <th scope="col" className="px-6 py-3">
                                      {t("emil")}
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                      {t("quick_invite")}
                                    </th>{" "}
                                    <th scope="col" className="px-6 py-3">
                                      {t("remove_invite")}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {userSubscriberData?.length > 0 ? (
                                    userSubscriberData?.map((project) => (
                                      <>
                                        <tr className="bg-white border-b overflow-auto">
                                          <th className="flex items-center px-6 py-4  whitespace-nowrap ">
                                            <div className="flex justify-center items-center gap-3 ps-3">
                                              <div className="text-base font-semibold">
                                                {project?.type === 0 ? (
                                                  <img
                                                    src={Admin}
                                                    alt="admin"
                                                    className="w-10 h-10 rounded-full"
                                                  />
                                                ) : project?.type === 1 ? (
                                                  <img
                                                    src={
                                                      "https://res.cloudinary.com/ddrvpin2u/image/upload/v1713519226/salus_project/cw1vt2tos072kph5pcz5.jpg"
                                                    }
                                                    alt="user"
                                                    className="w-10 h-10 rounded-full"
                                                  />
                                                ) : (
                                                  <img
                                                    src={
                                                      "https://res.cloudinary.com/ddrvpin2u/image/upload/v1713519028/salus_project/u1vio21atnss7iksikkm.png"
                                                    }
                                                    alt="guest"
                                                    className="w-10 h-10 rounded-full"
                                                  />
                                                )}
                                              </div>
                                              <div className="font-normal text-gray-500">
                                                {" "}
                                                {project?.userEmail}
                                              </div>
                                            </div>
                                          </th>

                                          <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-3">
                                              <FcInvite
                                                onClick={() => {
                                                  setEmail(project?.userEmail);
                                                  setCurrentEvent(
                                                    "invite_subscriber"
                                                  );
                                                  setShowAccessModel(true);
                                                }}
                                                className={`text-3xl cursor-pointer`}
                                              />
                                            </div>
                                          </td>
                                          <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-3">
                                              {
                                                <FcRemoveImage
                                                  onClick={() => {
                                                    setEmail(
                                                      project?.userEmail
                                                    );
                                                    setCurrentEvent(
                                                      "remove_invite_subscriber"
                                                    );
                                                    setShowConfirmationModal(
                                                      true
                                                    );
                                                  }}
                                                  className={`text-3xl cursor-pointer`}
                                                />
                                              }
                                            </div>
                                          </td>
                                        </tr>
                                      </>
                                    ))
                                  ) : (
                                    <h1 className="font-bold text-lg flex justify-center items-center">
                                      {t("no_data_found")}
                                    </h1>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="relative overflow-x-auto  sm:rounded-lg overflow-auto ">
                              <table className="w-full text-sm text-left rtl:text-right ">
                                <thead className="text-xs  uppercase ">
                                  <tr>
                                    <th scope="col" className="px-6 py-3">
                                      {t("email")}
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                      {t("position")}
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                      {t("remove_invite")}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filterProject?.length > 0 &&
                                    filterProject?.map((project) => (
                                      <>
                                        <tr className="bg-white border-b overflow-auto">
                                          <th className="flex items-center px-6 py-4  whitespace-nowrap ">
                                            <div className="flex justify-center items-center gap-3 ps-3">
                                              <div className="text-base font-semibold">
                                                {project?.type === 0 ? (
                                                  <img
                                                    src={Admin}
                                                    alt="admin"
                                                    className="w-10 h-10 rounded-full"
                                                  />
                                                ) : project?.type === 1 ? (
                                                  <img
                                                    src={
                                                      "https://res.cloudinary.com/ddrvpin2u/image/upload/v1713519226/salus_project/cw1vt2tos072kph5pcz5.jpg"
                                                    }
                                                    alt="user"
                                                    className="w-10 h-10 rounded-full"
                                                  />
                                                ) : (
                                                  <img
                                                    src={
                                                      "https://res.cloudinary.com/ddrvpin2u/image/upload/v1713519028/salus_project/u1vio21atnss7iksikkm.png"
                                                    }
                                                    alt="guest"
                                                    className="w-10 h-10 rounded-full"
                                                  />
                                                )}
                                              </div>
                                              <div className="font-normal text-gray-500">
                                                {" "}
                                                {project?.email}
                                              </div>
                                            </div>
                                          </th>
                                          <td className="px-6 py-4">
                                            <p className="text-[16px] font-[500]">
                                              (
                                              {project?.type === 0
                                                ? "Admin"
                                                : project?.type === 1
                                                ? "User"
                                                : "Guest"}
                                              )
                                            </p>
                                          </td>
                                          <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-3">
                                              {
                                                <FcRemoveImage
                                                  onClick={() => {
                                                    setEmail(project?.email);
                                                    setCurrentEvent(
                                                      "remove_invite_subscriber"
                                                    );
                                                    setShowConfirmationModal(
                                                      true
                                                    );
                                                  }}
                                                  className={`text-3xl cursor-pointer`}
                                                />
                                              }
                                            </div>
                                          </td>
                                        </tr>
                                      </>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="custom-container">
              <div className="py-[50px]">
                <div className="pb-[60px]">
                  <div className="flex justify-between">
                    <div className="pb-[30px] flex gap-4 ">
                      <p className="medium-title">{t("companyDetails")}</p>
                      {type === 0 && (
                        <button
                          onClick={(event) => {
                            event?.preventDefault();
                            handleComapnyEdit();
                          }}
                        >
                          <VscEdit
                            size={24}
                            className={`${
                              editCompany ? "text-red-500" : "text-green-600 "
                            } `}
                          />
                        </button>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <button
                        className={`h-[40px] px-[20px] py-[8px] rounded-[5px] text-white text-base capitalize font-medium ${statusColorClass}`}
                        onClick={(event) => event?.preventDefault()}
                      >
                        {projectDetails?.status}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row justify-between flex-wrap items-center gap-3">
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        className="input-without-icon"
                        type="text"
                        {...register("company_name", { required: true })}
                        placeholder={t("companyName")}
                        disabled={editCompany}
                      />
                      {errors?.company_name && (
                        <span style={styles}>
                          {errors?.company_name?.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        className="input-without-icon"
                        type="text"
                        {...register("company_organization_number", {
                          required: true,
                        })}
                        placeholder={t("organizationNumber")}
                        disabled={editCompany}
                      />
                      {errors?.company_organization_number && (
                        <span style={styles}>
                          {errors?.company_organization_number?.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        className="input-without-icon"
                        type="text"
                        {...register("comapny_invoice_address", {
                          required: true,
                        })}
                        placeholder={t("invoiceAddress")}
                        disabled={editCompany}
                      />
                      {errors?.comapny_invoice_address && (
                        <span style={styles}>
                          {errors?.comapny_invoice_address?.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        className="input-without-icon"
                        type="text"
                        {...register("company_contact_person", {
                          required: true,
                        })}
                        disabled={editCompany}
                        placeholder={t("contactPerson")}
                      />
                      {errors?.company_contact_person && (
                        <span style={styles}>
                          {errors?.company_contact_person?.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        className="input-without-icon"
                        type="text"
                        {...register("company_email", { required: true })}
                        placeholder={t("emailId")}
                        disabled={editCompany}
                      />
                      {errors?.company_email && (
                        <span style={styles}>
                          {errors?.company_email?.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        className="input-without-icon"
                        type="text"
                        {...register("company_phone_number", {
                          required: true,
                        })}
                        placeholder={t("phoneNumber")}
                        disabled={editCompany}
                      />
                      {errors?.company_phone_number && (
                        <span style={styles}>
                          {errors?.company_phone_number?.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <textarea
                        className="w-full p-[20px] border rounded-[5px]"
                        name="demo1"
                        id="demo1"
                        placeholder={t("otherCompanyDetails")}
                        {...register("other_company_details", {
                          required: true,
                        })}
                        rows="3"
                        disabled={editCompany}
                      ></textarea>
                      {errors?.other_company_details && (
                        <span style={styles}>
                          {errors?.other_company_details?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pb-[60px]">
                  <div className="pb-[30px] flex gap-4">
                    <p className="medium-title">{t("projectDetails")}</p>
                    {type === 0 && (
                      <button
                        onClick={(event) => {
                          event?.preventDefault();
                          handleProjectEdit();
                        }}
                      >
                        <VscEdit
                          size={24}
                          className={`${
                            editProject ? "text-red-500" : "text-green-600"
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col lg:flex-row justify-between flex-wrap items-center gap-3">
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        className="input-without-icon"
                        type="text"
                        {...register("project_contact_person", {
                          required: true,
                        })}
                        placeholder={t("contactPerson")}
                        disabled={editProject}
                      />
                      {errors?.project_contact_person && (
                        <span style={styles}>
                          {errors?.project_contact_person?.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        className="input-without-icon"
                        type="text"
                        {...register("project_phone_number", {
                          required: true,
                        })}
                        placeholder={t("phoneNumber")}
                        disabled={editProject}
                      />
                      {errors?.project_phone_number && (
                        <span style={styles}>
                          {errors?.project_phone_number?.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        className="input-without-icon"
                        type="text"
                        {...register("project_email", { required: true })}
                        placeholder={t("emailId")}
                        disabled={editProject}
                      />
                      {errors?.project_email && (
                        <span style={styles}>
                          {errors?.project_email?.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <input
                        className="input-without-icon"
                        type="text"
                        {...register("project_address", { required: true })}
                        placeholder={t("address")}
                        disabled={editProject}
                      />
                      {errors?.project_address && (
                        <span style={styles}>
                          {errors?.project_address?.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                      <textarea
                        className="w-full p-[20px] border rounded-[5px]"
                        name="demo1"
                        id="demo1"
                        placeholder={t("otherProjectDetails")}
                        {...register("other_project_details", {
                          required: true,
                        })}
                        rows="3"
                        disabled={editProject}
                      ></textarea>
                      {errors?.other_project_details && (
                        <span style={styles}>
                          {errors?.other_project_details?.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)] flex justify-start items-start">
                      <button
                        disabled={type === 2}
                        onClick={(event) => {
                          event.preventDefault();
                          handelCalender();
                        }}
                        className="button-text bg-[#0072BB] px-[20px] py-[10px] rounded-[5px]  text-white "
                      >
                        {t("Calender")}
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    calendar &&
                    "border fixed inset-0 flex justify-center items-center bg-gray-400 bg-opacity-80 z-50  text-black p-10"
                  } `}
                >
                  <div>
                    {calendar && (
                      <MdOutlineCancel
                        size={30}
                        className="absolute md:top-[27%] md:right-[12%] top-[26%] lg:top-[12%] lg:right-[17%] right-[10%] sm:top-[26%] cursor-pointer hover:color-[red]"
                        onClick={() => setCalendar(false)}
                      />
                    )}
                  </div>
                  <div>
                    {calendar && (
                      <Calendar
                        handleSelect={editProject ? undefined : handleSelect}
                        eventsData={eventsData}
                        handleEventClick={
                          editProject ? undefined : handleEventClick
                        }
                        setSelectedEvent={setSelectedEvent}
                      />
                    )}
                  </div>
                </div>
                <div className="pb-[60px]">
                  <div className="pb-[30px]">
                    <p className="medium-title">{t("createForm")}</p>
                  </div>
                  <div className="flex items-center flex-wrap">
                    <div className="text-center w-full lg:w-[calc(33.33%)] py-[20px] border-b lg:border-r border-[#CCCCCC]">
                      <Link to={`/approval-listing-page/${projectId}`}>
                        <div className="flex justify-center mb-[20px]">
                          <img src="/approval_form.svg" alt="" />
                        </div>
                        <p>{t("scaffoldForm")}</p>
                      </Link>
                    </div>
                    <div className=" text-center w-full lg:w-[calc(33.33%)] py-[20px] border-b lg:border-r border-[#CCCCCC]">
                      {/* <Link to={`/observation/${projectId}`}> */}
                      <Link to={`/observation-listing/${projectId}`}>
                        <div className="flex justify-center mb-[20px]">
                          <img src="/after_control.svg" alt="" />
                        </div>
                      </Link>

                      <p>{t("observation")}</p>
                    </div>
                    <div className="text-center w-full lg:w-[calc(33.33%)] py-[20px] border-b border-[#CCCCCC]">
                      <Link to={`/material-listing-page/${projectId}`}>
                        <div className="flex justify-center mb-[20px]">
                          <img src="/material_list.svg" alt="" />
                        </div>
                        <p>{t("materialList")}</p>
                      </Link>
                    </div>
                    <div className="text-center w-full lg:w-[calc(33.33%)] py-[20px] border-b lg:border-b-0 lg:border-r border-[#CCCCCC]">
                      <Link to={`/files/${projectId}`}>
                        <div className="flex justify-center mb-[20px]">
                          <img src="/files.svg" alt="" />
                        </div>
                        <p>{t("files")}</p>
                      </Link>
                    </div>
                    <div className="text-center w-full lg:w-[calc(33.33%)] py-[20px] border-b lg:border-b-0 lg:border-r border-[#CCCCCC]">
                      <Link to={`/pictures/${projectId}`}>
                        <div className="flex justify-center mb-[20px]">
                          <img src="/pictures_1.svg" alt="" />
                        </div>
                      </Link>

                      <p>{t("pictures")}</p>
                    </div>
                    <div className="text-center w-full lg:w-[calc(33.33%)] py-[20px] ">
                      <Link to={`/safe-job-analysis-listing/${projectId}`}>
                        <div className="flex justify-center mb-[20px]">
                          <img src="/approval_form.svg" alt="" />
                        </div>
                      </Link>

                      <p>{t("safeJobAnalysis")}</p>
                    </div>
                  </div>
                </div>
                <div className="pb-[60px]">
                  <div className="pb-[30px]">
                    <p className="medium-title">{t("formDatas")}</p>
                  </div>

                  <div className="my-[30px]">
                    <div className="flex flex-col lg:flex-row w-full">
                      <div className="w-full lg:w-[20%] border-b lg:border-b-0 lg:border-r border-[#CCCCCC]">
                        <div className="flex justify-center items-center p-[20px]">
                          <div className="text-center">
                            <p className="medium-title pb-[20px] text-[#0072BB] h-[70px]">
                              {t("active-scaffolds")}
                            </p>
                            <p className="medium-title text-[#626262]">
                              {activeScaffolds ? (
                                activeScaffolds.length
                              ) : (
                                <Loader />
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-[20%] border-b lg:border-b-0 lg:border-r border-[#CCCCCC]">
                        <div className="flex justify-center items-center p-[20px]">
                          <div className="text-center">
                            <p className="medium-title pb-[20px] text-[#0072BB] h-[70px]">
                              {t("ScaffoldingItems")}
                            </p>
                            <p className="medium-title text-[#626262]">
                              {scaffoldingWeightLoading ? (
                                <Loader />
                              ) : (
                                scaffoldingItems
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-[20%] border-b lg:border-b-0 lg:border-r border-[#CCCCCC]">
                        <div className="flex justify-center items-center p-[20px]">
                          <div className="text-center">
                            <p className="medium-title pb-[20px] text-[#0072BB] h-[70px] whitespace-nowrap">
                              {t("ScaffoldingWeight")}
                            </p>
                            <p className="medium-title text-[#626262]">
                              {scaffoldingWeightLoading ? (
                                <Loader />
                              ) : (
                                <>
                                  <span>{materialWeight} Kgs</span>
                                  {indicator !== undefined &&
                                    indicator !== 0 && (
                                      <span
                                        className={
                                          indicator < 0
                                            ? "text-red-500 flex items-center justify-center gap-2"
                                            : "text-green-500 flex items-center justify-center gap-2"
                                        }
                                      >
                                        {indicator < 0 ? (
                                          <FaArrowDown />
                                        ) : (
                                          <FaArrowUp />
                                        )}{" "}
                                        {indicator} Kgs
                                      </span>
                                    )}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-[20%] border-b lg:border-b-0 lg:border-r border-[#CCCCCC]">
                        <div className="flex justify-center items-center p-[20px]">
                          <div className="text-center">
                            <p className="medium-title pb-[20px] text-[#0072BB] h-[70px]">
                              {t("Observations")}
                            </p>
                            <p className="medium-title text-[#626262]">
                              {onservationIsLoading ? (
                                <Loader />
                              ) : (
                                observationCount
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-[20%]">
                        <div className="flex justify-center items-center p-[20px]">
                          <div className="text-center">
                            <p className="medium-title pb-[20px] text-[#0072BB] h-[70px] ">
                              {t("workTask")}
                            </p>
                            <p className="medium-title text-[#626262]">
                              {sjaIsLoading ? <Loader /> : sja}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row w-full">
                      <div className="w-full lg:w-[20%] border-b border-t lg:border-b-0 lg:border-r border-[#CCCCCC]">
                        <div className="flex justify-center items-center p-[20px]">
                          <div className="text-center">
                            <p className="medium-title pb-[20px] text-[#0072BB] h-[70px]">
                              {t("square-meters")}
                            </p>
                            <p className="medium-title text-[#626262]">{m2}</p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-[20%] border-b border-t lg:border-b-0 lg:border-r border-[#CCCCCC]">
                        <div className="flex justify-center items-center p-[20px]">
                          <div className="text-center">
                            <p className="medium-title pb-[20px] text-[#0072BB] h-[70px]">
                              {t("cubic-meters")}
                            </p>
                            <p className="medium-title text-[#626262]">{m3}</p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-[20%] border-b border-t lg:border-b-0 lg:border-r border-[#CCCCCC]">
                        <div className="flex justify-center items-center p-[20px]">
                          <div className="text-center">
                            <p className="medium-title pb-[20px] text-[#0072BB] h-[70px]">
                              {t("length-meters")}
                            </p>
                            <p className="medium-title text-[#626262]">{lm}</p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-[20%] lg:border-r border-t border-[#CCCCCC]">
                        <div className="flex justify-center items-center p-[20px]">
                          <div className="text-center">
                            <p className="medium-title pb-[20px] text-[#0072BB] h-[70px]">
                              {t("height-meters")}
                            </p>
                            <p className="medium-title text-[#626262]">{hm}</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-[20%] border-t border-[#CCCCCC]">
                        <div className="flex justify-center items-center p-[20px]">
                          <div className="text-center bg-slate-300"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-[30px]">
                  {!buttonLoading ? (
                    roleOfUser !== 2 && (
                      <button
                        type="submit"
                        disabled={
                          editProject && editNumber && editCompany && isNameEdit
                            ? true
                            : false
                        }
                        className="button-text bg-[#0072BB] px-[20px] py-[10px] rounded-[5px] text-white"
                      >
                        {t("SAVEPROJECT")}
                      </button>
                    )
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
              </div>
            </div>
          </div>
          {showConfirmationModal && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80  z-40 ">
              <div className="bg-white rounded-lg p-5 w-[90%] sm:w-auto">
                <p className="font-semibold">{`Are you sure you wants to ${
                  currentEvent === "invite_subscriber"
                    ? "send quick project invite?"
                    : "remove invite?"
                }  `}</p>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                    onClick={(event) => {
                      handleConfirmation(event, true);
                    }}
                  >
                    {isLoading ? "Loading..." : "Confirm"}
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
                    onClick={(event) => handleConfirmation(event, false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {showAccessModel && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80  z-40 ">
              <div className="bg-white rounded-lg p-5 w-[90%] sm:w-auto">
                <p className="font-semibold">{t("access_model_title")}</p>
                {/* <div className="flex mt-[30px] gap-[30px] justify-end">
                    <div className="flex gap-[5px]">
                      <input
                        type="radio"
                        name="permission1"
                        onChange={() => setCan("0")}
                        checked={can === "0"}
                      />
                      <p> {t("Admin")}</p>
                    </div>
                    <div className="flex gap-[5px]">
                      <input
                        type="radio"
                        name="permission1"
                        onChange={(e) => setCan("1")}
                        checked={can === "1"}
                      />
                      <p>{t("User")}</p>
                    </div>
                    <div className="flex gap-[5px]">
                      <input
                        type="radio"
                        name="permission1"
                        onChange={(e) => setCan("2")}
                        checked={can === "2"}
                      />
                      <p>{t("Guest")}</p>
                    </div>
                  </div> */}
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                    onClick={(event) => {
                      setShowAccessModel(false);
                      setShowConfirmationModal(true);
                    }}
                  >
                    {isLoading ? t("loadingTxt") : t("confirmBtn")}
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
                    onClick={(event) => setShowAccessModel(false)}
                  >
                    {t("cancelBtn")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      ) : (
        <Loader />
      )}
      <Footer />
    </>
  );
};

export default Form;
