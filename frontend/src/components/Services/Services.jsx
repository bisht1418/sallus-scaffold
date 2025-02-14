import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { t } from "../../utils/translate";
import company from "../../Assets/company.png";
import materialIcon from "../../Assets/material-list.webp";
import { IoClose } from "react-icons/io5";
import LogCard from "../LogCard";
import no_data from "../../Assets/no_data_found.webp";
import {
  getApprovalFormByUserId,
  searchProjectLogs,
} from "../../Services/approvalFormService";
import { BsFilterRight } from "react-icons/bs";
import SubscriptionPage from "../SubscriptionPage";
import MySubscriptionPlan from "../../pages/MySubscriptionPlan";
import { FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import { createVisitorService } from "../../Services/visitorService";
const pdfLinkPath = require("../../Assets/salus_scaffold.pdf");
const pdfLinkPathNo = require("../../Assets/salus_scaffold_no.pdf");

const Services = () => {
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  const userId = useSelector((state) => state?.auth?.loggedInUser?._id);
  const [activeService, setActiveService] = useState(1);
  const [projectLogModal, setProjectLogModal] = useState(false);
  const [scaffoldLogData, setScaffoldLogData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isScaffoldLoading, setIsScaffoldLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [currentCheckBox, setCurrentCheckBox] = useState("all");
  const [scaffoldDetail, setScaffoldDetail] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    dismantled: 0,
  });
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [mySubscriptionPlan, setMySubscriptionPlan] = useState(false);
  const getScaffoldData = async () => {
    const response = await getApprovalFormByUserId(userId);
    setScaffoldLogData(response?.data);
    setFilteredData(response?.data);
    const data = response?.data;
    let active = 0;
    let inactive = 0;
    let dismantled = 0;
    data?.map((ele) => {
      if (ele.status === "active") {
        active++;
      } else if (ele.status === "inactive") {
        inactive++;
      } else {
        dismantled++;
      }
    });
    setScaffoldDetail({
      total: data?.length,
      active,
      inactive,
      dismantled,
    });
  };

  const handleMouseOver = (index) => {
    setActiveService(index);
  };

  const handleMouseDown = () => {
    setActiveService(0);
  };

  const handleBorders = (index) => {
    return {
      1: "lg:border-r border-b lg:border-r-[#CCCCCC] border-b-[#CCCCCC]",
      2: "lg:border-r border-b lg:border-r-[#CCCCCC] border-b-[#CCCCCC]",
      3: "border-b border-b-[#CCCCCC]",
      4: "lg:border-r border-b lg:border-r-[#CCCCCC] border-b-[#CCCCCC]",
      5: "lg:border-r border-b lg:border-r-[#CCCCCC] border-b-[#CCCCCC]",
      6: "border-b border-b-[#CCCCCC]",
      7: "lg:border-r lg:border-r-[#CCCCCC] border-b border-b-[#CCCCCC] ",
      8: "lg:border-r lg:border-r-[#CCCCCC]  border-b-[#CCCCCC]",
      9: "border-b-[#CCCCCC]",
      10: "lg:border-r lg:border-r-[#CCCCCC]",
      11: "border-t lg:border-r lg:border-r-[#CCCCCC] border-b",
      12: "border-t border-b",
      13: "border-t border-r",
    }[index];
  };

  const serviceData = [
    {
      icon: "/service-time-registation.svg",
      title: t("timeRegistration"),
      url: "#",
      message: t("comingsoon"),
    },
    {
      icon: "/service-check-list.svg",
      title: t("checklists"),
      url: "#",
    },
    {
      icon: "/service-forms.svg",
      title: t("forms"),
      url: "/forms",
    },
    {
      icon: "/service-observation.svg",
      title: t("observations"),
      url: "#",
    },
    {
      icon: "/services-procedures.svg",
      title: t("procedures"),
      url: "#",
      message: t("comingsoon"),
    },
    {
      icon: "/service-orders.svg",
      title: t("orders"),
      url: "#",
      message: t("comingsoon"),
    },
    {
      icon: "/service-pictures.svg",
      title: t("pictures"),
      url: "#",
    },
    {
      icon: "/service-filers.svg",
      title: t("filers"),
      url: "#",
    },
    {
      icon: "/service-inspection.svg",
      title: t("inspections"),
      url: "#",
      message: t("comingsoon"),
    },
    {
      icon: "/service-inspection.svg",
      title: t("service_material"),
      url: "#",
      view: "VIEW",
    },
    {
      icon: "/service-orders.svg",
      title: t("service_my_subscription"),
      url: "#",
      view: "MY_SUBSCRIPTION",
    },
    {
      icon: "/service-pictures.svg",
      title: t("service_subscription"),
      url: "#",
      view: "SUBSCRIPTION",
    },
    {
      icon: "/service-check-list.svg",
      title: t("service_change_password"),
      url: "#",
      view: "CHANGE_PASSWORD",
    },
    {
      icon: "/service-filers.svg",
      title: t("user_manual"),
      url: "#",
      view: "USER_MANUAL",
    },
  ];

  let debounceTimer;

  useEffect(() => {
    if (inputValue.trim() !== "") {
      delayedAPICall(inputValue);
    } else {
      setScaffoldLogData([]);
    }
    if (!inputValue) {
      getScaffoldData();
      setIsScaffoldLoading(false);
    }

    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  const delayedAPICall = (term) => {
    setIsScaffoldLoading(true);
    debounceTimer = setTimeout(async () => {
      try {
        setIsScaffoldLoading(true);
        const searchParams = {
          searchTerm: term,
        };
        const response = await searchProjectLogs(userId, searchParams);
        setFilteredData((prev) => response?.approvalForm);
      } catch (error) {
        setIsScaffoldLoading(false);
      } finally {
        setIsScaffoldLoading(false);
      }
    }, 1000);
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFilterModal = () => {
    setFilterModalOpen(!filterModalOpen);
  };

  const handleFilterData = (isChecked, isSelectedType) => {
    let filteredData;
    if (isChecked) {
      setCurrentCheckBox(isSelectedType);
      filteredData = scaffoldLogData?.filter(
        isSelectedType === "all"
          ? (ele) => ele
          : (ele) => ele.status === isSelectedType
      );
    } else {
      getScaffoldData();
    }
    setFilteredData(filteredData);
    setTimeout(() => {
      handleFilterModal();
    }, 100);
  };

  const scaffoldDetails = [
    { label: "Total", value: scaffoldDetail?.total },
    { label: "Active", value: scaffoldDetail?.active },
    { label: "Inactive", value: scaffoldDetail?.inactive },
    { label: "Dismantled", value: scaffoldDetail?.dismantled },
  ];

  const handleSortData = (sortValue) => {
    setFilteredData((prevValue) => {
      const sortedData = [...prevValue];

      const compareDates = (a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (sortValue === "asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      };
      sortedData.sort(compareDates);
      return sortedData;
    });
  };

  const secretKey = "123abc";

  const encryptData = (data) => {
    const timestamp = new Date().getTime(); // Adding timestamp for uniqueness
    const randomString = Math.random().toString(36).substring(2); // Adding random string for uniqueness
    const combinedData = { timestamp, randomString, data };
    const encryptedData = btoa(JSON.stringify(combinedData));
    const token = btoa(encryptedData + secretKey); // Concatenating with secret key for additional security
    return token;
  };

  const data = { isChangePassword: true };
  const token = encryptData(data);
  const nextPageUrl = `/search-email?token=${encodeURIComponent(token)}`;

  const handleDownload = async () => {
    const link = document.createElement("a");
    if (currentLanguage === "no") {
      link.href = pdfLinkPathNo;
    } else {
      link.href = pdfLinkPath;
    }
    link.download = "salus_scaffold_guide";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[white] pb-[100px] cursor-pointer">
      <div className="custom-container">
        <div className="pb-[50px] text-center">
          <p className="title-text">{t("whatWeDo")}</p>
          <p className="text-[16px] max-w-[980px] mx-auto text-center">
            {t("atSalusStillas")}
          </p>
        </div>
        <div className="pb-[50px] text-center">
          <div>
            <p className="title-text">{t("mycompany")}</p>
          </div>

          <div className={`p-[20px]  text-center h-full relative`}>
            <img className="w-[60px] m-auto mb-[10px]" src={company} alt="" />
            <p className="absolute top-0 left-[52%]">
              <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-400 text-white text-nowrap">
                Coming Soon...
              </span>
            </p>
            <p className={`medium-title "text-black" mb-[15px]`}>
              {t("mycompany")}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col lg:flex-row gap-[0px] flex-wrap">
          {serviceData?.map((service, index) => (
            <div
              key={index}
              // onMouseOver={() => {
              //   handleMouseOver(index + 1);
              // }}
              // onMouseOut={() => {
              //   handleMouseDown();
              // }}
              className={`w-full lg:w-1/3 lg:min-h-[134px]  ${handleBorders(
                index + 1
              )}`}
              onClick={(event) =>
                service.view === "VIEW"
                  ? setOpenModal(true)
                  : service.view === "LOGS"
                  ? setProjectLogModal(true)
                  : service.view === "SUBSCRIPTION"
                  ? setIsSubscriptionModalOpen(true)
                  : service.view === "MY_SUBSCRIPTION"
                  ? setMySubscriptionPlan(true)
                  : service.view === "CHANGE_PASSWORD"
                  ? navigate(nextPageUrl)
                  : service.view === "USER_MANUAL"
                  ? handleDownload()
                  : null
              }
            >
              <div
                onClick={() => {
                  navigate(service.url);
                }}
                className={`flex items-center justify-center m-[10px] h-[calc(100%-20px)]}`}
              >
                <div className="relative flex flex-col justify-between items-center h-full">
                  <div className={`p-[20px]  text-center h-full`}>
                    <img
                      className="w-[60px] m-auto mb-[10px]"
                      src={service?.icon}
                      alt=""
                    />
                    <p className={`medium-title "text-black" mb-[15px]`}>
                      {service?.title}
                    </p>
                  </div>
                  <div className="absolute right-[-70px] ">
                    {service?.message && (
                      <div
                        className={`small-title text-[green] mb-[10px] font-bold flex justify-center items-center gap-[3px]`}
                      >
                        <p>
                          <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-400 text-white text-nowrap">
                            Coming Soon...
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-400 bg-opacity-50 z-40">
          <div className="bg-white rounded-lg p-5 w-full max-w-[90vw] md:max-w-[50vw] h-auto min-h-[50vh] relative">
            <IoClose
              onClick={() => setOpenModal(false)}
              className="absolute top-[2%] right-[2%] text-[26px] cursor-pointer rounded-full border font-bold p-[2px]"
            />

            <div className="flex flex-col sm:flex-row flex-wrap mt-6">
              {/* Material List Section */}
              <div className="w-full sm:w-1/2 p-4 border-b sm:border-r sm:border-b-0 border-gray-300 flex justify-center">
                <Link
                  to={"/material-list/:projectId"}
                  className="text-center w-full"
                >
                  <div className="p-[20px]">
                    <img
                      className="w-[60px] m-auto mb-[10px]"
                      src={materialIcon}
                      alt="Material List Icon"
                    />
                    <p className="font-semibold text-[20px] text-black mb-[15px]">
                      Material List
                    </p>
                  </div>
                </Link>
              </div>

              {/* Add another section here if needed */}
            </div>
          </div>
        </div>
      )}

      {projectLogModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-400 bg-opacity-90  z-40 cursor-default">
          <div className="bg-white rounded-lg p-5 w-[95vw] h-[95vh] sm:w-[90vw] absolute min-w-[50vw] min-h-[50vh]">
            <IoClose
              onClick={() => setProjectLogModal(false)}
              className="absolute top-[2%] right-[2%] text-[26px] cursor-pointer rounded-full border font-bold hover:bg-gray-300"
            />
            <div className="flex flex-row flex-wrap mt-6 w-full h-[90%]  overflow-auto">
              <div className="w-full flex sm:flex-row flex-col justify-between items-center sm:px-5">
                <div className="w-5/6">
                  <label
                    for="default-search"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-black"
                  >
                    Search
                  </label>
                  <div className="relative">
                    <div>
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                          />
                        </svg>
                      </div>
                      <input
                        type="search"
                        id="default-search"
                        className="block w-full p-2 ps-10 text-black border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 font-semibold text-md"
                        placeholder="Search  Specific Location, Scaffold Number, Scaffold Name, Date"
                        required
                        onChange={handleChange}
                        value={inputValue}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex sm:justify-end justify-around w-full cursor-pointer relative mt-3 sm:mt-0">
                  <div className="border px-7 rounded-md">
                    <form
                      onChange={(e) => handleSortData(e.target.value)}
                      className="relative cursor-pointer"
                    >
                      <label for="underline_select" className="sr-only">
                        Sort the Data
                      </label>
                      <select
                        id="underline_select"
                        className=" block cursor-pointer py-1.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-black appearance-none dark:text-black dark:border-black focus:outline-none focus:ring-0 focus:border-gray-200 "
                      >
                        <option selected>Sort Option</option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                      <BsFilterRight className="absolute top-2 left-[-20px]" />
                    </form>
                  </div>
                  <div
                    onClick={() => handleFilterModal()}
                    className="flex justify-end items-center border py-1 px-4 mx-4 w-auto rounded-md gap-1"
                  >
                    <BsFilterRight />
                    <span className="font-semibold text-sm">Filter</span>
                    <span className="font-semibold text-sm rounded-[100%] border bg-green-400 px-2">
                      {filteredData?.length > 0 ? filteredData?.length : 0}
                    </span>
                  </div>
                  {filterModalOpen && (
                    <>
                      <div className="bg-white p-4 rounded-lg shadow-md w-40 absolute top-8 right-3 z-50">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-sm font-semibold">
                            Filter Options
                          </h2>
                          <button
                          //  onClick={onClose}
                          ></button>
                        </div>
                        <div className="space-y-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox mr-2"
                              checked={currentCheckBox === "all"}
                              onClick={(e) =>
                                handleFilterData(e.target.checked, "all")
                              }
                            />
                            <span className="text-sm">All</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox mr-2"
                              checked={currentCheckBox === "active"}
                              onClick={(e) =>
                                handleFilterData(e.target.checked, "active")
                              }
                            />
                            <span className="text-sm">Active</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox mr-2"
                              checked={currentCheckBox === "inactive"}
                              onClick={(e) =>
                                handleFilterData(e.target.checked, "inactive")
                              }
                            />
                            <span className="text-sm">Inactive</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox mr-2"
                              checked={currentCheckBox === "dismantled"}
                              onClick={(e) =>
                                handleFilterData(e.target.checked, "dismantled")
                              }
                            />
                            <span className="text-sm">Dismantled</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row w-full h-full p-5">
                <div
                  className={`border p-2 sm:py-[100px]  md:w-[22%] h-[20vh] sm:h-full bg-slate-300 flex flex-wrap justify-around sm:flex-col  items-center sm:gap-10 md:text-md sm:text-2xl text-xs sm:text-[18px] `}
                >
                  {scaffoldDetails?.map((detail, index) => (
                    <div
                      key={index}
                      className={`${
                        detail.label === "Active"
                          ? "text-green-700"
                          : detail.label === "Inactive"
                          ? "text-red-400"
                          : detail.label === "Dismantled"
                          ? "text-orange-400"
                          : "text-black"
                      } uppercase font-bold flex flex-col justify-center items-center sm:gap-2 gap-1 hover:opacity-90 cursor-pointer transition-transform duration-300 transform hover:scale-95 ease-out hover:ease-in`}
                    >
                      <div className="underline">{detail?.label}</div>
                      <div
                        className={`${
                          detail.label === "Active"
                            ? "!bg-green-700 text-white"
                            : detail.label === "Inactive"
                            ? "!bg-red-400 text-white"
                            : detail.label === "Dismantled"
                            ? "!bg-orange-400 text-white"
                            : "!bg-black !text-white"
                        } sm:w-11 w-5 sm:h-11 h-5 shrink-0 grow-0 rounded-full bg-slate-200 text-black-700 flex justify-center items-center`}
                      >
                        {detail?.value || 0}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border w-[80] sm:w-[77%] h-[200vh] sm:h-full bg-slate-100 overflow-auto py-10">
                  {isScaffoldLoading ? (
                    <div className="flex items-center justify-center w-full h-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-300 dark:border-gray-200">
                      <div className="px-4 py-2 text-md font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                        loading...
                      </div>
                    </div>
                  ) : filteredData && filteredData.length > 0 ? (
                    <div className="grid gap-10 px-10 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 ">
                      {filteredData?.map((ele) => (
                        <LogCard key={ele.id} data={ele} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-300 dark:border-gray-200">
                      <div className="px-4 py-2 text-md font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                        <img
                          src={no_data}
                          alt="no_image"
                          className="w-[20vw]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSubscriptionModalOpen && (
        <>
          <SubscriptionPage
            setIsSubscriptionModalOpen={setIsSubscriptionModalOpen}
            isSubscriptionModalOpen={isSubscriptionModalOpen}
          />
        </>
      )}

      {mySubscriptionPlan && (
        <>
          <MySubscriptionPlan
            mySubscriptionPlan={mySubscriptionPlan}
            setMySubscriptionPlan={setMySubscriptionPlan}
          />
        </>
      )}
    </div>
  );
};

export default Services;
