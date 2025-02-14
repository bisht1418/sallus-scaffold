import React, { useState, useEffect } from "react";
import TopSection from "../components/forms/TopSection";
import { GoSearch } from "react-icons/go";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams, Link } from "react-router-dom";
import {
  deleteMaterialListWithProjectService,
  getMaterialListSearchData,
  getProjectTransfer,
  getTransferProject,
  materialListWithProjectCreateService,
  materialListWithProjectGetService,
  updateMaterialListWithProjectService,
  updateStatusMaterialList,
} from "../Services/materialListWithProjectService";
import {
  getProjectByIdService,
  getProjectName,
  scaffoldingWeight,
} from "../Services/projectService";
import { toast } from "react-toastify";
import { clearCreateMaterialList } from "../Redux/Slice/materialListSlice";
import { store } from "../Redux/store";
import no_data from "../Assets/noData.svg";
import { useSelector } from "react-redux";
import { t } from "../utils/translate";
import { IoFilter } from "react-icons/io5";
import StatusMaterialList from "../components/materialLIst/StatusMaterialList";
import ModalTransfer from "../components/materialLIst/ModalTransfer";
import ModalPermission from "../components/materialLIst/ModalPermisssion";

const MaterialListingPage = () => {
  const { accessLevel: roleOfUser } = useSelector((state) => state?.project);
  const projectName = useSelector((store) => store?.project?.projectName);
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const { projectId } = useParams();
  const [materialListingData, setMaterialListingData] = useState([]);
  const [projectNumber, setProjectNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [visibleItems, setVisibleItems] = useState({
    latest: 5,
    under: 5,
    closed: 5,
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [isEditComment, setIsEditComment] = useState([]);
  const [isStatus, setIsStatus] = useState("");
  store.dispatch(clearCreateMaterialList());
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMaterialList, SetFilterMaterialList] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
    getMaterialListWithProjectId();
    getProjectDetailById(projectId);
  }, [searchTerm]);

  const getMaterialListWithProjectId = async () => {
    try {
      if (searchTerm?.length === 0) {
        setLoading(true);

        const response = await materialListWithProjectGetService(projectId);

        const sortedData = response?.data
          .filter((ele) => !ele?.isDeleted)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setMaterialListingData(sortedData);
        const filterData = response?.data?.filter(
          (element, index) => !element?.isDeleted
        );
        setIsEditComment(filterData?.map((ele, ind) => false));

        if (response?.data?.length > 0) {
          setLoading(false);
        }
      }
    } catch (Error) {
      return Error;
    } finally {
      setLoading(false);
    }
  };

  async function getProjectDetailById(id) {
    try {
      const response = await getProjectByIdService(id);
      const projectNumber = response?.data?.project?.projectNumber;
      setProjectNumber(projectNumber);
    } catch (error) {
      return error;
    }
  }

  const handleAddCommentClick = (id) => {
    const updatedData = materialListingData.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          isInputOpen: !item.isInputOpen,
        };
      } else {
        return item;
      }
    });
    setMaterialListingData(updatedData);
  };

  const handleSaveCommentClick = async (id, index) => {
    try {
      setIsSaveLoading(true);
      const data = materialListingData.filter((item) => item._id === id);
      await updateMaterialListWithProjectService(id, data[0]);
      getMaterialListWithProjectId();
    } catch (error) {
      return error;
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleSelect = (id, value) => {
    const updatedData = materialListingData.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          isSelected: value,
        };
      } else {
        return item;
      }
    });
    setMaterialListingData(updatedData);
  };

  function formatDateTime(dateTimeStr) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString("en-US", options);
  }

  const handleViewMore = (status) => {
    setIsStatus(status);
    setVisibleItems((prevVisibleItems) => ({
      ...prevVisibleItems,
      [status]: prevVisibleItems[status] + 5,
    }));
  };
  const handleDelete = async (id) => {
    const response = await deleteMaterialListWithProjectService(id);
    if (response?.data?.status === "success") {
      await getMaterialListWithProjectId();
      toast.success(t("deletedSuccessfully"));
    } else {
      toast.error(t("thereIsSomeError"));
    }
  };

  const handleToggleDropdown = (index, event, status, clickToClose) => {
    const targetId = event.currentTarget.id;
    if (targetId == index) {
      setIsStatus(status);
      setCurrentId(index);
      setDropdownVisible(!dropdownVisible);
    }

    if (clickToClose) {
      setDropdownVisible(false);
    }
  };
  const filteredDataLatest = materialListingData?.filter(
    (item) => item.status === "latest"
  );
  const filteredDataunder = materialListingData?.filter(
    (item) => item.status === "under"
  );
  const filteredDataClosed = materialListingData?.filter(
    (item) => item.status === "closed"
  );
  const handleStatus = async (id, latest) => {
    const payload = {
      status: latest,
    };

    const response = await updateStatusMaterialList(id, payload);
    if (response.status === "success") {
      await getMaterialListWithProjectId();
      setDropdownVisible(!dropdownVisible);
    }
  };
  useEffect(() => {
    if (searchTerm.trim() !== "") {
      delayedAPICall(searchTerm);
    } else {
      SetFilterMaterialList([]);
    }
    if (searchTerm !== "") {
      setLoading(false);
    }

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  let debounceTimer;

  const delayedAPICall = (term) => {
    setLoading(true);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const response = await getMaterialListSearchData(term, projectId);
        SetFilterMaterialList(response?.data?.materialList);
        setMaterialListingData(response?.data?.materialList);
      } catch (error) {
        setLoading(false);
      } finally {
        // setLoading(false);
      }
    }, 1000);
  };
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };
  const [isOpen, SetIsOpen] = useState(false);
  const [transferId, setTransferId] = useState("");
  const handleTransfer = (data) => {
    setTransferId(data);
    SetIsOpen(!isOpen);
  };
  const [permisionOpen, setPermisionOpen] = useState(false);
  const [permisionId, setPermissionId] = useState("");

  const id = useSelector((state) => state?.auth?.loggedInUser?._id);
  const fetchTransferProject = async () => {
    const response = await getTransferProject(id);
  };
  useEffect(() => {
    fetchTransferProject();
  }, [id]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchTermModel, setSearchTermModel] = useState("");
  const [loadingModel, setLoadingModel] = useState(false);
  const [newTransferData, setNewTransferData] = useState(null);
  const projectTransfer = useSelector(
    (state) => state?.materialListWithProject?.projectTransfer
  );
  const handleRowClick = (index) => {
    setSelectedRow(index === selectedRow ? null : index);
  };
  useEffect(() => {
    if (searchTerm.trim() == "") {
      delayedAPICallModel(searchTerm);
    } else {
      delayedAPICallModel(searchTerm);
    }

    if (!searchTerm) {
      setLoadingModel(false);
    }

    return () => clearTimeout(debounceTimer);
  }, [searchTermModel]);
  let debounceTimerModel;
  const delayedAPICallModel = (term) => {
    setLoadingModel(true);
    clearTimeout(debounceTimerModel);
    debounceTimerModel = setTimeout(async () => {
      try {
        await getProjectTransfer(searchTermModel);
      } catch (error) {
        setLoadingModel(false);
      } finally {
        setLoadingModel(false);
      }
    }, 1000);
  };

  const handleSearchModel = (e) => {
    const term = e.target.value;
    setSearchTermModel(term);
  };
  const handleTransferModel = (id, projectName) => {
    const newTransferData = {
      ...transferId,
      projectId: id,
      projectName: projectName,
    };
    setNewTransferData(newTransferData);
  };
  const handleTransferMaterialLists = async () => {
    const payload = {
      materialList: newTransferData?.materialList,
      projectId: newTransferData?.projectId,
      customerSignature: newTransferData?.customerSignature,
      deliverySignature: newTransferData?.deliverySignature,
      customerNameSignature: newTransferData?.customerNameSignature,
      deliveryNameSignature: newTransferData?.deliveryNameSignature,
      totalWeight: newTransferData?.totalWeight,
      transferMaterialListsPermisssion:
        newTransferData?.transferMaterialListsPermisssion,
      transferWeight: "+" + +newTransferData?.totalWeight,
      comments: newTransferData?.comments,
      customerName: newTransferData?.customerName,
      materialListName: newTransferData?.materialListName,
      projectName: newTransferData?.projectName,
      projectDate: newTransferData?.projectDate,
      transferProjectId: transferId?.projectId,
    };
    if (transferId?.transferMaterialListsPermisssion) {
      if (newTransferData?.projectId !== transferId?.projectId) {
        const response = await materialListWithProjectCreateService(payload);
        let id = response?.data?.data?._id;
        if (response?.data?.status === "success") {
          const response = await updateMaterialListWithProjectService(
            transferId?._id,
            {
              transferWeight: -newTransferData?.totalWeight,
              transferMaterialListsPermisssion: false,
            }
          );
          if (response?.data?.status === "success") {
            // const response = await updateMaterialListWithProjectService(id, { transferMaterialListsPermisssion: });
            await deleteMaterialListWithProjectService(transferId?._id);
          }
          toast.success("Material lists Transfer Sucessfully");
          getMaterialListWithProjectId();
          SetIsOpen(!isOpen);
        } else {
          toast.error("Something wrong");
        }
      } else {
        toast.error("Material lists not transfer in same project");
        SetIsOpen(!isOpen);
      }
    } else {
      setPermissionId(transferId);
      setPermisionOpen(!permisionOpen);
      SetIsOpen(!isOpen);
    }
  };
  return (
    <div>
      <Header />
      <TopSection
        title={t("material")}
        breadcrumData={[t("home"), projectName.toUpperCase(), t("material")]}
      />
      {isOpen ? (
        <>
          <ModalTransfer
            setShowModal={SetIsOpen}
            handleSearchModel={handleSearchModel}
            loadingModel={loadingModel}
            projectTransfer={projectTransfer}
            handleTransferModel={handleTransferModel}
            handleRowClick={handleRowClick}
            selectedRow={selectedRow}
            handleTransferMaterialLists={handleTransferMaterialLists}
          />
        </>
      ) : null}
      {permisionOpen ? (
        <>
          <ModalPermission
            setShowModalPermission={setPermisionOpen}
            transferId={transferId}
          />
        </>
      ) : null}
      <div className="pb-[50px] border-b border-b-[#CCCCCC]">
        <div className="custom-container">
          <div className="flex flex-col sm:flex-row gap-[30px] sm:items-center sm:justify-between sm:text-center justify-start items-start">
            <p className="title-text sm:!text-2xl !text-[18px]">
              {t("projectMaterialList")}
            </p>

            {roleOfUser === 0 || roleOfUser === 1 ? (
              <div className="relative">
                <Link
                  to={`/material-list/${projectId}`}
                  className="bg-[#0072BB] botton-text rounded-[5px] px-[20px] py-[10px] text-white"
                >
                  {t("createMaterialList")}
                </Link>
              </div>
            ) : null}
          </div>
          <div className="relative w-full mt-5">
            <GoSearch
              className="absolute top-[50%] left-[2%] translate-y-[-50%]"
              size={24}
              color="#000000"
            />
            <input
              onChange={handleSearch}
              className="border border-[#CCCCCC] "
              placeholder={t("Searchformaterial")}
              type="text"
            />
            <button>
              <IoFilter
                className="absolute top-[50%] right-[2%] translate-y-[-50%]"
                size={24}
                color="#000000"
              />
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-center flex justify-center  h-[50vh]">
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
      ) : (
        <>
          {materialListingData?.length > 0 ? (
            <>
              {filteredDataLatest?.length > 0 && (
                <>
                  <StatusMaterialList
                    materialListingData={filteredDataLatest}
                    handleAddCommentClick={handleAddCommentClick}
                    currentId={currentId}
                    handleDelete={handleDelete}
                    handleSaveCommentClick={handleSaveCommentClick}
                    visibleItems={visibleItems?.latest}
                    projectNumber={projectNumber}
                    handleToggleDropdown={handleToggleDropdown}
                    handleViewMore={handleViewMore}
                    formatDateTime={formatDateTime}
                    handleSelect={handleSelect}
                    isEditComment={isEditComment}
                    loading={loading}
                    isSaveLoading={isSaveLoading}
                    setMaterialListingData={setMaterialListingData}
                    setCurrentId={setCurrentId}
                    dropdownVisible={dropdownVisible}
                    roleOfUser={roleOfUser}
                    status={"Latest Material Lists"}
                    isStatus={isStatus}
                    handleStatus={handleStatus}
                    projectId={projectId}
                    handleTransfer={handleTransfer}
                    setDropdownVisible={setDropdownVisible}
                  />
                </>
              )}
              {filteredDataunder?.length > 0 && (
                <>
                  <StatusMaterialList
                    materialListingData={filteredDataunder}
                    handleAddCommentClick={handleAddCommentClick}
                    currentId={currentId}
                    handleDelete={handleDelete}
                    handleSaveCommentClick={handleSaveCommentClick}
                    visibleItems={visibleItems?.under}
                    projectNumber={projectNumber}
                    handleToggleDropdown={handleToggleDropdown}
                    handleViewMore={handleViewMore}
                    formatDateTime={formatDateTime}
                    handleSelect={handleSelect}
                    isEditComment={isEditComment}
                    loading={loading}
                    isSaveLoading={isSaveLoading}
                    setMaterialListingData={setMaterialListingData}
                    setCurrentId={setCurrentId}
                    dropdownVisible={dropdownVisible}
                    roleOfUser={roleOfUser}
                    status={"Under Progess Material Lists"}
                    isStatus={isStatus}
                    handleStatus={handleStatus}
                    projectId={projectId}
                    handleTransfer={handleTransfer}
                    setDropdownVisible={setDropdownVisible}
                  />
                </>
              )}
              {filteredDataClosed?.length > 0 && (
                <>
                  <StatusMaterialList
                    materialListingData={filteredDataClosed}
                    handleAddCommentClick={handleAddCommentClick}
                    currentId={currentId}
                    handleDelete={handleDelete}
                    handleSaveCommentClick={handleSaveCommentClick}
                    visibleItems={visibleItems?.closed}
                    projectNumber={projectNumber}
                    handleToggleDropdown={handleToggleDropdown}
                    handleViewMore={handleViewMore}
                    formatDateTime={formatDateTime}
                    handleSelect={handleSelect}
                    isEditComment={isEditComment}
                    loading={loading}
                    isSaveLoading={isSaveLoading}
                    setMaterialListingData={setMaterialListingData}
                    setCurrentId={setCurrentId}
                    dropdownVisible={dropdownVisible}
                    roleOfUser={roleOfUser}
                    status={"closed Material Lists"}
                    isStatus={isStatus}
                    handleStatus={handleStatus}
                    projectId={projectId}
                    handleTransfer={handleTransfer}
                    setDropdownVisible={setDropdownVisible}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-center items-center mt-[10px]">
                <img src={no_data} alt="no data found" className="w-[70%]" />
              </div>
            </>
          )}
        </>
      )}
      <Footer />
    </div>
  );
};

export default MaterialListingPage;
