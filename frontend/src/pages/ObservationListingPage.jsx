import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import TopSection from "../components/forms/TopSection";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import {
  deleteObservation,
  getObservationById,
  updateObservation,
  updateStatusObservation,
} from "../Services/observationService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { t } from "../utils/translate";
import ObservationStatus from "../components/ObservationForm/ObservationStatus";
import no_data from "../Assets/noData.svg";
import { IoClose } from "react-icons/io5";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { BsTrash3 } from "react-icons/bs";
import { set } from "react-hook-form";
import { getProjectName } from "../Services/projectService";

function ObservationListing() {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const { accessLevel: roleOfUser } = useSelector((state) => state?.project);
  const { projectId } = useParams();
  const [loading, setLoading] = useState();
  const [isEditComment, setIsEditComment] = useState([]);
  const [observationData, setObservationData] = useState([]);
  const [visibleItems, setVisibleItems] = useState({
    latest: 5,
    under: 5,
    closed: 5,
  });
  const [currentId, setCurrentId] = useState();
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isStatus, setIsStatus] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentSelectedList, setCurrentSelectedList] = useState("");
  const [searchObservation, setSearchObservation] = useState("");
  const [searchObservationData, setSearchObservationData] = useState([]);
  const [dateRange, setDateRange] = useState("");
  const projectName = useSelector((store) => store?.project?.projectName);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    getObservationByIdApi();
  }, []);

  const getObservationByIdApi = async () => {
    try {
      setLoading(true);
      const response = await getObservationById(projectId);
      setObservationData(response?.data.filter((ele) => !ele?.isDeleted));
      setSearchObservationData(response?.data.filter((ele) => !ele?.isDeleted));
      const filterData = response?.data?.filter(
        (element, index) => !element?.isDeleted
      );
      setIsEditComment(filterData?.map((ele, ind) => false));
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };
  console.log("observationData", observationData);

  const filteredDataLatest = observationData?.filter(
    (item) => item.status === "latest"
  );
  const filteredDataunder = observationData?.filter(
    (item) => item.status === "under"
  );
  const filteredDataClosed = observationData?.filter(
    (item) => item.status === "closed"
  );

  const handleViewMore = (status) => {
    setIsStatus(status);
    setVisibleItems((prevVisibleItems) => ({
      ...prevVisibleItems,
      [status]: prevVisibleItems[status] + 5,
    }));
  };

  const handleSelect = (id, value) => {
    const updatedData = observationData?.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          isSelected: value,
        };
      } else {
        return item;
      }
    });
    setObservationData(updatedData);
  };

  const handleAddCommentClick = (id) => {
    const updatedData = observationData?.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          isInputOpen: !item.isInputOpen,
        };
      } else {
        return item;
      }
    });
    setObservationData(updatedData);
  };

  function formatDateTime(dateTimeStr) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString("en-US", options);
  }

  const handleSaveCommentClick = async (id, index) => {
    try {
      setIsSaveLoading(true);
      const data = observationData.filter((item) => item._id === id);
      await updateObservation(id, data[0]);
      getObservationByIdApi();
    } catch (error) {
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const response = await deleteObservation(id);
    if (response.success === true) {
      await getObservationByIdApi();
      toast.success(t("deletedSuccessfully"));
    } else {
      toast.error(t("thereIsSomeError"));
    }
  };

  const handleToggleDropdown = (index, event, status) => {
    const targetId = event.currentTarget.id;
    if (targetId == index) {
      setIsStatus(status);
      setCurrentId(index);
      setDropdownVisible(!dropdownVisible);
    }
  };

  const handleStatus = async (id, latest) => {
    const payload = {
      status: latest,
    };

    const response = await updateStatusObservation(id, payload);
    if (response.status === "success") {
      await getObservationByIdApi();
      setDropdownVisible(!dropdownVisible);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-Observation-listing/${projectId}/${id}`);
  };

  const isDateInRange = (date, range) => {
    const now = new Date();
    const observationDate = new Date(date);

    switch (range) {
      case "lastDay":
        return observationDate >= new Date(now.setDate(now.getDate() - 1));
      case "last7Days":
        return observationDate >= new Date(now.setDate(now.getDate() - 7));
      case "last30Days":
        return observationDate >= new Date(now.setDate(now.getDate() - 30));
      case "lastMonth":
        const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
        return (
          observationDate.getMonth() === lastMonth.getMonth() &&
          observationDate.getFullYear() === lastMonth.getFullYear()
        );
      case "lastYear":
        return (
          observationDate >= new Date(now.setFullYear(now.getFullYear() - 1))
        );
      default:
        return true; // If no range is provided, include all dates
    }
  };

  useEffect(() => {
    if (!observationData) return;

    const searchObservationLower = searchObservation?.toLowerCase();
    const filterData = observationData.filter((ele) => {
      if (!ele || !ele.observerDetails || !ele.status || !ele.createdAt)
        return false;

      const observerDetailLower =
        ele.observerDetails.observerDetail?.toLowerCase();
      const statusLower = ele.status?.toLowerCase();
      const matchesSearch =
        observerDetailLower?.includes(searchObservationLower) ||
        statusLower?.includes(searchObservationLower);
      const matchesDate = isDateInRange(ele.createdAt, dateRange);
      return matchesSearch && matchesDate;
    });

    setSearchObservationData(filterData);
  }, [searchObservation, dateRange, observationData]);

  console.log("filteredDataLatest", filteredDataLatest);
  console.log("filteredDataunder", filteredDataunder);
  console.log("filteredDataClosed", filteredDataClosed);

  return (
    <>
      <Header />
      <TopSection
        keys={projectId}
        title={t("observationOverview")}
        breadcrumData={[t("home"), projectName.toUpperCase(), t("observation")]}
      />
      <div className="pb-[50px] border-b border-b-[#CCCCCC]">
        <div className="custom-container">
          <div className="flex flex-col lg:flex-row gap-[30px] items-center justify-between text-center">
            <p className="title-text !text-md">{t("projectObservationList")}</p>
            <div className="relative">
              {(roleOfUser === 0 || roleOfUser === 1 || roleOfUser === 2) && (
                <Link
                  to={`/observation/${projectId}`}
                  className="bg-[#0072BB] botton-text rounded-[5px] px-[20px] py-[10px] text-white"
                >
                  {t("createObservationList")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pb-[50px]">
        <div className="pb-[30px] text-center mt-10">
          <p className="medium-title uppercase">{t("observationDetail")}</p>
        </div>

        <div className="flex flex-col lg:flex-row w-full justify-center items-center">
          <div className="w-full lg:w-[20%] border-b lg:border-b-0 lg:border-r border-[#CCCCCC]">
            <div className="flex justify-center items-center p-[20px]">
              <div
                onClick={() => {
                  setCurrentSelectedList("needAction");
                  setOpenModal(true);
                }}
                className="text-center  flex justify-center items-center flex-col cursor-pointer"
              >
                <p className="medium-title  text-[#0072BB] h-[40px] ">
                  {t("needsAction")}
                </p>
                <p className="medium-title text-center text-2xl text-white bg-red-500  w-12 h-12 flex items-center justify-center rounded-full border">
                  {filteredDataLatest?.length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[20%] border-b lg:border-b-0 lg:border-r border-[#CCCCCC]">
            <div className="flex justify-center items-center p-[20px]">
              <div
                onClick={() => {
                  setCurrentSelectedList("underControl");
                  setOpenModal(true);
                }}
                className="text-center  flex justify-center items-center flex-col cursor-pointer"
              >
                <p className="medium-title  text-[#0072BB] h-[40px]">
                  {t("underControl")}
                </p>
                <p className="medium-title text-center text-2xl text-white bg-yellow-500  w-12 h-12 flex items-center justify-center rounded-full border">
                  {filteredDataunder?.length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[20%] border-b lg:border-b-0 lg:border-r border-[#CCCCCC]">
            <div className="flex justify-center items-center p-[20px]">
              <div
                onClick={() => {
                  setCurrentSelectedList("completedObservation");
                  setOpenModal(true);
                }}
                className="text-center  flex justify-center items-center flex-col cursor-pointer"
              >
                <p className="medium-title text-[#0072BB] h-[40px] text-nowrap">
                  {t("completedObservation")}
                </p>
                <p className="medium-title text-center text-2xl text-white bg-green-500  w-12 h-12 flex items-center justify-center rounded-full border">
                  {filteredDataClosed?.length || 0}
                </p>
              </div>
            </div>
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
        <div className="custom-container">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-[370px]">
            <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
              <label for="table-search" className="sr-only">
                Search
              </label>
              <div className="relative  w-full justify-between items-center flex">
                <div className="w-1/2">
                  <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <input
                    onChange={(e) => setSearchObservation(e.target.value)}
                    type="text"
                    id="table-search"
                    className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-1/2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500  "
                    placeholder="Search for items"
                  />
                </div>

                <select
                  className="border px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer hover:focus:border-[#0081c8] focus:border-[#0081c8]"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option className="cursor-pointer" value="">
                    All dates
                  </option>
                  <option value="lastDay">Last Day</option>
                  <option value="last7Days">Last 7 Days</option>
                  <option value="last30Days">Last 30 Days</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="lastYear">Last Year</option>
                </select>
              </div>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 cursor-pointer">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Analysis List Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Last Edit
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>{" "}
                  {
                    roleOfUser !== 2 && (
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    )
                  }

                </tr>
              </thead>
              <tbody>
                {searchObservationData &&
                  searchObservationData?.map((item, index) => (
                    <tr
                      className={`border-b   hover:bg-gray-50 ${item?.status === "latest"
                          ? "bg-red-50 hover:bg-red-100"
                          : item?.status === "under"
                            ? "bg-yellow-50 hover:bg-yellow-100"
                            : "bg-green-50 hover:bg-green-100"
                        }`}
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                      >
                        <Link
                          to={`/edit-Observation-listing/${projectId}/${item?._id}`}
                        >
                          <p className="">
                            {item?.observerDetails?.observerDetail}
                          </p>
                        </Link>
                      </th>
                      <td className="px-6 py-4">
                        {formatDateTime(item?.updatedAt)}
                      </td>
                      <td
                        className={`px-6 py-4 font-bold ${item?.status === "latest"
                            ? "text-red-600"
                            : item?.status === "under"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                      >
                        {item?.status === "under"
                          ? "Under Control"
                          : item?.status === "latest"
                            ? "Need Action"
                            : "Completed"}
                      </td>
                      {
                        roleOfUser !== 2 && (
                          <td className="relative px-6 py-4">
                            <div className="relative">
                              <button>
                                {item.isSelected ? (
                                  <BsTrash3 id={index} color="#FF4954" size={20} />
                                ) : (
                                  <>
                                    <MdOutlineMoreHoriz
                                      id={index}
                                      onClick={(event) =>
                                        handleToggleDropdown(
                                          index,
                                          event,
                                          item?.status
                                        )
                                      }
                                      size={20}
                                    />
                                    {dropdownVisible &&
                                      currentId === index &&
                                      item?.status === isStatus && (
                                        <div className="absolute top-[10px] right-[150px] z-99999 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                          {roleOfUser === 0 && (
                                            <>
                                              <button
                                                onClick={() =>
                                                  handleDelete(item._id)
                                                }
                                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none"
                                              >
                                                {t("delete")}
                                              </button>
                                              <button
                                                onClick={() => handleEdit(item._id)}
                                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none"
                                              >
                                                {t("edit")}
                                              </button>

                                              {item?.status !==
                                                "Observation Need Action" && (
                                                  <>
                                                    <button
                                                      onClick={() =>
                                                        handleStatus(
                                                          item._id,
                                                          "latest"
                                                        )
                                                      }
                                                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none"
                                                    >
                                                      {t("NeedAction")}
                                                    </button>
                                                  </>
                                                )}
                                              {item?.status !==
                                                "Observation Under Control" && (
                                                  <>
                                                    <button
                                                      onClick={() =>
                                                        handleStatus(
                                                          item._id,
                                                          "under"
                                                        )
                                                      }
                                                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none"
                                                    >
                                                      {t("UnderControl")}
                                                    </button>
                                                  </>
                                                )}
                                              {item?.status !==
                                                "Observation Completed" && (
                                                  <>
                                                    <button
                                                      onClick={() =>
                                                        handleStatus(
                                                          item._id,
                                                          "closed"
                                                        )
                                                      }
                                                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none"
                                                    >
                                                      {t("observationCompleted")}
                                                    </button>
                                                  </>
                                                )}
                                            </>
                                          )}
                                        </div>
                                      )}
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        )
                      }

                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {openModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80  z-40  ">
          <div className="bg-white rounded-lg p-5  w-[100vw] h-[100vh]">
            <IoClose
              onClick={() => setOpenModal(false)}
              className="absolute top-[3%] right-[2%] border-black text-[26px] cursor-pointer rounded-full border font-bold"
            />
            <button
              onClick={() => setOpenModal(false)}
              className="font-bold text-sm text-white bg-[#0081c8] rounded-lg px-3 py-2"
            >
              Back
            </button>

            <div className="w-full h-full shadow-2xl">
              {filteredDataLatest.length > 0 && (
                <>
                  <ObservationStatus
                    observationData={observationData}
                    loading={loading}
                    projectId={projectId}
                    filteredDataLatest={
                      currentSelectedList === "needAction"
                        ? filteredDataLatest
                        : currentSelectedList === "underControl"
                          ? filteredDataunder
                          : filteredDataClosed
                    }
                    currentId={currentId}
                    handleStatus={handleStatus}
                    handleDelete={handleDelete}
                    roleOfUser={roleOfUser}
                    isEditComment={isEditComment}
                    visibleItems={visibleItems?.latest}
                    isSaveLoading={isSaveLoading}
                    handleViewMore={handleViewMore}
                    handleSelect={handleSelect}
                    handleAddCommentClick={handleAddCommentClick}
                    formatDateTime={formatDateTime}
                    handleSaveCommentClick={handleSaveCommentClick}
                    handleToggleDropdown={handleToggleDropdown}
                    setObservationData={setObservationData}
                    setCurrentId={setCurrentId}
                    dropdownVisible={dropdownVisible}
                    status={
                      currentSelectedList === "needAction"
                        ? "Observation Need Action"
                        : currentSelectedList === "underControl"
                          ? "Observation Under Control"
                          : "Observation Completed"
                    }
                    isStatus={isStatus}
                    handleEdit={handleEdit}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default ObservationListing;
