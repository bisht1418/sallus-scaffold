import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getApprovalFormByProjectId } from "../../Services/approvalFormService";
import ScaffoldPricing from "./ScaffoldPricing";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Container,
  TableContainer,
  Paper,
  TablePagination,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import DateRangePicker from "../DateRangePicker";
import { useSelector } from "react-redux";
import Header from "../Header";
import Footer from "../Footer";
import { Download, Search } from "lucide-react";
import { toast } from "react-toastify";
import { getPriceFormByProjectIdService } from "../../Services/priceFormService";
import { getApprovalListingPageByProjectId } from "../../Services/approvalListingPageService";
import downloadPDF from "./VolumeBase/downloadPDF";

export default function VolumePage() {

  const [volumeData, setVolumeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [approvalFormData, setApprovalFormData] = useState([]);
  const [approvalListingLoading, setApprovalLoading] = useState(false);
  const { projectId } = useParams();
  const isAdminId = true;
  const scaffoldOptions = useSelector((state) => state.scaffolds.scaffoldOptions);
  const [isSaved, setIsSaved] = useState(false);
  const [scaffoldSize, setScaffoldSize] = useState([]);
  const [selectedScaffoldType, setSelectedScaffoldType] = useState("");
  const [selectedPriceDetailsUpdate, setSelectedPriceDetailsUpdate] =
    useState(scaffoldOptions);
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState();
  const [selectedScaffoldBase, setSelectedScaffoldBase] =
    useState("Volume Based");
  const [percentages, setPercentages] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getPriceForKey = useMemo(() => (key) => {
    const scaffold = scaffoldOptions[selectedScaffoldType];
    if (scaffold) {
      return key === "m2"
        ? scaffold.pricePerM2
        : key === "m3"
          ? scaffold.pricePerM3
          : key === "lm"
            ? scaffold.pricePerLM
            : key === "hm"
              ? scaffold.pricePerHM
              : key === "hr"
                ? scaffold.hourlyRate
                : 0;
    }
    return 0;
  }, [scaffoldOptions, selectedScaffoldType]);

  const activeScaffolds = useMemo(() =>
    scaffoldSize?.filter((item) => item.status === "active"),
    [scaffoldSize]
  );

  // const activeScaffolds = scaffoldSize?.filter(
  //   (item) => item.status === "active"
  // );

  // const activeScaffoldsDetails = activeScaffolds?.map((item) =>
  //   item.scaffoldName?.map((scaffold) => ({
  //     ...scaffold,
  //     scaffoldIdentificationNumber: item.scaffoldIdentificationNumber,
  //   }))
  // );

  const activeScaffoldsDetails = useMemo(() =>
    activeScaffolds?.map((item) =>
      item.scaffoldName?.map((scaffold) => ({
        ...scaffold,
        scaffoldIdentificationNumber: item.scaffoldIdentificationNumber,
      }))
    ),
    [activeScaffolds]
  );


  const scaffoldTotalsHours = useMemo(() => {
    return activeScaffoldsDetails?.flatMap((scaffoldGroup) =>
      scaffoldGroup.map((scaffold) => {
        const m3Total =
          getPriceForKey("m3") *
          (scaffold?.measurements?.m3?.reduce(
            (acc, m3) =>
              acc +
              parseFloat(m3?.length || 0) *
              parseFloat(m3?.width || 0) *
              parseFloat(m3?.height || 0),
            0
          ) || 0);

        const m2Total =
          getPriceForKey("m2") *
          (scaffold?.measurements?.m2?.reduce(
            (acc, m2) => acc + (parseFloat(m2?.length || 0) * parseFloat(m2?.width || 0)),
            0
          ) || 0);

        const lmTotal =
          getPriceForKey("lm") *
          (scaffold?.measurements?.lm?.reduce(
            (acc, lm) => acc + parseFloat(lm?.length || 0),
            0
          ) || 0);

        const hmTotal =
          getPriceForKey("hm") *
          (scaffold?.measurements?.hm?.reduce(
            (acc, hm) => acc + parseFloat(hm?.height || 0),
            0
          ) || 0);

        const TotalAmount = m3Total + m2Total + lmTotal + hmTotal;
        const TotalHourJob = Math.round(TotalAmount / getPriceForKey("hr"));

        return { scaffold, TotalHourJob, TotalAmount };
      })
    );
  }, [activeScaffoldsDetails, getPriceForKey]);


  const filteredAndProcessedData = useMemo(() => {
    if (!scaffoldTotalsHours) return [];

    const filteredByType = selectedScaffoldType === "All Types" || !selectedScaffoldType
      ? scaffoldTotalsHours
      : scaffoldTotalsHours?.filter(
        (item) =>
          item.scaffold.key.toLowerCase() === selectedScaffoldType.toLowerCase()
      );

    return searchInput?.length >= 3
      ? filteredByType?.filter(
        ({ scaffold }) =>
          scaffold.value?.toLowerCase().includes(searchInput.toLowerCase()) ||
          scaffold.scaffoldIdentificationNumber?.includes(searchInput)
      )
      : filteredByType;
  }, [scaffoldTotalsHours, selectedScaffoldType, searchInput]);

  useEffect(() => {
    setFilteredData(filteredAndProcessedData);
  }, [filteredAndProcessedData]);

  const handleScaffoldSelectBase = (e) => {
    setSelectedScaffoldBase(e.target.value);
  };

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

  const handleScaffoldSelectType = (event) => {
    const selectedType = event.target.value;
    setSelectedScaffoldType(selectedType);
  };

  const handlePercentageChange = (index, type, value) => {
    const updatedValue = Math.max(0, Math.min(100, parseFloat(value) || 0));
    setPercentages((prevPercentages) => {
      const newPercentages = [...prevPercentages];
      if (type === "build") {
        newPercentages[index] = {
          build: updatedValue,
          dismantle: 100 - updatedValue,
        };
      } else if (type === "dismantle") {
        newPercentages[index] = {
          build: 100 - updatedValue,
          dismantle: updatedValue,
        };
      }
      return newPercentages;
    });
  };

  // const totalHours = filteredData?.reduce(
  //   (acc, { TotalHourJob }) => acc + TotalHourJob,
  //   0
  // );
  // const totalAmount = filteredData?.reduce(
  //   (acc, { TotalAmount }) => acc + TotalAmount,
  //   0
  // );


  const filterScaffoldByDateRange = useCallback((data) => {
    if (!startDate || !endDate) {
      return data;
    }
    const start = normalizeDate(startDate);
    const end = normalizeDate(endDate);
    return data.filter((item) => {
      const itemDate = normalizeDate(item.date);
      return itemDate >= start && itemDate <= end;
    });
  }, [startDate, endDate]);



  useEffect(() => {
    const getApprovalFormByItsProjectId = async () => {
      if (!projectId) return;

      try {
        const response = await getApprovalFormByProjectId(projectId);
        const fetchedData = response?.data?.data?.filter((ele) => !ele.isDeleted && ele.status === "active") || [];
        const filteredData = filterScaffoldByDateRange(fetchedData);
        setScaffoldSize(filteredData);
      } catch (error) {
        console.error("Error fetching project data:", error);
        toast.error("Failed to fetch project data");
      }
    };

    getApprovalFormByItsProjectId();
  }, [projectId, filterScaffoldByDateRange]);

  useEffect(() => {

    const filteredByType = selectedScaffoldType
      ? scaffoldTotalsHours?.filter(
        (item) =>
          item.scaffold.key.toLowerCase() ===
          selectedScaffoldType.toLowerCase()
      )
      : scaffoldTotalsHours;

    const filtered =
      searchInput?.length >= 3
        ? filteredByType?.filter(
          ({ scaffold }) =>
            scaffold.value
              .toLowerCase()
              .includes(searchInput.toLowerCase()) ||
            scaffold.scaffoldIdentificationNumber.includes(searchInput)
        )
        : filteredByType;

    setFilteredData(filtered);
  }, [searchInput, selectedScaffoldType]);

  useEffect(() => {
    if (percentages.length === 0 && scaffoldTotalsHours?.length > 0) {
      const initialPercentages = scaffoldTotalsHours.map(() => ({
        build: 50,
        dismantle: 50,
      }));
      setPercentages(initialPercentages);
    }
  }, [scaffoldTotalsHours, percentages.length]);


  const normalizeDate = (date) => {
    if (!date) return null; // Handle null or undefined gracefully
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // Set time to midnight
    return d;
  };

  useEffect(() => {
    const getApprovalFormByItsProjectId = async () => {
      try {
        const response = await getApprovalFormByProjectId(projectId);
        const fetchedData = response?.data?.data?.filter(ele => !ele?.isDeleted && ele.status === "active") || [];
        const filteredData = filterScaffoldByDateRange(fetchedData);
        setScaffoldSize(filteredData);
      } catch (error) {
        console.error("Error fetching project data:", error);
        toast.error("Failed to fetch project data");
      }
    };

    if (projectId) {
      getApprovalFormByItsProjectId();
    }
  }, [projectId, startDate, endDate]);


  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const paginatedData = useMemo(() => {
    if (!filteredData) return [];
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);



  const handleScaffoldForm = async (projectId) => {
    setLoading(true);

    try {
      const responseData = await getPriceFormByProjectIdService(projectId);

      if (responseData.success) {
        setVolumeData(responseData?.data?.volume || []);
        if (responseData?.data?.volume?.length > 0) {

          const allKeys = [
            ...new Set(
              responseData?.data?.volume.flatMap(item =>
                Object.keys(item.prices || {})
              )
            )
          ];
          const priceKeys = allKeys.filter(key => key.toLowerCase() !== 'rent' && key.toLowerCase() !== 'volume');
          const dynamicHeaders = ['Scaffold Name', ...priceKeys.map(key => `${key}`)];

          const getAllHeaders = () => {
            const hourHeaders = ["Total Hr", "Build Hr", "Dismantle Hr"];
            const amountHeaders = ["Total $", "Build $", "Dismantle $"];
            const percentageHeaders = ["Build %", "Dismantle %"];

            return [
              ...dynamicHeaders, // Dynamic headers from API
              ...(selectedScaffoldBase === "Hour Based" ? hourHeaders : amountHeaders),
              ...percentageHeaders
            ];
          };
          setHeaders(getAllHeaders());
        }

      } else {
        console.error(responseData?.message);
      }
    } catch (error) {
      console.error('Error while fetching scaffold form:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getApprovalData = async (projectId) => {
    try {
      setApprovalLoading(true);
      const response = await getApprovalListingPageByProjectId(projectId);
      const approvalData = response?.data?.data;
      const filterData = approvalData?.filter(
        (element, index) => !element?.isDeleted && element?.status === "active"
      );
      setApprovalFormData(filterData || [])
    } catch (Error) {
      setApprovalLoading(false);
      return Error;
    } finally {
      setApprovalLoading(false);
    }
  };

  useEffect(() => {
    handleScaffoldForm(projectId);
    getApprovalData(projectId)
  }, [projectId]);

  const formatCellValue = (value) => {
    // If it's already a string, return as is
    if (typeof value === 'string') {
      return value;
    }

    // If it's a number, format it
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toFixed(2);
    }

    // If it's null/undefined or any other type
    return "0.00";
  };

  useEffect(() => {
    if (!scaffoldTotalsHours) return;

    const filtered = searchInput?.length >= 3
      ? scaffoldTotalsHours?.filter(
        ({ scaffold }) =>
          scaffold.value?.toLowerCase().includes(searchInput.toLowerCase()) ||
          scaffold.scaffoldIdentificationNumber?.includes(searchInput)
      )
      : scaffoldTotalsHours;

    setFilteredData(filtered);
  }, [scaffoldTotalsHours]); // Initial load dependency

  // Update filtering useEffect
  useEffect(() => {
    if (!scaffoldTotalsHours) return;

    const filtered = searchInput?.length >= 3
      ? scaffoldTotalsHours?.filter(
        ({ scaffold }) =>
          scaffold.value?.toLowerCase().includes(searchInput.toLowerCase()) ||
          scaffold.scaffoldIdentificationNumber?.includes(searchInput)
      )
      : scaffoldTotalsHours;

    setFilteredData(filtered);
  }, [scaffoldTotalsHours]); // Initial load dependency

  // Update filtering useEffect
  useEffect(() => {
    if (!scaffoldTotalsHours) return;

    const filteredByType = selectedScaffoldType === ""
      ? scaffoldTotalsHours
      : scaffoldTotalsHours?.filter(
        (item) => item.scaffold.key.toLowerCase() === selectedScaffoldType.toLowerCase()
      );

    const filtered = searchInput?.length >= 3
      ? filteredByType?.filter(
        ({ scaffold }) =>
          scaffold.value?.toLowerCase().includes(searchInput.toLowerCase()) ||
          scaffold.scaffoldIdentificationNumber?.includes(searchInput)
      )
      : filteredByType;

    setFilteredData(filtered);
  }, [searchInput, scaffoldTotalsHours, selectedScaffoldType]);

  const { totalSum, totalHours } = useMemo(() => {
    if (!filteredData) return { totalSum: 0, totalHours: 0 };

    return filteredData.reduce((acc, { scaffold }) => {
      // Find matching price data from volumeData
      const matchingVolumeData = volumeData.find(
        v => v.scaffoldName.toLowerCase() === scaffold?.key?.toLowerCase()
      );
      const prices = matchingVolumeData?.prices || {};

      if (selectedScaffoldBase === "Volume Based") {
        // Volume Based Calculation
        let totalM3 = 0;
        let totalM2 = 0;
        let totalLM = 0;
        let totalHM = 0;

        // Calculate M3
        if (scaffold?.measurements?.m3) {
          totalM3 = scaffold.measurements.m3.reduce((acc, measurement) => {
            const length = parseFloat(measurement?.length || 0);
            const width = parseFloat(measurement?.width || 0);
            const height = parseFloat(measurement?.height || 0);
            return acc + (length * width * height);
          }, 0) * parseFloat(prices['m³'] || 0);
        }

        // Calculate M2
        if (scaffold?.measurements?.m2) {
          totalM2 = scaffold.measurements.m2.reduce((acc, measurement) => {
            const length = parseFloat(measurement?.length || 0);
            const width = parseFloat(measurement?.width || 0);
            return acc + (length * width);
          }, 0) * parseFloat(prices['m²'] || 0);
        }

        // Calculate LM
        if (scaffold?.measurements?.lm) {
          totalLM = scaffold.measurements.lm.reduce((acc, measurement) => {
            return acc + parseFloat(measurement?.length || 0);
          }, 0) * parseFloat(prices.LM || 0);
        }

        // Calculate HM
        if (scaffold?.measurements?.hm) {
          totalHM = scaffold.measurements.hm.reduce((acc, measurement) => {
            return acc + parseFloat(measurement?.height || 0);
          }, 0) * parseFloat(prices.HM || 0);
        }

        const rowTotal = totalM3 + totalM2 + totalLM + totalHM;
        return {
          totalSum: acc.totalSum + rowTotal,
          totalHours: acc.totalHours
        };
      } else {
        // Hour Based Calculation
        let rawTotal = 0;

        // Sum M3 measurements without price
        if (scaffold?.measurements?.m3) {
          rawTotal += scaffold.measurements.m3.reduce((acc, measurement) => {
            const length = parseFloat(measurement?.length || 0);
            const width = parseFloat(measurement?.width || 0);
            const height = parseFloat(measurement?.height || 0);
            return acc + (length * width * height);
          }, 0);
        }

        // Sum M2 measurements without price
        if (scaffold?.measurements?.m2) {
          rawTotal += scaffold.measurements.m2.reduce((acc, measurement) => {
            const length = parseFloat(measurement?.length || 0);
            const width = parseFloat(measurement?.width || 0);
            return acc + (length * width);
          }, 0);
        }

        // Sum LM measurements without price
        if (scaffold?.measurements?.lm) {
          rawTotal += scaffold.measurements.lm.reduce((acc, measurement) => {
            return acc + parseFloat(measurement?.length || 0);
          }, 0);
        }

        // Sum HM measurements without price
        if (scaffold?.measurements?.hm) {
          rawTotal += scaffold.measurements.hm.reduce((acc, measurement) => {
            return acc + parseFloat(measurement?.height || 0);
          }, 0);
        }

        // Multiply total raw measurements by Volume rate only
        const hourlyRate = parseFloat(prices.Volume || 1);
        const rowHours = rawTotal * hourlyRate;

        return {
          totalSum: acc.totalSum,
          totalHours: acc.totalHours + rowHours
        };
      }
    }, { totalSum: 0, totalHours: 0 });
  }, [filteredData, volumeData, selectedScaffoldBase]);

  console.log("volumeData", volumeData)

  return (
    <>
      <Header />
      <Container>
        <h1 className="title-text text-center mb-10 mt-10">VOLUME BASED PRICE</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-1 text-gray-700">Search</h2>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center">
              <Search className="h-5 w-5 text-gray-500" />
            </span>
            <input
              type="text"
              placeholder="Search by ID, Type, or Position..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg mb-5">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Filters</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Range Picker */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-2">
                Date Range
              </label>
              <DateRangePicker
                onDateRangeChange={handleDateRangeChange}
                value={{ startDate, endDate }}
              />
            </div>

            {/* Calculation Base Select */}
            <div className="flex flex-col">
              <label htmlFor="baseSelect" className="text-sm font-medium text-gray-600 mb-2">
                Calculation Base
              </label>
              <div className="relative">
                <select
                  id="baseSelect"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           appearance-none text-gray-700"
                  onChange={handleScaffoldSelectBase}
                  value={selectedScaffoldBase}
                >
                  <option value="Volume Based">Volume Based</option>
                  <option value="Hour Based">Hour Based</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="typeSelect" className="text-sm font-medium text-gray-600 mb-2">
                Scaffold Type
              </label>
              <div className="relative">
                <select
                  id="typeSelect"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm 
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
           appearance-none text-gray-700"
                  onChange={handleScaffoldSelectType}
                  value={selectedScaffoldType}
                >
                  <option value="">All Types</option>
                  {scaffoldTotalsHours?.map((item) => (
                    <option
                      key={item.scaffold.key}
                      value={item.scaffold.key}
                    >
                      {item.scaffold.key}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2">
          <TableContainer component={Paper}>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <Table aria-label="scaffolding table" sx={{ whiteSpace: "nowrap", minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableCell
                        key={header}
                        sx={{ fontWeight: 'bold', backgroundColor: 'action.hover' }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData?.map((item, index) => {
                    const { scaffold } = item;
                    const actualIndex = index + page * rowsPerPage;

                    // Find matching price data from volumeData
                    const matchingVolumeData = volumeData.find(
                      v => v.scaffoldName.toLowerCase() === scaffold?.key?.toLowerCase()
                    );
                    const prices = matchingVolumeData?.prices || {};

                    let TotalAmount = 0;
                    let calculatedTotalHourJob = 0;

                    if (selectedScaffoldBase === "Volume Based") {
                      // Calculate measurements and multiply with prices
                      let totalM3 = 0;
                      let totalM2 = 0;
                      let totalLM = 0;
                      let totalHM = 0;

                      // Calculate M3
                      if (scaffold?.measurements?.m3) {
                        totalM3 = scaffold.measurements.m3.reduce((acc, measurement) => {
                          const length = parseFloat(measurement?.length || 0);
                          const width = parseFloat(measurement?.width || 0);
                          const height = parseFloat(measurement?.height || 0);
                          return acc + (length * width * height);
                        }, 0) * parseFloat(prices['m³'] || 0);
                      }

                      // Calculate M2
                      if (scaffold?.measurements?.m2) {
                        totalM2 = scaffold.measurements.m2.reduce((acc, measurement) => {
                          const length = parseFloat(measurement?.length || 0);
                          const width = parseFloat(measurement?.width || 0);
                          return acc + (length * width);
                        }, 0) * parseFloat(prices['m²'] || 0);
                      }

                      // Calculate LM
                      if (scaffold?.measurements?.lm) {
                        totalLM = scaffold.measurements.lm.reduce((acc, measurement) => {
                          return acc + parseFloat(measurement?.length || 0);
                        }, 0) * parseFloat(prices.LM || 0);
                      }

                      // Calculate HM
                      if (scaffold?.measurements?.hm) {
                        totalHM = scaffold.measurements.hm.reduce((acc, measurement) => {
                          return acc + parseFloat(measurement?.height || 0);
                        }, 0) * parseFloat(prices.HM || 0);
                      }

                      TotalAmount = totalM3 + totalM2 + totalLM + totalHM;
                      calculatedTotalHourJob = TotalAmount;
                    } else {
                      // Hour Based Calculation
                      let rawTotal = 0;

                      // Sum M3 measurements without price
                      if (scaffold?.measurements?.m3) {
                        rawTotal += scaffold.measurements.m3.reduce((acc, measurement) => {
                          const length = parseFloat(measurement?.length || 0);
                          const width = parseFloat(measurement?.width || 0);
                          const height = parseFloat(measurement?.height || 0);
                          return acc + (length * width * height);
                        }, 0);
                      }

                      // Sum M2 measurements without price
                      if (scaffold?.measurements?.m2) {
                        rawTotal += scaffold.measurements.m2.reduce((acc, measurement) => {
                          const length = parseFloat(measurement?.length || 0);
                          const width = parseFloat(measurement?.width || 0);
                          return acc + (length * width);
                        }, 0);
                      }

                      // Sum LM measurements without price
                      if (scaffold?.measurements?.lm) {
                        rawTotal += scaffold.measurements.lm.reduce((acc, measurement) => {
                          return acc + parseFloat(measurement?.length || 0);
                        }, 0);
                      }

                      // Sum HM measurements without price
                      if (scaffold?.measurements?.hm) {
                        rawTotal += scaffold.measurements.hm.reduce((acc, measurement) => {
                          return acc + parseFloat(measurement?.height || 0);
                        }, 0);
                      }

                      // Multiply total raw measurements by Volume rate only
                      const hourlyRate = parseFloat(prices.Volume || 1);
                      calculatedTotalHourJob = rawTotal * hourlyRate;
                      TotalAmount = calculatedTotalHourJob;
                    }

                    const buildAmount = ((percentages[actualIndex]?.build || 0) / 100) * TotalAmount;
                    const dismantleAmount = ((percentages[actualIndex]?.dismantle || 0) / 100) * TotalAmount;
                    const buildHour = ((percentages[actualIndex]?.build || 0) / 100) * calculatedTotalHourJob;
                    const dismantleHour = ((percentages[actualIndex]?.dismantle || 0) / 100) * calculatedTotalHourJob;

                    return (
                      <TableRow
                        key={`${scaffold?.key || index}-${index}`}
                        className="even:bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                      >
                        {headers.map((header) => {
                          if (["Total Hr", "Build Hr", "Dismantle Hr", "Total $", "Build $", "Dismantle $", "Build %", "Dismantle %"].includes(header)) {
                            return null;
                          }
                          let normalizedType = header.toLowerCase();

                          if (normalizedType === 'm²' || normalizedType === 'm^2') {
                            normalizedType = 'm2';
                          } else if (normalizedType === 'm³' || normalizedType === 'm^3') {
                            normalizedType = 'm3';
                          }
                          let cellValue = 0;

                          if (scaffold?.measurements && scaffold.measurements[normalizedType]) {
                            cellValue = scaffold.measurements[normalizedType].reduce((acc, measurement) => {
                              const length = parseFloat(measurement?.length || 0);
                              const width = parseFloat(measurement?.width || 0);
                              const height = parseFloat(measurement?.height || 0);

                              switch (normalizedType.toLowerCase().replace(/\^/g, '')) {
                                case 'm3':
                                case 'm³':
                                  return acc + (length * width * height);
                                case 'm2':
                                case 'm²':
                                case 'r2':
                                case 'r²':
                                  return acc + (length * width);
                                case 'lm':
                                  return acc + length;
                                case 'hm':
                                  return acc + height;
                                default:
                                  return measurement?.value;
                              }
                            }, 0);
                          } else if (header === "Scaffold Name") {
                            return <TableCell key={`${header}-${index}`}>{scaffold?.key || "-"}</TableCell>;
                          } else if (scaffold?.measurements?.[header.toLowerCase()]) {
                            cellValue = scaffold?.[header?.toLowerCase()];
                          }

                          return (
                            <TableCell key={`${header}-${index}`}>
                              {formatCellValue(cellValue) || "0.00"}
                            </TableCell>
                          );
                        })}

                        {selectedScaffoldBase === "Hour Based" ? (
                          <>
                            <TableCell>{(calculatedTotalHourJob || 0).toFixed(2)}</TableCell>
                            <TableCell>{(buildHour || 0).toFixed(2)}</TableCell>
                            <TableCell>{(dismantleHour || 0).toFixed(2)}</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>{(TotalAmount || 0).toFixed(2)}</TableCell>
                            <TableCell>{(buildAmount || 0).toFixed(2)}</TableCell>
                            <TableCell>{(dismantleAmount || 0).toFixed(2)}</TableCell>
                          </>
                        )}
                        <TableCell>
                          <TextField
                            type="number"
                            value={percentages[actualIndex]?.build ? Number(percentages[actualIndex].build) : ''}
                            onChange={(e) => {
                              const value = e.target.value === '' ? '' : Number(e.target.value);
                              handlePercentageChange(actualIndex, "build", value);
                            }}
                            inputProps={{
                              min: 0,
                              max: 100,
                            }}
                            size="small"
                            sx={{
                              '& .MuiInputBase-input': {
                                height: '32px',
                                padding: '4px 8px',
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={percentages[actualIndex]?.dismantle ? Number(percentages[actualIndex].dismantle) : ''}
                            onChange={(e) => {
                              const value = e.target.value === '' ? '' : Number(e.target.value);
                              handlePercentageChange(actualIndex, "dismantle", value);
                            }}
                            inputProps={{
                              min: 0,
                              max: 100,
                            }}
                            size="small"
                            sx={{
                              '& .MuiInputBase-input': {
                                height: '32px',
                                padding: '4px 8px',
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  <TableRow>
                    <TableCell align="right" colSpan={headers.length - 1}>
                      <Typography variant="h6">
                        {selectedScaffoldBase === "Hour Based" ? "Total Hours" : "Total Amount"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">
                        {selectedScaffoldBase === "Hour Based"
                          ? (totalHours || 0).toFixed(2)
                          : (totalSum || 0).toFixed(2)
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>

              </Table>
            )}

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredData?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <div className="mt-4 mb-8 flex justify-end">
              <Button
                variant="contained"
                color="primary"
                startIcon={<Download />}
                onClick={() => downloadPDF(headers, filteredData, percentages, selectedScaffoldBase, totalHours, totalSum)}
                sx={{
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
              >
                Download PDF
              </Button>
            </div>
          </TableContainer>
        </div>
      </Container>
      <Footer />
    </>
  );
}
