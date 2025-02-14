/* eslint-disable react-hooks/exhaustive-deps */
import React, { createRef, useEffect, useState } from "react";
import { RiAddFill } from "react-icons/ri";
import { BsDash } from "react-icons/bs";
import { IoAddCircleOutline, IoFilter } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { IoShareOutline } from "react-icons/io5";
import { IoBagAddOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";

import noDataIcon from "../../Assets/no_data_found.webp";
import { MultiSelect } from "react-multi-select-component";
import {
  getMaterialListSearch,
  getMaterialListWithUserId,
  materialListgetService,
} from "../../Services/materialListService";
import { useSelector } from "react-redux";
import { materialListWithProjectCreateService } from "../../Services/materialListWithProjectService";
import SignatureModal from "../SignatureModal";
import CustomList from "./CustomList";
import { toast } from "react-toastify";
import { store } from "../../Redux/store";
import {
  clearCreateMaterialList,
  clearSearchMaterialLits,
} from "../../Redux/Slice/materialListSlice";
import _ from "lodash";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoMdAddCircleOutline, IoMdClose } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProjectByIdService,
  projectgetService,
} from "../../Services/projectService";
import { t } from "../../utils/translate";
import { GoSearch } from "react-icons/go";
import axios from "axios";
import {
  createCustomList,
  deleteCustomListById,
  editCustomList,
  getAllCustomListData,
  getCustomListDataByProjectId,
  shareCustomList,
} from "../../Services/custonListService";
import { RiDeleteBin2Fill } from "react-icons/ri";

const schema = yup.object().shape({
  projectName: yup.string(),
  materialListName: yup.string().required(t("materialListNameIsRequired")),
  customerName: yup.string(),
  projectDate: yup.string().required(t("projectDateIsRequired")),
  comments: yup.string(),
});

const styles = {
  color: "red",
};
const left = {
  left: "128px",
};
const MainListing = () => {
  const { aluhak, alustar, layher, customList } = useSelector(
    (store) => store.materialList
  );
  const { current_language } = useSelector((store) => store.global);
  const auth = useSelector((store) => store.auth);
  const productList = [alustar, layher, aluhak];

  const [isModalOpen, setModalOpen] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const [isModalOpenTwo, setModalOpenTwo] = useState(false);
  const [signatureImageTwo, setSignatureImageTwo] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [deliveryName, setDeliveryName] = useState("");
  const [activeItem, setActiveItem] = useState("");
  const [activeProduct, setActiveProduct] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectNumber, setProjectNumber] = useState("");
  const [projectName, setProjectName] = useState("");
  const [createList, setCreateList] = useState([]);
  const [data, setData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [innerWidth, setInnerWidth] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  const [isCustomListModalOpen, setIsCustomListModalOpen] = useState(false);

  const ref = createRef();
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [isEditCustomList, setIsEditCustomList] = useState(false);
  const [customListDetail, setCustomListDetail] = useState({});
  const [customListData, setCustomListData] = useState([]);
  const [currentCustomId, setCurrentCustomId] = useState("");
  const [isCustomComponentOpen, setIsCustomComponentOpen] = useState(false);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCustomListItem, setCurrentCustomListItem] = useState({});

  const [responseCustomData, setResponseCustomData] = useState([]);
  const [isShareCustomList, setIsShareCustomList] = useState(false);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [customListShareData, setCustomListShareData] = useState({});
  const [currentCustomDeleteId, setCurrentCustomDeleteId] = useState("");
  const [operationOnCustomList, setOperationOnCustomList] = useState("");
  const [isCustomLoading, setIsCustomLoading] = useState(false);
  const [isShareLoading, setIsShareLoading] = useState(false);

  const { projectId } = useParams();
  const navigate = useNavigate();
  const userId = useSelector((state) => state?.auth?.loggedInUser?._id);
  const fetchData = async () => {
    await materialListgetService();
  };
  const handleAddSignature = () => {
    setModalOpen(true);
  };
  const { accessLevel: roleOfUser } = useSelector((state) => state?.project);

  const handleSaveSignature = (signatureDataUrl, name) => {
    setSignatureImage(signatureDataUrl);
    setCustomerName(name);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    fetchData();
    getProjectDetailById(projectId);
    setActiveItem("");
    setSearchTerm("");
    getAllCustomList();
    getCustomMaterialByProjectId();
    getAllProjectList();
  }, [current_language]);

  async function getCustomMaterialByProjectId() {
    const response = await getCustomListDataByProjectId(projectId);
    const listData = response?.data?.data || [];
    setCustomListData([...listData]);
  }

  useEffect(() => {
    setCreateList(
      customList
        ? customList
          ?.filter((item) => item.userId === auth?.loggedInUser?._id)
          ?.map((item) => ({ ...item, quantity: 0, category: "CustomList" }))
          ?.map((item, index) => ({ ...item, key: item._id || index }))
        : []
    );
  }, [customList]);

  const getAllProjectList = async () => {
    const response = await projectgetService();
    const projectData = response?.projects;
    const activeProjects = projectData?.filter(
      (ele) => ele.status === "active"
    );
    const manipulateDataAccordingToSelectTag = manipulateData(activeProjects);
    setOptions(manipulateDataAccordingToSelectTag);
  };

  const getAllCustomList = async () => {
    const response = await getAllCustomListData();
    const data = response?.data?.data;
    const customLists = data?.map((item) => item.customList).flat();
    setResponseCustomData((prevData) => [...customLists]);
  };

  const handleIncrement = (id, kg, data, category) => {
    const categoryEn = data?.sub_category_en;
    const categoryNw = data?.sub_category;
    const updatedItems = [...items];
    const itemIndex = updatedItems.findIndex((item) => item._id === id);

    if (itemIndex !== -1) {
      updatedItems[itemIndex].quantity++;
      updatedItems[itemIndex].kg = kg;
    } else {
      updatedItems.push({
        ...data,
        id,
        quantity: 1,
        kg,
        date: new Date().toLocaleDateString(),
        category:
          (current_language === "en" ? categoryEn : categoryNw) || "CustomList",
      });
    }

    setItems(updatedItems);
  };

  const handleDecrement = (id, kg, data) => {
    const updatedItems = [...items];
    const itemIndex = updatedItems.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
      if (updatedItems[itemIndex].quantity > 1) {
        updatedItems[itemIndex].quantity--;
        updatedItems[itemIndex].kg = kg;
      } else {
        updatedItems.splice(itemIndex, 1);
      }
      setItems(updatedItems);
    }
  };

  const handleCreate = (id, decrement, data) => {
    if (decrement) {
      handleDecrement(data?._id, data?.kg, data);
    } else {
      handleIncrement(data?._id, data?.kg, data);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    if ((data, projectName)) {
      setData({ ...data, projectName });
      toast.success(t("saveSuccessfully"));
    } else {
      toast.error(t("signatureIsCompulsoryToProceeds"));
    }
  };

  const handleAddSignatureTwo = () => {
    setModalOpenTwo(true);
  };

  const handleSaveSignatureTwo = (signatureDataUrl, name) => {
    setSignatureImageTwo(signatureDataUrl);
    setDeliveryName(name);
  };

  const closeModalTwo = () => {
    setModalOpenTwo(false);
  };

  const totalWeight = items?.reduce((total, item) => {
    const kg = parseFloat(item.kg);
    const quantity = parseInt(item.quantity);
    return total + (isNaN(kg) ? 0 : kg) * quantity;
  }, 0);
  let sum = 0;
  sum = sum + (totalWeight + 0);
  sum = sum.toFixed(2);

  let transferPermission;

  if (roleOfUser === 0) {
    transferPermission = true;
  } else if (roleOfUser === 1) {
    transferPermission = false;
  } else {
    transferPermission = false;
  }

  const update = async () => {
    try {
      setLoading(true);
      if (Object.keys(data).length) {
        const materialList = items.map((item, index) => ({
          ...item,
          key: item.id ?? index,
          materialId: item.id ?? item.materialId,
          quantity: item.quantity,
          kg: item.kg ?? 0,
        }));
        const notificationToAdminCreate = roleOfUser !== 0;
        const payload = {
          materialList,
          projectId,
          customerSignature: signatureImage,
          deliverySignature: signatureImageTwo,
          customerNameSignature: customerName,
          deliveryNameSignature: deliveryName,
          totalWeight: sum,
          transferMaterialListsPermisssion: transferPermission,
          notificationToAdminCreate,
          userId,
          ...data,
          customListData,
        };

        const response = await materialListWithProjectCreateService(payload);

        if (response?.data?.status === "success") {
          toast.success(t("updateSuccessfully"));
          reset();
          setData({});
          store.dispatch(clearCreateMaterialList());
          navigate(`/material-listing-page/${projectId}`);
        } else {
          toast.error(t("checkAboveInformation"));
        }
        setSignatureImage(null);
        setSignatureImageTwo(null);

        setItems([]);
      } else {
        toast.error(t("saveDataIsCompulsoryToProceeds"));
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  async function getProjectDetailById(id) {
    try {
      setLoading(true);
      const response = await getProjectByIdService(id);
      const projectNumber = response?.data?.project?.projectNumber;
      const projectName = response?.data?.project?.projectName;
      setProjectName(projectName);
      setProjectNumber(projectNumber);
    } catch (error) {
      setLoading(false);
      return error;
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e, id, item) => {
    const inputValue = e.target.value;
    const numericValue = parseInt(inputValue, 10);
    const updatedItems = [...items];
    const itemIndex = updatedItems.findIndex((i) => i.id === item?._id);
    const itemId = item?._id;
    const itemKg = item?.kg;
    const itemCategory =
      current_language === "en" ? item?.sub_category_en : item?.sub_category;
    if (itemIndex !== -1) {
      if (numericValue > -1) {
        updatedItems[itemIndex].quantity = numericValue;
        updatedItems[itemIndex].kg = item.kg;
      } else {
        updatedItems[itemIndex].quantity = 0;
        updatedItems[itemIndex].kg = item.kg;
      }
    } else {
      updatedItems.push({
        ...item,
        id: itemId,
        quantity: numericValue,
        kg: itemKg,
        date: new Date().toLocaleDateString(),
        category: itemCategory || "CustomList",
      });
    }
    setItems(updatedItems);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setActiveItem("");
  };

  const searchData = useSelector((store) => store?.materialList?.searchList);

  useEffect(() => {
    if (searchData.length > 0) {
      setSelectedSubCategory(searchData);
    }
  }, [searchData]);

  let debounceTimer;

  const delayedAPICall = (term) => {
    setLoading(true);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const res = await getMaterialListSearch(searchTerm);
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      delayedAPICall(searchTerm);
    } else {
      store.dispatch(clearSearchMaterialLits());
      setLoading(false);
    }
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchData?.length]);

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 36;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const CheckProductlist = productList.every(
    (element) => typeof element === "undefined"
  );

  const currentItems = !CheckProductlist
    ? activeProduct === 3
      ? []
      : Object.keys(productList[activeProduct]).slice(
        indexOfFirstItem,
        indexOfLastItem
      )
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleActiveItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item]);
    }

    if (activeItem === item) {
      setActiveItem("");
    } else {
      setActiveItem(item);
      const targetDiv = document.getElementById(item);
      if (targetDiv) {
        targetDiv.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    updatedMaterialCheckedValue();
  }, [selectedItems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeProduct]);

  useEffect(() => {
    handleWindowResize();
  }, []);

  function handleWindowResize() {
    const viewWidth = window.innerWidth;
    if (viewWidth <= 1350) {
      setInnerWidth(true);
    } else {
      setInnerWidth(false);
    }
  }
  window.addEventListener("resize", handleWindowResize);

  const updatedMaterialCheckedValue = () => {
    const latestData = selectedItems
      ?.map((ele) => productList[activeProduct][ele])
      ?.flat();
    setSelectedSubCategory([...latestData]);
  };

  const handleRemoveSubCategory = (ele) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((selectedItem) => selectedItem !== ele)
    );
  };

  const [currentPageSubCategory, setCurrentPageSubCategory] = useState(1);
  const itemsPerPageSubCategory = isSelectedAll ? 50 : 10;
  const indexOfLastItemSubCategory =
    currentPageSubCategory * itemsPerPageSubCategory;
  const indexOfFirstItemSubCategory =
    indexOfLastItemSubCategory - itemsPerPageSubCategory;
  const currentItemsSubCategory = selectedSubCategory?.slice(
    indexOfFirstItemSubCategory,
    indexOfLastItemSubCategory
  );

  if (currentItemsSubCategory) {
    currentItemsSubCategory.sort((a, b) => {
      const numericA = parseFloat(
        a.description.replace(",", ".").replace("m", "")
      );
      const numericB = parseFloat(
        b.description.replace(",", ".").replace("m", "")
      );
      return numericA - numericB;
    });
  }

  const paginateSubCategory = (pageNumber) =>
    setCurrentPageSubCategory(pageNumber);

  const handleSelectAllMaterial = (checked) => {
    if (checked) {
      const AllCheckedSubCategory = Object.keys(productList[activeProduct]);
      setIsSelectedAll((prevValue) => true);
      setSelectedItems((prevSelectedItems) => [...AllCheckedSubCategory]);
    } else {
      setIsSelectedAll((prevValue) => false);
      setSelectedItems([]);
    }
  };

  const handlePageChange = () => {
    const divId = `handle-page-scroll`;
    const element = document.getElementById(divId);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const [currentCustomListName, setCurrentCustomListName] = useState(null);
  const [currentCustomListIndex, setCurrentCustomListIndex] = useState(null);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cyby2hpr");
    const publicId = `users/${userId}/${file?.name}`;
    formData.append("public_id", publicId);

    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/ddrvpin2u/image/upload",
        formData
      );

      setImage(response.data.url);
    } catch (error) {
      setError("Error uploading image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    ref.current.click();
  };

  const handleSaveCustomDetails = async () => {
    if (!customListDetail?.customName) {
      toast.error("Please Enter Name");
      return;
    } else if (!customListDetail?.customDescription) {
      toast.error("Please Enter Description");
      return;
    }

    try {
      setIsCustomLoading(true);
      if (isEditCustomList) {
        const data = {
          ...customListDetail,
          customImage: image ? image : customListDetail.customImage,
        };
        setCustomListShareData(data);
        setCustomListData(
          customListData?.map((ele, i) => {
            if (i === currentCustomId) {
              return data;
            }
            return ele;
          })
        );

        setIsEditCustomList(false);
        setIsCustomListModalOpen(false);
        setImage(null);
        setError(null);
        setCustomListDetail({});
      } else {
        const data = {
          ...customListDetail,
          customImage: image,
          projectId: projectId,
          userId: userId,
        };

        console.log("elseData===>>", data);
        const createrResponse = await createCustomList(data);
        const getResponse = getCustomMaterialByProjectId();

        setCustomListShareData(data);
        setIsCustomListModalOpen(false);
        setImage(null);
        setError(null);
        setCustomListDetail({});
      }
    } catch (error) {
      console.error("Error saving custom details:", error);
      setError(error);
    } finally {
      setIsCustomLoading(false);
    }
  };

  const handleCustomDataEdit = (data, index) => {
    setCustomListDetail(data);
  };

  useEffect(() => {
    const customList = customListData[currentCustomListIndex]?.customList ?? [];
    setCreateList(customList);
  }, [customListData, currentCustomListIndex]);

  const handleCustomDataListDelete = async (item) => {
    try {
      setIsCustomLoading(true);
      customListData?.map(async (ele, i) => {
        if (i === currentCustomListIndex) {
          const updatedListData = {
            ...ele,
            customList: ele.customList.filter((ele) => ele !== item),
          };
          const response = await editCustomList(
            updatedListData,
            currentCustomDeleteId
          );
          if (response.status === "success") {
            getCustomMaterialByProjectId();
            toast.success("Custom List Deleted Successfully");
          }
        }
        return ele;
      });
    } catch (error) {
      setIsCustomLoading(false);
    }
  };

  const handleConfirmation = async (confirmation, type) => {
    try {
      setIsCustomLoading(true);

      if (type === "deleteCustomComponent") {
        if (confirmation) {
          await deleteCustomListById(currentCustomDeleteId);

          await getCustomMaterialByProjectId();
          toast.success("Custom List Deleted Successfully");
        }
        setShowConfirmationModal(false);
        setIsCustomLoading(false);
        return;
      }

      if (type === "deleteCustomList") {
        await handleCustomDataListDelete(currentCustomListItem);
      }

      setShowConfirmationModal(false);
      setIsCustomLoading(false);
    } catch (error) {
      console.error("Error occurred:", error);
      setIsCustomLoading(false);
      // Handle error or show error message
    }
  };

  const manipulateData = (data) => {
    return data?.map(({ _id, projectName: name }) => ({
      label: name,
      value: _id,
    }));
  };

  const handleShareList = async () => {
    try {
      setIsShareLoading(true);
      const extractId = selected?.map((ele) => ele.value);
      customListData[currentCustomListIndex].extractedProjectId = extractId;
      const finalShareData = customListData[currentCustomListIndex];

      const shareResponse = await shareCustomList(finalShareData);
      if (shareResponse.status === "success") {
        toast.success("Custom List Shared Successfully");
        setIsShareCustomList(false);
      } else {
        toast.error("Custom List Share Failed");
      }
    } catch (error) {
      setIsShareLoading(false);
    } finally {
      setIsShareLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="sm:pb-[50px] pb-6 border-b-[#cccccc] border-b">
          <div className="custom-container flex flex-col md:flex-row gap-[20px] justify-between items-center">
            <p className="title-text">{t("listOfMaterials")}</p>
            <div className="relative">
              <div
                className="flex justify-between rounded-[5px] items-center gap-[10px] lg:gap-[30px] px-[10px] py-[14px] bg-[white]"
                style={{ border: "1px solid #ccc" }}
              >
                <p className="project-number leading-0">{t("projectNumber")}</p>
                {!loading && !projectNumber ? (
                  <div
                    className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <input
                    className="medium-title leading-0 outline-none w-[125px]"
                    disabled
                    value={projectNumber || "No Number"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="py-[30px] lg:py-[100px] border-b border-b-[#CCCCCC]">
          <div className="custom-container">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-[30px] lg:gap-[70px] lg:mb-[78px] md:mb-8 mb-4">
              <div className="flex md:flex-row flex-col w-full lg:w-1/2 gap-2">
                <p className="flex justify-start items-center medium-title w-1/2 ">
                  {t("projectDetails")}
                </p>
                <div className="w-[100%]">
                  <input
                    className="input-without-icon"
                    type="text"
                    placeholder="Project ABC"
                    value={projectName || ""}
                    disabled
                    {...register("projectName")}
                  />
                  {errors.projectName && (
                    <span style={styles}>{errors.projectName.message}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-center gap-[30px] lg:gap-[70px] lg:mb-[78px] md:mb-8 mb-4">
              <div className="flex md:flex-row flex-col w-full lg:w-1/2 gap-2">
                <p className="flex justify-start items-center medium-title w-1/2">
                  {t("materialListName")}
                </p>

                <div className="w-[100%]">
                  <input
                    className="input-without-icon with-placeholder"
                    type="text"
                    {...register("materialListName")}
                  />
                  <span className="placeholder">{t("MaterialListName")}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-center md:gap-[30px] gap-4 lg:gap-[70px] md:mb-8 mb-4">
              <div className="flex md:flex-row flex-col w-full lg:w-1/2 gap-2">
                <p className="flex justify-start items-center medium-title w-1/2">
                  {t("CustomerContactPerson")}
                </p>
                <div className="w-[100%]">
                  <input
                    className="input-without-icon  "
                    type="text"
                    placeholder="Name"
                    {...register("customerName")}
                  />
                  {errors.customerName && (
                    <span style={styles}>{errors.customerName.message}</span>
                  )}
                </div>
              </div>

              <div className="flex w-full lg:w-[500px]  md:mt-[20px] mt-2 lg:mt-[0px] ">
                <div className="w-[100%]">
                  <input
                    className="input-without-icon w-[100px] with-placeholder"
                    type="date"
                    {...register("projectDate")}
                  />
                  <span className="placeholder" style={left}></span>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center md:gap-[30px] gap-4 lg:gap-[70px] lg:mb-[78px] ">
              <div className="flex justify-center items-center lg:w-1/2 w-full gap-[30px] lg:gap-[64px] "></div>

              <div className="lg:w-[500px] w-full">
                <textarea
                  className="w-full p-[20px] border rounded-[5px]"
                  name="demo1"
                  id="demo1"
                  rows="3"
                  placeholder={t("writeYour")}
                  {...register("comments")}
                ></textarea>
                {errors.comments && (
                  <span style={styles}>{errors.comments.message}</span>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-col md:gap-[30px] gap-4 md:mt-[60px] mt-7">
                <div className="flex flex-col  lg:flex-row lg:gap-[200px] md:gap-14 sm:gap-7 gap-4 justify-end  lg:pl-[px]">
                  <div className="flex flex-col sm:gap-[20px] gap-3 w-full lg:w-[380px] items-center">
                    {signatureImageTwo ? (
                      <>
                        <img
                          className="m-auto"
                          width={169}
                          src={signatureImageTwo}
                          alt="Signature"
                        />
                        <p className="text-black  text-[cap] font-Montserrat font-bold text-base leading-7">
                          {_.startCase(_.toLower(deliveryName))}
                        </p>
                        <button onClick={() => setSignatureImageTwo(null)}>
                          {t("clearSignature")}
                        </button>
                      </>
                    ) : (
                      <div
                        className="flex flex-col cursor-pointer justify-center  sm:gap-[20px] gap-3 items-center"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddSignatureTwo();
                        }}
                      >
                        <img src="/addShape.svg" alt="sign-add" />
                        <button>{t("AddSignature")}</button>
                      </div>
                    )}
                    <div className="w-full border"></div>
                    <p>{t("signatureDeliveryResponsible")}</p>
                  </div>
                  <div className="flex flex-col sm:gap-[20px] gap-3 w-full lg:w-[380px] items-center justify-end ">
                    <div className="w-full flex gap-[20px] flex-col items-center">
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
                          <button onClick={() => setSignatureImage(null)}>
                            {t("clearSignature")}
                          </button>
                        </>
                      ) : (
                        <div
                          className="flex flex-col cursor-pointer justify-center sm:gap-[20px] gap-3 items-center"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddSignature();
                          }}
                        >
                          <img src="/addShape.svg" alt="sign-add" />
                          <button>{t("AddSignature")}</button>
                        </div>
                      )}
                    </div>
                    <div className="w-full border"></div>
                    <p>{t("signatureOfTheCustomer")}</p>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <button
                    type="submit"
                    className="button-text bg-[#0072BB] px-[20px] py-[10px] rounded-[5px] text-white"
                  >
                    {t("save")}
                  </button>
                </div>

                <SignatureModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  onSave={handleSaveSignature}
                />
                <SignatureModal
                  isOpen={isModalOpenTwo}
                  onClose={closeModalTwo}
                  onSave={handleSaveSignatureTwo}
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="py-[30px] lg:py-[100px] border-b border-b-[#CCCCCC]">
        <div className="custom-container">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-[30px] lg:gap-[70px]">
            <div>
              <p className="medium-title">{t("selectScaffoldingSystem")}</p>
            </div>
            <div className="flex flex-wrap w-full gap-[20px] lg:gap-[40px]">
              <div
                onClick={() => {
                  setActiveProduct(0);
                  setActiveItem("");
                  handleSelectAllMaterial(false);
                  setIsSelectedAll(false);
                  setCurrentCustomListIndex(null);
                }}
                className={`w-[calc(50%-10px)] lg:w-[180px] py-[20px] cursor-pointer px-[20px] lg:px-[40px] ${activeProduct === 0
                    ? "border-[#0072BB26]"
                    : "border-[#CCCCCC]"
                  } ${activeProduct === 0 ? "bg-[#0072BB26] " : "border-[#CCCCCC]"
                  } border rounded-[10px] flex flex-col gap-[10px] lg:gap-[30px] text-center`}
              >
                <img
                  className="m-auto"
                  height={100}
                  width={100}
                  src="/alustar.png"
                  alt=""
                />
                <p
                  className={`medium-title ${activeProduct === 0 && "text-[#0072BB]"
                    }`}
                >
                  Alustar
                </p>
              </div>
              <div
                onClick={() => {
                  setActiveProduct(1);
                  setActiveItem("");
                  handleSelectAllMaterial(false);
                  setIsSelectedAll(false);
                  setCurrentCustomListIndex(null);
                }}
                className={`w-[calc(50%-10px)] lg:w-[180px] py-[20px] cursor-pointer px-[20px] lg:px-[40px] ${activeProduct === 1
                    ? "border-[#0072BB26]"
                    : "border-[#CCCCCC]"
                  } ${activeProduct === 1 ? "bg-[#0072BB26] " : "border-[#CCCCCC]"
                  } border rounded-[10px] flex flex-col gap-[10px] lg:gap-[30px] text-center`}
              >
                <img
                  className="m-auto"
                  height={100}
                  width={100}
                  src="/layher.png"
                  alt=""
                />
                <p
                  className={`medium-title ${activeProduct === 1 && "text-[#0072BB]"
                    }`}
                >
                  Layher
                </p>
              </div>
              <div
                onClick={() => {
                  setActiveProduct(2);
                  setActiveItem("");
                  handleSelectAllMaterial(false);
                  setIsSelectedAll(false);
                  setCurrentCustomListIndex(null);
                }}
                className={`w-[calc(50%-10px)] lg:w-[180px] py-[20px] cursor-pointer px-[20px] lg:px-[40px] ${activeProduct === 2
                    ? "border-[#0072BB26]"
                    : "border-[#CCCCCC]"
                  } ${activeProduct === 2 ? "bg-[#0072BB26] " : "border-[#CCCCCC]"
                  } border rounded-[10px] flex flex-col gap-[10px] lg:gap-[30px] text-center`}
              >
                <img
                  className="m-auto"
                  height={100}
                  width={100}
                  src="/aluhak.png"
                  alt=""
                />
                <p
                  className={`medium-title ${activeProduct === 2 && "text-[#0072BB]"
                    }`}
                >
                  Aluhak
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-[30px] lg:py-[100px] border-b border-b-[#CCCCCC]">
        <div className="custom-container">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-[30px] lg:gap-[70px]">
            <div>
              <p className="medium-title text-nowrap">{t("custom_list")}</p>
            </div>
            <div className="flex flex-wrap w-full gap-[20px] lg:gap-[40px] md:pl-16">
              {customListData &&
                [...customListData, "addCustom"]?.map((item, index) => (
                  <>
                    {item === "addCustom" ? (
                      <>
                        <div
                          onClick={() => {
                            setIsCustomListModalOpen(true);
                            setActiveProduct(3);
                            setActiveItem("");
                            // getMaterialListBuUserId();
                            handleSelectAllMaterial(false);
                            setIsSelectedAll(false);
                          }}
                          className={`w-[calc(50%-10px)] lg:w-[180px] pt-[44px] pb-[20px] max-w-[180px] px-[20px] lg:px-[25px] border-[#CCCCCC] border rounded-[10px] flex flex-col gap-[10px] lg:gap-[30px] text-center cursor-pointer ${activeProduct === 3
                              ? "border-[#0072BB26]"
                              : "border-[#CCCCCC]"
                            } ${activeProduct === 3
                              ? "bg-[#0072BB26]"
                              : "border-[#CCCCCC]"
                            } `}
                        >
                          <IoAddCircleOutline
                            className="m-auto"
                            color="#0072BB"
                            size={35}
                          />
                          <p className="medium-title !text-[#0072BB]">
                            {t("createCustomList")}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div
                        onClick={() => {
                          setCurrentCustomListName(item?.customName);
                          setCurrentCustomListIndex(index);
                          setActiveProduct(3);
                          setActiveItem("");
                          setCurrentCustomDeleteId(item?._id);
                        }}
                        className={`w-[calc(50%-10px)] lg:w-[180px] py-[20px] cursor-pointer px-[20px] lg:px-[40px] max-w-[180px] ${index === currentCustomListIndex
                            ? "border-[#0072BB26]"
                            : "border-[#CCCCCC]"
                          } ${index === currentCustomListIndex
                            ? "bg-[#0072BB26] "
                            : "border-[#CCCCCC]"
                          } border rounded-[10px] flex flex-col gap-[10px] lg:gap-[30px] text-center relative`}
                      >
                        <div className="flex flex-col items-start justify-start">
                          <img
                            className="m-auto"
                            height={100}
                            width={100}
                            src={item?.customImage}
                            alt=""
                          />
                          <p
                            className={`text-xs font-semibold ml-4 lg:ml-0 uppercase ${index === currentCustomListIndex &&
                              "text-[#0072BB]"
                              } overflow-hidden break-words  ${index === currentCustomListIndex &&
                              "text-[#0072BB]"
                              }`}
                          >
                            {item?.customName}
                          </p>
                          <p
                            className={`text-[10px] font-semibold mb-3 lg:mb-0 ml-4 lg:ml-0 ${index === currentCustomListIndex &&
                              "text-[#0072BB]"
                              } overflow-hidden break-words ${index === currentCustomListIndex &&
                              "text-[#0072BB]"
                              }`}
                          >
                            {item?.customDescription}
                          </p>
                        </div>
                        <div>
                          <IoClose
                            onClick={() => {
                              setOperationOnCustomList("deleteCustomComponent");
                              setShowConfirmationModal(true);
                              setCurrentCustomDeleteId(item?._id);
                            }}
                            className="absolute top-[3%] right-[4%] text-[26px] cursor-pointer rounded-full border font-bold hover:bg-gray-100 border-gray-800 p-1"
                          />
                          <CiEdit
                            onClick={() => {
                              setCurrentCustomDeleteId(item?._id);
                              setIsCustomListModalOpen(true);
                              setIsEditCustomList(true);
                              handleCustomDataEdit(item, index);
                              setCurrentCustomId(index);
                            }}
                            className="absolute bottom-[4%] left-[20%] text-[26px] cursor-pointer rounded-full border font-bold hover:bg-gray-100 border-gray-800 p-1"
                          />
                          <IoMdAddCircleOutline
                            onClick={() => {
                              setIsCustomComponentOpen(true);
                              setCurrentCustomDeleteId(item?._id);
                            }}
                            className="absolute bottom-[4%] left-[40%] text-[26px] cursor-pointer rounded-full border font-bold hover:bg-gray-100 border-gray-800 p-1"
                          />
                          <IoShareOutline
                            onClick={() => {
                              setIsShareCustomList(true);
                              setCurrentCustomDeleteId(item?._id);
                            }}
                            className="absolute bottom-[4%] left-[60%] text-[26px] cursor-pointer rounded-full border font-bold hover:bg-gray-100 border-gray-800 p-1"
                          />
                        </div>
                      </div>
                    )}
                  </>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="md:py-[50px] sm:py-14 py-7  border-b-[#CCCCCC]">
        <div className="custom-container">
          {activeProduct === 3 ? (
            ""
          ) : (
            <>
              <div className="pb-[50px]">
                <div className="flex flex-col lg:flex-row gap-[30px] items-center justify-between text-center">
                  {searchTerm?.length === 0 ? (
                    <p className="medium-title">
                      {" "}
                      {t("selectTheTypeOfScaffolding")}
                    </p>
                  ) : (
                    <p className="medium-title"> {""}</p>
                  )}
                  <div className="relative">
                    <GoSearch
                      className="absolute top-[50%] left-[2%] translate-y-[-50%]"
                      size={24}
                      color="#000000"
                    />
                    <input
                      onChange={handleSearch}
                      className="border border-[#CCCCCC] !w-full lg:!w-[380px]"
                      placeholder={t("Searchformaterial")}
                      type="text"
                      value={searchTerm || ""}
                    />
                    <button>
                      <IoFilter
                        className="absolute top-[50%] right-[2%] translate-y-[-50%]"
                        size={24}
                        color="#000000"
                      />
                    </button>
                  </div>
                  <div className="flex border px-[18px] py-[9px] rounded-lg">
                    <input
                      type="checkbox"
                      onClick={(e) => handleSelectAllMaterial(e.target.checked)}
                      checked={isSelectedAll ? true : false}
                      className=" shrink-0 font-semibold size-5 mt-0.5 border-gray-500 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                      id="hs-default-checkbox"
                    />
                    <label
                      for="hs-default-checkbox"
                      className="text-lg text-nowrap font-semibold text-black ms-3 dark:text-black"
                    >
                      Select All
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center w-full sm:gap-[20px] gap-3 md:h-auto rounded">
                {loading ? (
                  <div className="flex flex-col items-center justify-center">
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
                    <span className="text-[20px] font-[700] text-[#0072BB] mt-3">
                      Loading...
                    </span>
                  </div>
                ) : (
                  <>
                    {searchTerm?.length === 0 &&
                      (productList[activeProduct] ? (
                        <div className="flex flex-col justify-center items-center">
                          <div className="overflow-auto flex flex-wrap h-[400px] md:h-full w-full md:min-w-[700px] lg:min-w-[900px]">
                            {currentItems?.sort()?.map((item, index) => (
                              <div
                                id={item}
                                className="item w-[50%] md:w-[25%]"
                                key={index}
                              >
                                <table className="table">
                                  <tbody>
                                    <tr>
                                      <th>
                                        <label>
                                          <input
                                            type="checkbox"
                                            onClick={() =>
                                              toggleActiveItem(item)
                                            }
                                            className="checkbox"
                                            checked={selectedItems.includes(
                                              item
                                            )}
                                            onChange={() => ""}
                                          />
                                        </label>
                                      </th>
                                      <td className="absolute left-10 font-semibold">
                                        {item}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            ))}
                          </div>

                          <div className="pagination mt-10 flex justify-center flex-wrap gap-2">
                            {[
                              ...Array(
                                Math.ceil(
                                  Object.keys(productList[activeProduct])
                                    ?.length / itemsPerPage
                                )
                              ).keys(),
                            ].map((number) => (
                              <button
                                key={number}
                                onClick={(e) => {
                                  e.preventDefault();
                                  paginate(number + 1);
                                }}
                                className={`bg-[#4371e5] hover:bg-[#4371e5] text-white font-bold py-2 px-4 rounded mx-1 ${currentPage === number + 1
                                    ? "cursor-not-allowed opacity-50"
                                    : ""
                                  }`}
                                disabled={currentPage === number + 1}
                              >
                                {number + 1}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-[100vw]">
                          <p className="text-center font-bold">
                            Data not found
                          </p>
                        </div>
                      ))}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {activeProduct !== 3 &&
        (searchTerm?.length > 0 ||
          (!CheckProductlist ? selectedSubCategory?.length > 0 : false)) ? (
        <div className="w-full md:py-[50px] sm:py-14 py-7 border-b-[1px] tableZoom">
          <div className="custom-container select-none">
            <div>
              <div className="text-center">
                {searchData?.length > 0 ? (
                  <p className="medium-title"></p>
                ) : (
                  <>
                    {selectedItems?.length > 0 && (
                      <div className="flex flex-row gap-3 flex-wrap cursor-pointer">
                        {!isSelectedAll &&
                          selectedItems.map((ele) => {
                            return (
                              <p className="border rounded-xl bg-blue-600 text-white py-1.5 px-2 font-semibold flex flex-row gap-1.5 hover:bg-blue-700 transition-colors duration-300 ease-in-out">
                                {ele}
                                <span
                                  onClick={() => handleRemoveSubCategory(ele)}
                                >
                                  <IoMdClose className="text-[#fff]" />
                                </span>
                              </p>
                            );
                          })}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex lg:flex-nowrap flex-wrap gap-7 w-full">
                {innerWidth ? (
                  <>
                    <div
                      id="handle-page-scroll"
                      className="w-full flex flex-col gap-10 items-center cursor-pointer"
                    >
                      <div className="w-full flex flex-col">
                        <div className="-m-1.5 overflow-x-auto">
                          <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                <thead>
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                                    >
                                      {t("productNo")}
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                                    >
                                      {t("descriptionName")}
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                                    >
                                      Action
                                    </th>
                                  </tr>
                                </thead>

                                <tbody className="border-b border-b-[#CCCCCC]">
                                  {currentItemsSubCategory?.length > 0 ||
                                    searchData?.length > 0 ? (
                                    (
                                      currentItemsSubCategory || searchData
                                    )?.map((item, index) => (
                                      <tr className="odd:bg-white even:bg-gray-100 odd:hover:bg-blue-200 even:hover:bg-blue-200 transition-colors duration-200 ease-in-out">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-black">
                                          {item?.["product_no"]}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                                          {item?.["description"]}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                                          <div className="flex gap-4 items-center">
                                            <div
                                              onClick={() => {
                                                handleDecrement(
                                                  item?._id,
                                                  item?.kg,
                                                  item
                                                );
                                              }}
                                              className={`${items.filter(
                                                (Citem) =>
                                                  Citem?.id === item?._id
                                              )?.length > 0
                                                  ? "!border-[#0072BB] "
                                                  : "!border-[#000000]"
                                                } cursor-pointer h-[20px] w-[20px]  rounded-[5px] border-[#0077BB] flex justify-center items-center font-semibold`}
                                            >
                                              <BsDash
                                                className={`${items.filter(
                                                  (Citem) =>
                                                    Citem?.id === item?._id
                                                )?.length > 0
                                                    ? "!border-[#0072BB]  text-[#0072BB] "
                                                    : "!border-[#000000]"
                                                  } cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] border-[#0077BB] flex justify-center items-center font-semibold`}
                                                size={18}
                                              />
                                            </div>
                                            <input
                                              key={index}
                                              className={`${items.filter(
                                                (Citem) =>
                                                  Citem?.id === item?._id
                                              )?.length > 0
                                                  ? "!border-[#0072BB]  text-[#0072BB] "
                                                  : "!border-[#000000]"
                                                } cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] border-[#0077BB] flex justify-center items-center font-semibold`}
                                              type="text"
                                              value={
                                                items
                                                  ?.find(
                                                    (element) =>
                                                      element?._id === item?._id
                                                  )
                                                  ?.quantity?.toString()
                                                  ?.padStart(2, "0") || "00"
                                              }
                                              onChange={(e) =>
                                                handleInputChange(
                                                  e,
                                                  index,
                                                  item
                                                )
                                              }
                                              placeholder="00"
                                              style={{
                                                width: "40px",
                                                padding: "3px 8px",
                                                height: "auto",
                                              }}
                                            />
                                            <div
                                              onClick={() => {
                                                handleIncrement(
                                                  item?._id,
                                                  item?.kg,
                                                  item,
                                                  activeItem
                                                );
                                              }}
                                              className={`${items?.filter(
                                                (Citem) =>
                                                  Citem?.id === item?._id
                                              )?.length > 0
                                                  ? "!border-[#0072BB]"
                                                  : "!border-[#000000]"
                                                } cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] border-[#0077BB] flex justify-center items-center`}
                                            >
                                              <RiAddFill
                                                size={18}
                                                color={
                                                  items.filter(
                                                    (Citem) =>
                                                      Citem?.id === item?._id
                                                  )?.length > 0
                                                    ? "#0072BB"
                                                    : "#000000"
                                                }
                                              />
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={5} className="text-center">
                                        {" "}
                                        No data Found
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        {[
                          ...Array(
                            Math.ceil(
                              selectedSubCategory.length /
                              itemsPerPageSubCategory
                            )
                          ).keys(),
                        ]?.map((number) => (
                          <button
                            key={number}
                            onClick={() => {
                              paginateSubCategory(number + 1);
                              handlePageChange();
                            }}
                            className={`mx-1 border bg-[#4371e5] hover:bg-[#4371e5] text-white font-bold py-2 px-4 rounded ${currentPageSubCategory === number + 1
                                ? "cursor-not-allowed opacity-50"
                                : ""
                              }`}
                            disabled={currentPageSubCategory === number + 1}
                          >
                            {number + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    id="handle-page-scroll"
                    className="w-full lg:w-full sm:pt-12 pt-6 flex flex-col gap-10 cursor-pointer items-center"
                  >
                    <div
                      id="handle-page-scroll"
                      className="w-full lg:w-full sm:pt-12 pt-6 flex gap-5"
                    >
                      <div className="flex flex-col">
                        <div className="-m-1.5 overflow-x-auto">
                          <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                <thead>
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                                    >
                                      {t("productNo")}
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                                    >
                                      {t("descriptionName")}
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                                    >
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {currentItemsSubCategory?.length > 0 ||
                                    searchData?.length > 0 ? (
                                    (currentItemsSubCategory || searchData)
                                      ?.slice(
                                        0,
                                        Math.ceil(
                                          (currentItemsSubCategory?.length ||
                                            searchData?.length) / 2
                                        )
                                      )
                                      ?.map((item, index) => (
                                        <tr className="odd:bg-white even:bg-gray-100 dark:odd:bg-white odd:hover:bg-blue-200 even:hover:bg-blue-200 transition-colors duration-200 ease-in-out">
                                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-black">
                                            {item?.["product_no"]}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                                            {item?.["description"]}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                                            <div className="flex gap-4 items-center">
                                              <div
                                                onClick={() => {
                                                  handleDecrement(
                                                    item?._id,
                                                    item?.kg,
                                                    item
                                                  );
                                                }}
                                                className={`${items.filter(
                                                  (Citem) =>
                                                    Citem?.id === item?._id
                                                )?.length > 0
                                                    ? "!border-[#0072BB]  text-[#0072BB] "
                                                    : "!border-[#000000]"
                                                  } cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] border-[#0077BB] flex justify-center items-center font-semibold`}
                                              >
                                                <BsDash
                                                  size={18}
                                                  color={
                                                    items.filter(
                                                      (Citem) =>
                                                        Citem?.id === item?._id
                                                    )?.length > 0
                                                      ? "#0072BB"
                                                      : "#000000"
                                                  }
                                                />
                                              </div>
                                              <input
                                                key={index}
                                                className={`${items.filter(
                                                  (Citem) =>
                                                    Citem?.id === item?._id
                                                )?.length > 0
                                                    ? "!border-[#0072BB]  text-[#0072BB] "
                                                    : "!border-[#000000]"
                                                  } cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] border-[#0077BB] flex justify-center items-center font-semibold`}
                                                type="text"
                                                value={
                                                  items
                                                    ?.find(
                                                      (element) =>
                                                        element?._id ===
                                                        item?._id
                                                    )
                                                    ?.quantity?.toString()
                                                    ?.padStart(2, "0") || "00"
                                                }
                                                onChange={(e) =>
                                                  handleInputChange(
                                                    e,
                                                    index,
                                                    item
                                                  )
                                                }
                                                placeholder="00"
                                                style={{
                                                  width: "40px",
                                                  padding: "3px 8px",
                                                  height: "auto",
                                                }}
                                              />
                                              <div
                                                onClick={() => {
                                                  handleIncrement(
                                                    item?._id,
                                                    item?.kg,
                                                    item,
                                                    activeItem
                                                  );
                                                }}
                                                className={`${items?.filter(
                                                  (Citem) =>
                                                    Citem?.id === item?._id
                                                )?.length > 0
                                                    ? "!border-[#0072BB]"
                                                    : "!border-[#000000]"
                                                  } cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] border-[#0077BB] flex justify-center items-center`}
                                              >
                                                <RiAddFill
                                                  size={18}
                                                  color={
                                                    items.filter(
                                                      (Citem) =>
                                                        Citem?.id === item?._id
                                                    )?.length > 0
                                                      ? "#0072BB"
                                                      : "#000000"
                                                  }
                                                />
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      ))
                                  ) : (
                                    <tr>
                                      <td colSpan={5} className="text-center">
                                        {" "}
                                        No data Found
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      {(currentItemsSubCategory?.length > 1 ||
                        searchData?.length > 1) && (
                          <div className="flex flex-col cursor-pointer">
                            <div className="-m-1.5 overflow-x-auto">
                              <div className="p-1.5 min-w-full inline-block align-middle">
                                <div className="overflow-hidden">
                                  <table className="min-w-full divide-y ">
                                    <thead>
                                      <tr>
                                        <th
                                          scope="col"
                                          className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                                        >
                                          {t("productNo")}
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                                        >
                                          {t("descriptionName")}
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                                        >
                                          Action
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="border-t border-t-black">
                                      {currentItemsSubCategory?.length > 0 ||
                                        searchData?.length > 0 ? (
                                        (currentItemsSubCategory || searchData)
                                          ?.slice(
                                            Math.ceil(
                                              (currentItemsSubCategory?.length ||
                                                searchData?.length) / 2
                                            )
                                          )
                                          ?.map((item, index) => (
                                            <tr className="odd:bg-white even:bg-gray-100 dark:odd:bg-white odd:hover:bg-blue-200 even:hover:bg-blue-200 transition-colors duration-200 ease-in-out">
                                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-black">
                                                {item?.["product_no"]}
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black-800 dark:text-black">
                                                {item?.["description"]}
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black-800 dark:text-black">
                                                <div className="flex gap-4 items-center">
                                                  <div
                                                    onClick={() => {
                                                      handleDecrement(
                                                        item?._id,
                                                        item?.kg,
                                                        item
                                                      );
                                                    }}
                                                    className={`${items.filter(
                                                      (Citem) =>
                                                        Citem?.id === item?._id
                                                    ).length > 0
                                                        ? "!border-[#0072BB]  text-[#0072BB] "
                                                        : "!border-[#000000]"
                                                      } cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] border-[#0077BB] flex justify-center items-center font-semibold`}
                                                  >
                                                    <BsDash
                                                      size={18}
                                                      color={
                                                        items.filter(
                                                          (Citem) =>
                                                            Citem?.id ===
                                                            item?._id
                                                        ).length > 0
                                                          ? "#0072BB"
                                                          : "#000000"
                                                      }
                                                    />
                                                  </div>
                                                  <input
                                                    key={index}
                                                    className={`${items.filter(
                                                      (Citem) =>
                                                        Citem?.id === item?._id
                                                    ).length > 0
                                                        ? "!border-[#0072BB]  text-[#0072BB] "
                                                        : "!border-[#000000]"
                                                      } cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] border-[#0077BB] flex justify-center items-center font-semibold`}
                                                    type="text"
                                                    value={
                                                      items
                                                        ?.find(
                                                          (element) =>
                                                            element?._id ===
                                                            item?._id
                                                        )
                                                        ?.quantity?.toString()
                                                        ?.padStart(2, "0") || "00"
                                                    }
                                                    onChange={(e) =>
                                                      handleInputChange(
                                                        e,
                                                        index,
                                                        item
                                                      )
                                                    }
                                                    placeholder="00"
                                                    style={{
                                                      width: "40px",
                                                      padding: "3px 8px",
                                                      height: "auto",
                                                    }}
                                                  />
                                                  <div
                                                    onClick={() => {
                                                      handleIncrement(
                                                        item?._id,
                                                        item?.kg,
                                                        item,
                                                        activeItem
                                                      );
                                                    }}
                                                    className={`${items.filter(
                                                      (Citem) =>
                                                        Citem?.id === item?._id
                                                    ).length > 0
                                                        ? "!border-[#0072BB]  text-[#0072BB] "
                                                        : "!border-[#000000]"
                                                      } cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] border-[#0077BB] flex justify-center items-center font-semibold`}
                                                  >
                                                    <RiAddFill
                                                      size={18}
                                                      color={
                                                        items.filter(
                                                          (Citem) =>
                                                            Citem?.id ===
                                                            item?._id
                                                        )?.length > 0
                                                          ? "#0072BB"
                                                          : "#000000"
                                                      }
                                                    />
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          ))
                                      ) : (
                                        <tr>
                                          <td colSpan={5} className="text-center">
                                            {" "}
                                            No data Found
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>

                    <div>
                      {[
                        ...Array(
                          Math?.ceil(
                            selectedSubCategory?.length /
                            itemsPerPageSubCategory
                          )
                        )?.keys(),
                      ]?.map((number) => (
                        <button
                          key={number}
                          onClick={() => {
                            paginateSubCategory(number + 1);
                            handlePageChange();
                          }}
                          className={`mx-1 border bg-[#4371e5] hover:bg-[#4371e5] text-white font-bold py-2 px-4 rounded ${currentPageSubCategory === number + 1
                              ? "cursor-not-allowed opacity-50"
                              : ""
                            }`}
                          disabled={currentPageSubCategory === number + 1}
                        >
                          {number + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        activeProduct === 3 && (
          <div
            id="handle-page-scroll"
            className=" select-none border-b border-[#CCCCCC] "
          >
            <div className="custom-container">
              <div className="text-center">
                <p className="medium-title underline">{t("custom_list")}</p>
              </div>
              {createList?.length > 0 ? (
                <div className="w-full flex flex-col mt-10">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black sm:table-cell hidden"
                              >
                                {t("productNo")}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                              >
                                {t("productName")}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black sm:table-cell hidden"
                              >
                                {t("descriptionName")}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black sm:table-cell hidden"
                              >
                                {t("weightInKG")}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black sm:table-cell hidden"
                              >
                                {t("date")}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                              >
                                Quantity
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                              ></th>
                            </tr>
                          </thead>
                          {console.log("createList===>>>>", createList)}
                          {console.log("createLis", createList)}

                          <tbody className=" border-b border-b-[#CCCCCC]">
                            {createList?.length > 0 &&
                              createList?.map((item, index) => (
                                <tr className="odd:bg-white even:bg-gray-100 odd:hover:bg-blue-200 even:hover:bg-blue-200 transition-colors duration-200 ease-in-out relative">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-black sm:table-cell hidden">
                                    <p className="normal-text">
                                      {item?.product_no || "Not Defined"}
                                    </p>
                                  </td>
                                  {console.log("item====>>>>", item)}
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                                    <p className="normal-text">
                                      {item?.["productName"]}
                                    </p>
                                  </td>{" "}
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black sm:table-cell hidden">
                                    <p className="normal-text">
                                      {item?.["description"]}
                                    </p>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black sm:table-cell hidden">
                                    <p className="normal-text">
                                      {item?.["kg"]}
                                    </p>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black sm:table-cell hidden">
                                    <p className="normal-text">
                                      {item?.date || "Not Defined"}
                                    </p>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black relative">
                                    <div className="flex gap-[19px] items-center">
                                      <div
                                        onClick={() =>
                                          handleCreate(index, true, item)
                                        }
                                        className={`${items?.find(
                                          (element) =>
                                            element._id === item._id
                                        )?.quantity > 0
                                            ? "border-[#0072BB]"
                                            : "border-[#000000]"
                                          } cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] flex justify-start items-center`}
                                      >
                                        <BsDash
                                          size={18}
                                          color={
                                            items?.find(
                                              (element) =>
                                                element._id === item._id
                                            )?.quantity > 0
                                              ? "#0072BB"
                                              : "#000000"
                                          }
                                        />
                                      </div>
                                      <input
                                        key={index}
                                        className={`${items?.find(
                                          (element) =>
                                            element._id === item._id
                                        )?.quantity > 0
                                            ? "!text-[#0072BB] !border-[#0072BB]"
                                            : "text-[#000000]"
                                          } normal-text`}
                                        type="text"
                                        value={
                                          items
                                            ?.find(
                                              (element) =>
                                                element._id === item._id
                                            )
                                            ?.quantity?.toString()
                                            ?.padStart(2, "0") || "00"
                                        }
                                        onChange={(e) =>
                                          handleInputChange(e, index, item)
                                        }
                                        placeholder="00"
                                        style={{
                                          width: "40px",
                                          padding: "8px",
                                          height: "32px",
                                        }}
                                      />
                                      <div
                                        onClick={() =>
                                          handleCreate(index, false, item)
                                        }
                                        className={`${items?.find(
                                          (element) =>
                                            element._id === item._id
                                        )?.quantity > 0
                                            ? "border-[#0072BB]"
                                            : "border-[#000000]"
                                          } cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] flex justify-center items-center`}
                                      >
                                        <RiAddFill
                                          size={18}
                                          color={
                                            items?.find(
                                              (element) =>
                                                element._id === item._id
                                            )?.quantity > 0
                                              ? "#0072BB"
                                              : "#000000"
                                          }
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black top-5 ">
                                    <RiDeleteBin2Fill
                                      onClick={() => {
                                        setCurrentCustomListItem(item);
                                        setShowConfirmationModal(true);
                                        setOperationOnCustomList(
                                          "deleteCustomList"
                                        );
                                      }}
                                      className=" text-[25px] cursor-pointer rounded-full border font-bold "
                                    />
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <h1 className="flex flex-col gap-1 justify-center items-center font-bold text-lg mb-10 pb-5 border rounded-2xl text-gray-400">
                  <img
                    src={noDataIcon}
                    alt="no_data_image"
                    className="w-[200px]"
                  />
                  No List Available
                </h1>
              )}
            </div>
          </div>
        )
      )}

      {items?.length > 0 && (
        <>
          <div className="flex flex-col justify-center items-center custom-container select-none">
            <div className="text-center md:mt-[1rem] mt-6">
              <p className="medium-title flex justify-center md:mt-[50px] mt-6">
                {" "}
                {t("listOfSelectedMaterials")}
              </p>
            </div>

            <div className="w-full flex flex-col mt-10">
              <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                          >
                            {t("productNo")}
                          </th>{" "}
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                          >
                            {t("category")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                          >
                            {t("productName")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                          >
                            {t("descriptionName")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                          >
                            {t("weightInKG")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                          >
                            {t("date")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-bold text-black uppercase dark:text-black"
                          >
                            Quantity
                          </th>
                        </tr>
                      </thead>

                      <tbody className="border-b border-b-[#CCCCCC]">
                        {[...items]?.map((item, index) => (
                          <tr className="odd:bg-white even:bg-gray-100 odd:hover:bg-blue-200 even:hover:bg-blue-200 transition-colors duration-200 ease-in-out">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-black">
                              {item?.product_no || "No Defined"}
                            </td>{" "}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                              {item?.category || "Not Defined"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-black">
                              {item?.productName || "No Defined"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                              {item["description"] || "No Description"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                              {item["kg"]}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                              {item?.date || "Not Defined"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-black">
                              <div className="flex gap-4 items-center">
                                {item?.category == "Custom List" ? (
                                  <>
                                    <div
                                      onClick={() =>
                                        handleCreate(item?.index, true)
                                      }
                                      className={`${items?.filter(
                                        (Citem) => Citem?.id === index
                                      )?.length > 0
                                          ? "border-[#0072BB]"
                                          : "border-[#000000]"
                                        } cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] border-[#0077BB] flex justify-center items-center`}
                                    >
                                      <BsDash
                                        size={18}
                                        color={
                                          items.filter(
                                            (Citem) => Citem.id === index
                                          )?.length > 0
                                            ? "#0072BB"
                                            : "#000000"
                                        }
                                      />
                                    </div>
                                    <input
                                      key={index}
                                      className={`${items?.find(
                                        (element) => element._id === item._id
                                      )?.quantity > 0
                                          ? "text-[#0072BB] "
                                          : "text-[#000000]"
                                        } normal-text`}
                                      type="text"
                                      value={
                                        items
                                          ?.find(
                                            (element) =>
                                              element._id === item._id
                                          )
                                          ?.quantity?.toString()
                                          ?.padStart(2, "0") || "00"
                                      }
                                      onChange={(e) =>
                                        handleInputChange(e, index, item)
                                      }
                                      placeholder="00"
                                      style={{
                                        width: "40px",
                                        padding: "3px 8px",
                                        height: "auto",
                                      }}
                                    />
                                    <div
                                      onClick={() =>
                                        handleCreate(item?.index, false)
                                      }
                                      className={`${items?.filter(
                                        (Citem) => Citem?.id === index
                                      )?.length > 0
                                          ? "border-[#0072BB]"
                                          : "border-[#000000]"
                                        } cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] border-[#0077BB] flex justify-center items-center`}
                                    >
                                      <RiAddFill
                                        size={18}
                                        color={
                                          items.filter(
                                            (Citem) => Citem.id === index
                                          )?.length > 0
                                            ? "#0072BB"
                                            : "#000000"
                                        }
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      onClick={() => {
                                        handleDecrement(
                                          item?._id,
                                          item?.kg,
                                          item
                                        );
                                      }}
                                      className={`${items.filter(
                                        (Citem) => Citem?.id === item?._id
                                      )?.length > 0
                                          ? "!border-[#0072BB]  text-[#0072BB] "
                                          : "!border-[#000000]"
                                        } cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] border-[#0077BB] flex justify-center items-center font-semibold`}
                                    >
                                      <BsDash
                                        size={18}
                                        color={
                                          items.filter(
                                            (Citem) => Citem.id === item._id
                                          )?.length > 0
                                            ? "#0072BB"
                                            : "#000000"
                                        }
                                      />
                                    </div>
                                    <input
                                      key={index}
                                      className={`${items.filter(
                                        (Citem) => Citem?.id === item?._id
                                      )?.length > 0
                                          ? "!border-[#0072BB]  text-[#0072BB] "
                                          : "!border-[#000000]"
                                        } cursor-pointer h-[20px] !w-[80px] border-[2px] rounded-[5px] border-[#0077BB] flex justify-center items-center font-semibold`}
                                      type="text"
                                      value={
                                        items
                                          ?.find(
                                            (element) =>
                                              element._id === item._id
                                          )
                                          ?.quantity?.toString()
                                          ?.padStart(2, "") || "00"
                                      }
                                      onChange={(e) =>
                                        handleInputChange(e, index, item)
                                      }
                                      placeholder="00"
                                      style={{
                                        width: "40px",
                                        padding: "3px 8px",
                                        height: "auto",
                                      }}
                                    />
                                    <div
                                      onClick={() => {
                                        handleIncrement(
                                          item?._id,
                                          item?.kg,
                                          item
                                        );
                                      }}
                                      className={`${items?.filter(
                                        (Citem) => Citem?.id === item?._id
                                      )?.length > 0
                                          ? "border-[#0072BB]"
                                          : "border-[#000000]"
                                        } cursor-pointer h-[20px] w-[20px] border-[2px] rounded-[5px] border-[#0077BB] flex justify-center items-center`}
                                    >
                                      <RiAddFill
                                        size={18}
                                        color={
                                          items.filter(
                                            (Citem) => Citem.id === item._id
                                          )?.length > 0
                                            ? "#0072BB"
                                            : "#000000"
                                        }
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {items.length > 0 && sum > 0 && (
        <div className="custom-container">
          <div className="text-center sm:mt-[30px] mt-4 flex justify-between items-center py-[10px] gap-[20px] w-full">
            <p className="lg:text-[18px] md:base text-sm">
              {t("totalWeight")} {sum} kg
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();
                update();
              }}
              className="button-text bg-[#0072BB] px-[20px] py-[10px] rounded-[5px] text-white"
            >
              {loading ? t("loading") : t("update")}
            </button>
          </div>
        </div>
      )}

      {isCustomListModalOpen && (
        <>
          <div className="fixed inset-0 flex justify-center items-center bg-gray-400 bg-opacity-50 z-40 ">
            <div className="bg-white rounded-lg p-10 w-100 h-[200px]\ absolute min-w-[50vw] min-h-[55vh]">
              <IoClose
                onClick={() => setIsCustomListModalOpen(false)}
                className="absolute top-[5%] right-[4%] text-[26px] cursor-pointer rounded-full border font-bold"
              />

              <div className="flex flex-row justify-center items-center flex-wrap mt-6 mb-5 underline">
                <h1 className="font-bold text-16px">
                  {isEditCustomList ? "Edit Custom List" : "Create Custom List"}
                </h1>
              </div>

              <div>
                <label
                  for="helper-text"
                  className="block mb-2 text-sm text-black-900 dark:text-black font-semibold "
                >
                  Custom List Name
                </label>
                <input
                  onChange={(e) =>
                    setCustomListDetail({
                      ...customListDetail,
                      customName: e.target.value,
                    })
                  }
                  value={customListDetail.customName}
                  type="text"
                  className="bg-gray-50 border !pl-3 border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:border-gray-600 dark:placeholder-gray-600 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="your custom list's name"
                />
              </div>
              <div>
                <label
                  for="helper-text"
                  className="block mb-2 text-sm text-black-900 dark:text-black font-semibold mt-2 "
                >
                  Custom List Description
                </label>
                <input
                  onChange={(e) =>
                    setCustomListDetail({
                      ...customListDetail,
                      customDescription: e.target.value,
                    })
                  }
                  value={customListDetail.customDescription}
                  type="text"
                  className="bg-gray-50 !pl-3 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:border-gray-600 dark:placeholder-gray-600 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="your custom list's description"
                />
              </div>

              <div className="flex flex-row justify-center items-center flex-wrap mt-6">
                <div className="w-full ">
                  <div onClick={handleButtonClick}>
                    <div>
                      {" "}
                      <label
                        for="helper-text"
                        className="block mb-2 text-sm text-black-900 dark:text-black font-semibold"
                      >
                        List Image
                      </label>
                      <label
                        for="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-white hover:bg-gray-100 dark:border-gray-200 dark:hover:border-gray-200 dark:hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                      </label>
                    </div>
                    <input
                      ref={ref}
                      hidden
                      type="file"
                      accept="image/*,.pdf,.doc,.txt"
                      onChange={handleUpload}
                    />
                    {loading && <div className="mt-10">{t("Uploading")}</div>}
                    {image && (
                      <img
                        src={image}
                        alt="uploaded_image"
                        className="mt-2 w-10"
                      />
                    )}
                    {error && <div>{error}</div>}
                  </div>
                </div>
                <button
                  onClick={() => handleSaveCustomDetails()}
                  className="border px-3 py-3 bg-[#0072bb] mt-5 rounded-lg font-bold text-white mb-[200px]"
                >
                  {isEditCustomList
                    ? isCustomLoading
                      ? "Loading..."
                      : "Save"
                    : isCustomLoading
                      ? "Loading..."
                      : "Create"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {isCustomComponentOpen && (
        <>
          <div className="fixed inset-0 flex justify-center items-center bg-gray-400 bg-opacity-50 z-40">
            <div className="bg-white rounded-lg p-10 w-[95vw] h-[90vh] absolute min-w-[50vw] lg:min-h-[40vh] min-h-[60%] m-auto">
              <IoClose
                onClick={() => setIsCustomComponentOpen(false)}
                className="absolute top-[3%] right-[4%] text-[26px] cursor-pointer rounded-full border font-bold border-black"
              />
              <CustomList
                setCreateList={setCreateList}
                createList={createList}
                setItems={setItems}
                items={items}
                setIsCustomComponentOpen={setIsCustomComponentOpen}
                setCustomListData={setCustomListData}
                customListData={customListData}
                currentCustomListIndex={currentCustomListIndex}
                currentCustomListName={currentCustomListName}
                currentCustomDeleteId={currentCustomDeleteId}
                getCustomMaterialByProjectId={getCustomMaterialByProjectId}
              />
            </div>
          </div>
        </>
      )}

      {showConfirmationModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50  z-40">
          <div className="bg-white rounded-lg p-5 w-auto">
            <p>Are you sure you want to Delete the List?</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-[#0072bb] hover:bg-[#0073bbc3] text-white px-4 py-2 rounded mr-2 font-semibold"
                onClick={() => {
                  handleConfirmation(true, operationOnCustomList);
                }}
              >
                {isLoading ? "Loading..." : "Confirm"}
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded font-semibold "
                onClick={() => handleConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isShareCustomList && (
        <>
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50  z-40 ">
            <div className="bg-white w-[90vw] h-[95vh] sm:w-[70vw] sm:h-[70vh] relative rounded-lg overflow-auto scrollbar">
              <IoClose
                onClick={() => setIsShareCustomList(false)}
                className="absolute top-[1%] right-[2%] text-[26px] cursor-pointer border font-bold rounded-2xl"
              />
              <div className="w-full  h-full  rounded-2xl">
                <div className=" pt-8 px-4 flex justify-center">
                  <p className="font-semibold text-blue-500 text-lg underline">
                    List of Project you wants to share the custom list
                  </p>
                </div>
                <div className=" w-[67vw] h-auto md:h-auto lg:h-full lg-w-full lg:flex justify-center items-center m-auto">
                  <div className=" lg:w-[30%] sm:h-full bg-slate-100 p-5 border-r">
                    <p className="font-semibold text-black text-sm mb-2">
                      Detail of custom list
                    </p>
                    <div className=" w-full h-full px-2 ">
                      <div className=" px-2 flex flex-col justify-start items-center">
                        <div
                          className={`w-[calc(50%-10px)] hidden  lg:w-[180px] sm:py-[20px] cursor-pointer px-[20px] lg:px-[40px]   border rounded-[10px] sm:flex flex-col gap-[10px] lg:gap-[30px] text-center relative`}
                        >
                          <div>
                            <img
                              className="m-auto !w-[50px]"
                              height={100}
                              width={100}
                              src={
                                customListData[currentCustomListIndex]
                                  ?.customImage
                              }
                              alt=""
                            />
                            <p
                              className={`sm:text-md text-sm font-semibold  overflow-hidden break-words `}
                            >
                              {
                                customListData[currentCustomListIndex]
                                  ?.customName
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className=" w-auto sm:h-auto h-[25vh] mt-4 overflow-auto scrollbar">
                        <>
                          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                              <thead className="text-xs text-black uppercase bg-blue-400">
                                <tr>
                                  <th scope="col" className="px-6 py-3">
                                    List Name
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Description
                                  </th>
                                </tr>
                              </thead>
                              <tbody className=" text-black font-semibold ">
                                {customListData[currentCustomListIndex]
                                  ?.customList?.length > 0 ? (
                                  [
                                    ...(customListData[currentCustomListIndex]
                                      .customList || []),
                                  ]?.map((ele) => (
                                    <>
                                      <tr className="odd:bg-white odd:dark:bg-gray-300 even:bg-gray-50 even:dark:bg-gray-300 border-b">
                                        <td className="px-6 py-4">
                                          {ele.customListName}
                                        </td>
                                        <td className="px-6 py-4">
                                          {ele.description}
                                        </td>
                                      </tr>
                                    </>
                                  ))
                                ) : (
                                  <tr className="odd:bg-white odd:dark:bg-gray-300 even:bg-gray-50 even:dark:bg-gray-300 border-b">
                                    <td className="px-6 py-4 flex justify center items-center text-nowrap">
                                      No List Found
                                    </td>
                                    <td className="px-6 py-4 text-nowrap">
                                      {" "}
                                      No Description Found
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                  <div className=" lg:w-[70%]  sm:h-full h-[25vh] bg-slate-100">
                    <div className="w-[80%] p-5">
                      <p className="font-semibold text-black text-sm mb-2">
                        Please Select the Project
                      </p>

                      <div></div>
                      <MultiSelect
                        options={options}
                        value={selected}
                        onChange={setSelected}
                        labelledBy={"Select"}
                        isCreatable={true}
                      />
                      <button
                        onClick={() => handleShareList()}
                        className="border px-3 py-2 bg-blue-400 hover:bg-blue-500 rounded-xl font-semibold text-white mt-3"
                      >
                        {isShareLoading ? "Loading..." : "Share"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isCustomLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50  z-40">
          <div className="bg-white rounded-lg p-5 w-auto">
            <div className="flex justify-center items-center gap-3">
              <span className="font-semibold text-md">Loading...</span>
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default MainListing;
