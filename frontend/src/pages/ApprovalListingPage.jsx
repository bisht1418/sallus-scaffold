import React, { useState, useEffect } from "react";
import TopSection from "../components/forms/TopSection";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getApprovalListingPageByProjectId } from "../Services/approvalListingPageService";
import {
  deleteApprovalFormService,
  getApprovalFormByUserId,
  getApprovalFormSearchData,
  searchProjectLogs,
} from "../Services/approvalFormService";
import { toast } from "react-toastify";
import ApprovalFormSlider from "../components/ApprovalForm/ApprovalFormSlider";
import no_data from "../Assets/no_data_found.webp";
import { t } from "../utils/translate";
import { IoClose } from "react-icons/io5";
import LogCard from "../components/LogCard";
import DateRangePicker from "../components/DateRangePicker";
import { IoListOutline } from "react-icons/io5";
import { getProjectName } from "../Services/projectService";
import { store } from "../Redux/store";
import { Box, Button } from "@mui/material";

const ApprovalListingPage = () => {
  const userId = useSelector((state) => state?.auth?.loggedInUser?._id);

  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const { accessLevel: roleOfUser } = useSelector((state) => state?.project);
  const [filesData, setFilesData] = useState([]);
  const [loading, setloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApprovalForm, setFilteredApprovalForm] = useState([]);
  const { id: projectId } = useParams();
  const [isScaffoldLoading, setIsScaffoldLoading] = useState(false);
  const [projectLogModal, setProjectLogModal] = useState(false);
  const [currentCheckBox, setCurrentCheckBox] = useState("all");
  const [scaffoldLogData, setScaffoldLogData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterDateModalOpen, setFilterDateModalOpen] = useState(false);
  const [onDataUnits, setOnDataUnits] = useState({});
  const [currentUnits, setCurrentUnits] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [scaffoldDetail, setScaffoldDetail] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    disassembled: 0,
  });

  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const handleDateRangeChange = (start, end) => {
    setDateRange({ start, end });
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      delayedAPICall(searchTerm);
    } else {
      setFilteredApprovalForm([]);
    }

    if (!searchTerm) {
      setloading(false);
    }

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getApprovalData(projectId);
  }, [projectId]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const getApprovalData = async (id) => {
    try {
      setloading(true);
      const response = await getApprovalListingPageByProjectId(id);
      const approvalData = response?.data?.data;
      const filterData = approvalData?.filter(
        (element, index) => !element?.isDeleted
      );
      setFilesData(
        filterData
          ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((element) => {
            return {
              ...element,
              isInputOpen: false,
              isSelected: false,
            };
          })
      );
    } catch (Error) {
      setloading(false);
      return Error;
    } finally {
      setloading(false);
    }
  };

  const handleDelete = async (id) => {
    const response = await deleteApprovalFormService(id);
    if (response?.data?.status === "success") {
      await getApprovalData(projectId);
      toast.success(t("deletedSuccessfully"));
    } else {
      toast.error(t("thereIsSomeError"));
    }
  };

  let debounceTimer;

  const delayedAPICall = (term) => {
    setloading(true);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const response = await getApprovalFormSearchData(projectId, term);
        setFilteredApprovalForm(response?.data?.approvalForm);
      } catch (error) {
        setloading(false);
      } finally {
        setloading(false);
      }
    }, 1000);
  };

  const refreshtData = async () => {
    await getApprovalData(projectId);
  };

  const getScaffoldData = async () => {
    try {
      const response = await getApprovalListingPageByProjectId(projectId);
      const data = response?.data?.data?.filter((ele) => !ele?.isDeleted) || [];
      console.log("data=====>>>>", data)
      setScaffoldLogData(data);
      setFilteredData(data);

      const statusCounts = data.reduce(
        (counts, ele) => {
          if (ele?.status === "active") {
            counts.active++;
          } else if (ele?.status === "inactive" && roleOfUser !== 2) {
            counts.inactive++;
          } else if (roleOfUser !== 2) {
            counts.disassembled++;
          }
          return counts;
        },
        { active: 0, inactive: 0, disassembled: 0 }
      );

      setScaffoldDetail({
        total: data.length,
        ...statusCounts,
      });
    } catch (error) {
      console.error("Error fetching scaffold data:", error);
    }
  };

  function calculateTotalsWeightRange(entries) {

    let totals = {};

    entries?.forEach(entry => {

      entry.scaffoldName?.forEach(scaffold => {

        if (scaffold.measurements) {
          // First pass: Collect all unique measurement types
          Object.keys(scaffold.measurements).forEach(measurementType => {
            if (!totals.hasOwnProperty(measurementType)) {
              totals[measurementType] = 0;
            }
          });
          // Second pass: Calculate totals for each measurement type
          Object.entries(scaffold.measurements).forEach(([measurementType, measurements]) => {

            if (Array.isArray(measurements)) {
              measurements.forEach(measurement => {
                // Handle different measurement types
                if (measurementType === 'm2') {
                  const length = parseFloat(measurement.length) || 0;
                  const width = parseFloat(measurement.width) || 0;
                  totals[measurementType] += length * width;
                }
                else if (measurementType === 'lm') {
                  const length = parseFloat(measurement.length) || 0;
                  totals[measurementType] += length;
                }
                else if (measurementType === 'm3') {
                  const length = parseFloat(measurement.length) || 0;
                  const width = parseFloat(measurement.width) || 0;
                  const height = parseFloat(measurement.height) || 0;
                  totals[measurementType] += length * width * height;
                }
                else if (measurementType === 'hm') {
                  const height = parseFloat(measurement.height) || 0;
                  totals[measurementType] += height;
                }
                else if (measurement.value !== undefined) {
                  // Handle custom units (kg, rent, volume, etc.)
                  const value = parseFloat(measurement.value) || 0;
                  totals[measurementType] += value;
                }
              });
            }
          });
        }
      });
    });

    return totals;
  }

  const handleFilterData = async (isChecked, isSelectedType) => {
    let filteredData;
    if (isChecked) {
      setCurrentCheckBox(isSelectedType);
      filteredData = scaffoldLogData?.filter(
        isSelectedType === "all"
          ? (ele) => ele
          : (ele) => ele.status === isSelectedType
      );
      console.log("filteredData", filteredData)
    } else {
      getScaffoldData();
    }
    setFilteredData(filteredData);
    const totalWeightRange = calculateTotalsWeightRange(filteredData);
    console.log("totalWeightRange", totalWeightRange)
    setOnDataUnits(totalWeightRange);

    setTimeout(() => {
      handleFilterModal();
    }, 100);
  };

  const handleFilterDateData = (isChecked, isSelectedType) => {
    let filteredData;
    if (isChecked) {
      setCurrentCheckBox(isSelectedType);
      filteredData = filterByDateRange(scaffoldLogData, isSelectedType);
    } else {
      getScaffoldData();
    }
    setFilteredData(filteredData);
    setTimeout(() => {
      handleFilterDateModal();
    }, 100);
  };

  const handleFilterModal = () => {
    setFilterModalOpen(!filterModalOpen);
  };

  const handleFilterDateModal = () => {
    setFilterDateModalOpen(!filterDateModalOpen);
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

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

  const scaffoldDetails = [
    { label: "Total", value: scaffoldDetail?.total },
    { label: "Active", value: scaffoldDetail?.active },
    { label: "Inactive", value: scaffoldDetail?.inactive },
    { label: "Dismantle", value: scaffoldDetail?.disassembled },
  ];

  let debounceTimerForLog;
  useEffect(() => {
    if (inputValue.trim() !== "") {
      delayedAPICallForLog(inputValue);
    } else {
      setScaffoldLogData([]);
    }
    if (!inputValue) {
      getScaffoldData();
      setIsScaffoldLoading(false);
    }

    return () => clearTimeout(debounceTimerForLog);
  }, [inputValue]);

  const delayedAPICallForLog = (term) => {
    setIsScaffoldLoading(true);
    debounceTimerForLog = setTimeout(async () => {
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

  const handleDateSearch = async (e) => {
    const searchParams = {
      searchTerm: e.target.value,
    };
    const response = await searchProjectLogs(userId, searchParams);
    setFilteredData((prev) => response?.approvalForm);
  };

  function filterByDateRange(
    data,
    rangeType,
    startDate = null,
    endDate = null
  ) {
    const now = new Date();
    let start, end;

    switch (rangeType) {
      case "day":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case "week":
        start = new Date(now.setDate(now.getDate() - now.getDay()));
        end = new Date(now.setDate(now.getDate() - now.getDay() + 7));
        break;
      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case "year":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear() + 1, 0, 1);
        break;
      case "range":
        if (!startDate || !endDate) {
          throw new Error(
            "For 'range' type, both startDate and endDate must be provided."
          );
        }
        start = new Date(startDate);
        end = new Date(endDate);
        break;
      default:
        throw new Error(
          "Invalid range type. Use 'day', 'week', 'month', 'year', or 'range'."
        );
    }

    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate < end;
    });
  }

  if (dateRange?.start && dateRange?.end) {
    const { start, end } = dateRange;
    const formateStartDate = new Date(start).toISOString().slice(0, 10);
    const formateEndDate = new Date(end).toISOString().slice(0, 10);
    const filteredDataRange = filterByDateRange(
      scaffoldLogData,
      "range",
      formateStartDate,
      formateEndDate
    );
    setFilteredData(filteredDataRange);
    setDateRange({ start: null, end: null });
  }

  function parseDate(dateStr) {
    return new Date(dateStr);
  }

  function segregateData(data) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const periods = {
      today: [],
      week: [],
      month: [],
      year: [],
    };

    data.forEach((entry) => {
      const entryDate = parseDate(entry.createdAt);
      if (entryDate >= startOfToday) periods.today.push(entry);
      if (entryDate >= startOfWeek) periods.week.push(entry);
      if (entryDate >= startOfMonth) periods.month.push(entry);
      if (entryDate >= startOfYear) periods.year.push(entry);
    });

    return periods;
  }

  function calculateTotals(periodEntries) {
    const totals = { m2: 0, m3: 0, lm: 0, hm: 0 };
    periodEntries.forEach((entry) => {
      entry.sizeScaffold.forEach((scaffold) => {
        totals[scaffold.key] += parseInt(scaffold.value, 10);
      });
    });
    return totals;
  }

  function getTotals(data) {
    const segregatedData = segregateData(data);
    return {
      today: calculateTotals(segregatedData.today),
      week: calculateTotals(segregatedData.week),
      month: calculateTotals(segregatedData.month),
      year: calculateTotals(segregatedData.year),
    };
  }

  useEffect(() => {
    if (scaffoldLogData.length > 0) {
      const activeScaffolds = scaffoldLogData.filter(
        (ele) => ele.status === "active"
      );
      const totals = getTotals(activeScaffolds);
      setOnDataUnits(totals);
    }
  }, [scaffoldLogData, currentUnits]);

  const isMobile = () => {
    return window.innerWidth < 768;
  };
  const [isMobileView, setIsMobileView] = useState(isMobile());
  const [rightHamburger, setRightHamburger] = useState(false);
  const [leftHamburger, setLeftHamburger] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const projectName = useSelector((store) => store?.project?.projectName);

  const openNewTab = () => {
    window.open(`/volume/${projectId}`, "_blank");
  };

  const openNewTabRent = () => {
    window.open(`/rental/${projectId}`, "_blank");
  }

  const openPriceTab = () => {
    window.open(`/price/${projectId}`, "_blank");
  };

  useEffect(() => {
    if (projectLogModal) {
      handleFilterData(true, "all")
    }
  }, [projectLogModal])

  return (
    <>
      {projectLogModal ? (
        <div
          style={{ "z-index": "99" }}
          className="fixed inset-0 flex justify-center items-center bg-gray-400 bg-opacity-90  cursor-default"
        >
          <div
            className={`bg-white z-50 rounded-lg p-5 w-[90vw] h-[90vh] absolute overflow-hidden  ${isMobileView ? "overflow-hidden" : "overflow-hidden"
              }`}
          >
            <IoClose
              onClick={() => setProjectLogModal(false)}
              className="absolute top-[1%] right-[1%] text-[26px] cursor-pointer  border-black font-bold hover:bg-gray-100"
            />

            <div className="m-0 relative">
              <div
                className={`absolute top-6 h-[50px] flex justify-between items-center ${isMobileView ? "w-full flex flex-col" : "w-[calc(100%-200px)]"
                  }  `}
              >
                <div className={` ${isMobileView ? "w-full" : "w-1/2"}`}>
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
                        className="block w-full p-3 text-sm text-black placeholder:text-black outline-none ps-10 border border-black  rounded-lg "
                        placeholder={t("scaffold_log_search")}
                        required
                        onChange={handleChange}
                        value={inputValue}
                      />
                    </div>
                  </div>
                </div>
                <div className={`${isMobileView && "hidden"}`}>
                  <DateRangePicker
                    onDateRangeChange={handleDateRangeChange}
                    dateRange={dateRange}
                  />
                </div>
                {isMobileView && !leftHamburger && (
                  <div className="absolute top-12 left-[-2px] ">
                    <IoListOutline
                      onClick={() => {
                        setLeftHamburger(true);
                        setRightHamburger(false);
                      }}
                      className="text-2xl font-bold cursor-pointer"
                    />
                  </div>
                )}
                {isMobileView && !rightHamburger && (
                  <div className="absolute top-12 right-[2px] ">
                    <IoListOutline
                      onClick={() => {
                        setRightHamburger(true);
                        setLeftHamburger(false);
                      }}
                      className="text-2xl font-bold cursor-pointer rotate-180"
                    />
                  </div>
                )}
              </div>

              <div
                onClick={() => setLeftHamburger(false)}
                className={`${isMobileView
                  ? `${leftHamburger
                    ? "absolute z-50 bg-white  h-[100vh] sm:h-[100vh] overflow-auto"
                    : "hidden"
                  } relative`
                  : "absolute"
                  } top-[100px] left-0 bottom-0 flex flex-col gap-5 justify-start  w-[200px] p-1`}
              >
                {isMobileView && (
                  <IoClose
                    onClick={() => {
                      setLeftHamburger(false);
                      setRightHamburger(false);
                    }}
                    className="absolute top-[0%] right-[1%] text-[26px] cursor-pointer  border-black font-bold hover:bg-gray-100"
                  />
                )}
                <div className="cursor-pointer">
                  <div className="bg-white p-2 rounded-lg shadow-md w-30 cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-sm font-semibold text-gray-600">
                        {t("priceManager")}
                      </h2>
                    </div>
                    <Box sx={{ "& button": { m: 1 } }}>
                      <div>
                        <Button
                          size="small"
                          variant="outlined"
                          color="inherit"
                          // className="bg-[#0072BB] botton-text rounded-[5px] sm:px-[20px] px-[10px] sm:py-[10px] py-[10px] text-white h-[6%]"
                          onClick={openNewTab}
                        >
                          Volume Base
                        </Button>
                      </div>
                      <div>
                        <Button
                          size="small"
                          variant="outlined"
                          color="inherit"
                          // className="bg-[#0072BB] botton-text rounded-[5px] sm:px-[20px] px-[10px] sm:py-[10px] py-[10px] text-white h-[6%]"
                          onClick={openNewTabRent}
                        >
                          Rental Base
                        </Button>
                      </div>
                      <div>
                        <Button
                          size="small"
                          variant="outlined"
                          color="inherit"
                          // className="bg-[#0072BB] botton-text rounded-[5px] sm:px-[20px] px-[10px] sm:py-[10px] py-[10px] text-white h-[6%]"
                          onClick={openPriceTab}
                        >
                          Prices
                        </Button>
                      </div>
                    </Box>
                  </div>
                </div>

                <div className="cursor-pointer">
                  <div className="bg-white p-2 rounded-lg shadow-md w-30 cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-sm font-semibold">
                        {t("filter_option")}
                      </h2>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox mr-2 cursor-pointer"
                          checked={currentCheckBox === "all"}
                          onClick={(e) =>
                            handleFilterData(e.target.checked, "all")
                          }
                        />
                        <span className="text-sm">{t("all")}</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox mr-2 cursor-pointer"
                          checked={currentCheckBox === "active"}
                          onClick={(e) =>
                            handleFilterData(e.target.checked, "active")
                          }
                        />
                        <span className="text-sm">{t("active")}</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox mr-2 cursor-pointer"
                          checked={currentCheckBox === "inactive"}
                          onClick={(e) =>
                            handleFilterData(e.target.checked, "inactive")
                          }
                        />
                        <span className="text-sm">{t("inactive")}</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox mr-2 cursor-pointer"
                          checked={currentCheckBox === "disassembled"}
                          onClick={(e) =>
                            handleFilterData(e.target.checked, "disassembled")
                          }
                        />
                        <span className="text-sm">{t("dismantle")}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div onClick={() => handleFilterDateModal()}>
                  <div className="bg-white p-2 rounded-lg shadow-md w-30 cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-sm font-semibold">
                        {t("filter_option")}
                      </h2>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox mr-2 cursor-pointer"
                          checked={currentCheckBox === "day"}
                          onClick={(e) =>
                            handleFilterDateData(e.target.checked, "day")
                          }
                        />
                        <span className="text-sm">{t("today")}</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox mr-2 cursor-pointer"
                          checked={currentCheckBox === "week"}
                          onClick={(e) =>
                            handleFilterDateData(e.target.checked, "week")
                          }
                        />
                        <span className="text-sm">{t("week")}</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox mr-2 cursor-pointer"
                          checked={currentCheckBox === "month"}
                          onClick={(e) =>
                            handleFilterDateData(e.target.checked, "month")
                          }
                        />
                        <span className="text-sm">{t("month")}</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox mr-2 cursor-pointer"
                          checked={currentCheckBox === "year"}
                          onClick={(e) =>
                            handleFilterDateData(e.target.checked, "year")
                          }
                        />
                        <span className="text-sm">{t("year")}</span>
                      </label>
                      <input
                        onChange={(e) => handleDateSearch(e)}
                        datepicker
                        datepicker-format="mm/dd/yyyy"
                        type="date"
                        className="block w-full mt-3 p-2 text-gray-700 border border-gray-300 rounded-lg 
                        focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("select_date")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`${isMobileView
                  ? "absolute w-full top-[100px]"
                  : " absolute w-[calc(100%-400px)] top-[100px] right-[200px]"
                  } `}
              >
                <div className="">
                  {isScaffoldLoading ? (
                    <div className="flex items-center justify-center w-full h-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-300 dark:border-gray-200">
                      <div className="px-4 py-2 text-md font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                        loading...
                      </div>
                    </div>
                  ) : filteredData && filteredData.length > 0 ? (
                    <div
                      id="scrollbar"
                      className={`flex flex-wrap gap-10 ${filteredData?.length < 4
                        ? "justify-start pl-4"
                        : "justify-center"
                        } overflow-auto h-[680px]`}
                    >
                      {filteredData?.map((ele) => (
                        <LogCard
                          key={ele.id}
                          data={ele}
                          projectId={projectId}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full border border-gray-200 rounded-lg ">
                      <div className="px-4 h-full py-2 text-md font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                        <img
                          src={no_data}
                          alt="no_image"
                          className="w-[200px]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className={` bg-red  ${isMobileView
                  ? `${rightHamburger
                    ? "absolute right-0 h-[100vh] overflow-auto top-[100px] bg-white w-[200px] "
                    : "hidden"
                  }`
                  : "absolute top-[100px]  right-0 bottom-0  w-[200px]"
                  } transition-all ease-in-out duration-100`}
              >
                {isMobileView && (
                  <IoClose
                    onClick={() => {
                      setLeftHamburger(false);
                      setRightHamburger(false);
                    }}
                    className="absolute z-50 top-[0%] left-1 text-[26px] cursor-pointer  border-black font-bold "
                  />
                )}
                <div className="bg-white rounded-3xl shadow-lg p-6 max-w-xs">
                  <div className="flex flex-col gap-4">
                    {/* Status Pills */}
                    <div className="flex gap-2">
                      {scaffoldDetails?.map((detail, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center"
                          onClick={() =>
                            handleFilterData(
                              true,
                              detail?.label === "Total"
                                ? "all"
                                : detail?.label === "Active"
                                  ? "active"
                                  : detail?.label === "Inactive"
                                    ? "inactive"
                                    : "disassembled"
                            )
                          }
                        >
                          <span className={`
            text-xs font-medium uppercase mb-2
            ${detail.label === "Active"
                              ? "text-green-500"
                              : detail.label === "Inactive"
                                ? "text-red-400"
                                : detail.label === "Dismantle"
                                  ? "text-orange-400"
                                  : "text-gray-700"
                            }
          `}>
                            {detail?.label === "Total" ? "TC" :
                              detail?.label === "Active" ? "AC" :
                                detail?.label === "Inactive" ? "IN" : "DI"}
                          </span>
                          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer
            transition-transform duration-200 hover:scale-105
            ${detail.label === "Active"
                              ? "bg-green-100 text-green-500"
                              : detail.label === "Inactive"
                                ? "bg-red-100 text-red-400"
                                : detail.label === "Dismantle"
                                  ? "bg-orange-100 text-orange-400"
                                  : "bg-gray-100 text-gray-700"
                            }
          `}>
                            {detail?.value || 0}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-gray-200" />

                    {/* Units Section */}
                    <div className="flex flex-col gap-4">
                      <h2 className="text-lg font-semibold">Units</h2>

                      {/* Units Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        {Object.keys(onDataUnits?.[currentUnits] || onDataUnits || {}).map((unit) => {
                          
                          const value = onDataUnits?.[currentUnits]?.[unit] || onDataUnits?.[unit] || 0;
                          const label = unit === 'm2' ? 'M²' :
                            unit === 'm3' ? 'M³' :
                              unit === 'lm' ? 'LM' :
                                unit === 'hm' ? 'HM' :
                                  unit.charAt(0).toUpperCase() + unit.slice(1);

                          return (
                            <div
                              key={unit}
                              className="bg-gray-50 rounded-lg p-2 text-center"
                            >
                              <div className="text-xs text-gray-600">{label}</div>
                              <div className="font-semibold">{typeof value === 'number' ? value : 0}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Time Period Buttons */}
                      <div className="flex flex-col gap-2 mt-2">
                        {[
                          { key: "today", label: "Today's" },
                          { key: "week", label: "Week" },
                          { key: "month", label: "Month" },
                          { key: "year", label: "Year" }
                        ].map((period) => (
                          <button
                            key={period.key}
                            onClick={() => setCurrentUnits(period.key)}
                            className={`
              py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200
              ${currentUnits === period.key
                                ? "bg-green-500 text-white"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                              }
            `}
                          >
                            {period.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Header />
          <TopSection
            keys={projectId}
            title={t("scaffold")}
            breadcrumData={[
              t("home"),
              projectName.toUpperCase(),
              t("scaffold"),
            ]}
          />
          <div className="pb-[50px] border-b border-b-[#CCCCCC]">
            <div className="custom-container">
              <div className="flex sm:flex-row flex-col  lg:flex-row gap-[30px] sm:items-center sm:justify-between justify-start  sm:text-center sm:mb-5">
                <p className="title-text text-nowrap">
                  {t("projectScaffoldForm")}
                </p>

                {roleOfUser === 0 || roleOfUser === 1 ? (
                  <div className="relative">
                    <Link to={`/approval-form/${projectId}`}>
                      <button className="bg-[#0072BB] botton-text rounded-[5px] sm:px-[20px] px-[10px] sm:py-[10px] py-[10px] text-white">
                        {t("approvalForm")}
                      </button>
                    </Link>
                  </div>
                ) : null}
              </div>
              <div className="flex justify-center items-center !w-full mt-2"></div>
            </div>

            <div className="custom-container flex  gap-5 justify-between sm:justify-end  !mt-4">
              <div onClick={() => setProjectLogModal(true)} className="">
                <button className="bg-[#0072BB] bottom-text rounded-[5px] sm:px-[20px] px-[10px] sm:py-[10px] py-[10px] text-white text-nowrap">
                  {t("scaffoldLogs")}
                </button>
              </div>
              <div className="">
                <Link
                  to={`/after-control-listing-form/${projectId}`}
                  className=""
                >
                  <button className="bg-[#0072BB] bottom-text rounded-[5px] sm:px-[20px] px-[10px] sm:py-[10px] py-[10px] text-white text-nowrap">
                    {t("viewAfterControls")}
                  </button>
                </Link>
              </div>
            </div>

            <div className=" custom-container relative flex  items-center !w-full !mt-4">
              <form className="w-full">
                <div className="relative">
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
                    id="default-search"
                    className="block w-full p-4 ps-10 text-sm "
                    onChange={handleSearch}
                    placeholder={t("searchApprovalForm")}
                    type="text"
                    required
                  />
                </div>
              </form>
            </div>
          </div>

          {searchTerm ? (
            <>
              {loading ? (
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
                        {t("loading")}
                      </h1>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {filteredApprovalForm?.length > 0 ? (
                    <>
                      <ApprovalFormSlider
                        refreshtData={refreshtData}
                        status="Active"
                        data={filteredApprovalForm?.filter(
                          (item) => item.status === "active"
                        )}
                        handleDelete={handleDelete}
                        loading={loading}
                      />
                      {roleOfUser !== 2 && (
                        <ApprovalFormSlider
                          refreshtData={refreshtData}
                          status="Inactive"
                          data={filteredApprovalForm?.filter(
                            (item) => item.status === "inactive"
                          )}
                          handleDelete={handleDelete}
                          loading={loading}
                        />
                      )}
                      {roleOfUser !== 2 && (
                        <ApprovalFormSlider
                          refreshtData={refreshtData}
                          status="Disassembled"
                          data={filteredApprovalForm?.filter(
                            (item) => item.status === "disassembled"
                          )}
                          handleDelete={handleDelete}
                          loading={loading}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center items-center mt-[10px]">
                        <img
                          className="w-[400px]"
                          src={no_data}
                          alt="no data found"
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {loading ? (
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
                        {t("loading")}
                      </h1>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {filesData?.length > 0 ? (
                    <>
                      <ApprovalFormSlider
                        refreshtData={refreshtData}
                        status="Active"
                        data={filesData?.filter(
                          (item) => item.status === "active"
                        )}
                        handleDelete={handleDelete}
                        loading={loading}
                      />
                      {roleOfUser !== 2 && (
                        <ApprovalFormSlider
                          refreshtData={refreshtData}
                          status="Inactive"
                          data={filesData?.filter(
                            (item) => item.status === "inactive"
                          )}
                          handleDelete={handleDelete}
                          loading={loading}
                        />
                      )}
                      {roleOfUser !== 2 && (
                        <ApprovalFormSlider
                          refreshtData={refreshtData}
                          status="Disassembled"
                          data={filesData?.filter(
                            (item) => item.status === "disassembled"
                          )}
                          handleDelete={handleDelete}
                          loading={loading}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center items-center mt-[10px]">
                        <img
                          className="w-[400px]"
                          src={no_data}
                          alt="no data found"
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}

          <Footer />
        </div>
      )}
    </>
  );
};

export default ApprovalListingPage;
