import React, { useEffect, useMemo, useState } from "react";
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
  Paper,
  TableContainer,
} from "@mui/material";
import { useParams } from "react-router-dom";
import DateRangePicker from "../DateRangePicker";
import { useSelector } from "react-redux";
import Header from "../Header";
import Footer from "../Footer";

export default function RentalPage() {
  const { projectId } = useParams();
  const isAdminId = true;
  const scaffoldOptions = useSelector(
    (state) => state.scaffolds.scaffoldOptions
  );
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

  const rows = [
    {
      id: "001",
      type: "Standard Frame",
      position: "North Wall",
      buildDate: "2024-07-01",
      dismantleDate: "2024-07-15",
      totalDays: 14,
      volume: "100 m²",
      dailyPrice: "$15/m²",
      totalPrice: "$2,100",
    },
    {
      id: "002",
      type: "Hanging Scaffold",
      position: "East Side",
      buildDate: "2024-07-05",
      dismantleDate: "2024-07-20",
      totalDays: 15,
      volume: "50 m³",
      dailyPrice: "$20/m³",
      totalPrice: "$1,500",
    },
    {
      id: "003",
      type: "Tube & Clamp",
      position: "Roof Section",
      buildDate: "2024-07-08",
      dismantleDate: "2024-07-12",
      totalDays: 4,
      volume: "30 LM",
      dailyPrice: "$10/LM",
      totalPrice: "$300",
    },
  ];

  const getPriceForKey = (key) => {
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
  };

  const activeScaffolds = scaffoldSize?.filter(
    (item) => item.status === "active"
  );

  const activeScaffoldsDetails = activeScaffolds?.map((item) =>
    item.scaffoldName?.map((scaffold) => ({
      ...scaffold,
      scaffoldIdentificationNumber: item.scaffoldIdentificationNumber,
    }))
  );

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

  const totalHours = filteredData?.reduce(
    (acc, { TotalHourJob }) => acc + TotalHourJob,
    0
  );
  const totalAmount = filteredData?.reduce(
    (acc, { TotalAmount }) => acc + TotalAmount,
    0
  );

  const scaffoldTotalsHours = useMemo(() => {
    return activeScaffoldsDetails?.flatMap((scaffoldGroup) =>
      scaffoldGroup.map((scaffold) => {
        const m3Total =
          getPriceForKey("m3") *
          scaffold?.measurements?.m3?.reduce(
            (acc, m3) =>
              acc +
              parseFloat(m3?.length) *
              parseFloat(m3?.width) *
              parseFloat(m3?.height),
            0
          );

        const m2Total =
          getPriceForKey("m2") *
          scaffold?.measurements?.m2?.reduce(
            (acc, m2) => acc + parseFloat(m2?.length) * parseFloat(m2?.width),
            0
          );

        const lmTotal =
          getPriceForKey("lm") *
          scaffold?.measurements?.lm?.reduce(
            (acc, lm) => acc + parseFloat(lm?.length),
            0
          );

        const hmTotal =
          getPriceForKey("hm") *
          scaffold?.measurements?.hm?.reduce(
            (acc, hm) => acc + parseFloat(hm?.height),
            0
          );

        const TotalAmount = m3Total + m2Total + lmTotal + hmTotal;
        const TotalHourJob = Math.round(TotalAmount / getPriceForKey("hr"));

        return { scaffold, TotalHourJob, TotalAmount };
      })
    );
  }, [activeScaffoldsDetails]);

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

    // setFilteredData(filtered);
  }, [searchInput, scaffoldTotalsHours, selectedScaffoldType]);

  useEffect(() => {
    if (percentages?.length === 0 && scaffoldTotalsHours?.length > 0) {
      const initialPercentages = scaffoldTotalsHours?.map(() => ({
        build: 50,
        dismantle: 50,
      }));
      setPercentages(initialPercentages);
    }
  }, [scaffoldTotalsHours]);

  const normalizeDate = (date) => {
    if (!date) return null; // Handle null or undefined gracefully
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // Set time to midnight
    return d;
  };

  const filterScaffoldByDateRange = (data) => {
    if (!startDate || !endDate) {
      return data; // Return all data if no range is selected
    }

    const start = normalizeDate(startDate);
    const end = normalizeDate(endDate);

    return data.filter((item) => {
      const itemDate = normalizeDate(item.date);
      return itemDate >= start && itemDate <= end;
    });
  };

  useEffect(() => {
    const getApprovalFormByItsProjectId = async () => {
      try {
        const response = await getApprovalFormByProjectId(projectId);
        const fetchedData = response?.data?.data || [];
        const filteredData = filterScaffoldByDateRange(fetchedData);
        setScaffoldSize(filteredData);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    getApprovalFormByItsProjectId();
  }, [projectId, startDate, endDate]);

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const totalPrice = rows.reduce(
    (sum, row) => sum + parseFloat(row.totalPrice.replace(/[^\d.]/g, "")),
    0
  );

  return (
    <>
      <Header />
      <Container>
        <h1 className="title-text text-center mb-5 mt-10">RENTAL BASED PRICE</h1>
        <DateRangePicker
          style={{ marginLeft: "0px", marginBottom: "0px", marginTop: "0px" }}
          onDateRangeChange={handleDateRangeChange}
          value={{ startDate, endDate }}
        />

        <div className="flex items-center space-x-4 mt-5 mb-5">
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search..."
              className="!h-[40px] !w-full !rounded-[6px] !border-[1px] border-[rgba(204,204,204,1)] shadow-sm focus:outline-none !focus:ring-2 !focus:ring-blue-500 !focus:border-blue-500 !appearance-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M15.6 15.6a7.5 7.5 0 111.06-1.06 7.5 7.5 0 01-1.06 1.06z"
                />
              </svg>
            </span>
          </div>
          <div className="relative w-1/3">
            <select
              className="w-full px-4 py-2 border border-[rgba(204,204,204,1)] rounded-lg shadow-sm focus:outline-none !focus:ring-2 focus:ring-blue-500 focus:border-blue-500 !appearance-none"
              onChange={handleScaffoldSelectType}
              value={selectedScaffoldType}
            >
              <option value="">Select All</option>
              {Object.keys(scaffoldOptions)?.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table aria-label="scaffolding table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                <TableCell>
                  <Typography variant="h6">Scaffold ID</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Type</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Position</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Build Date</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Dismantle Date</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Total Days in Rent</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Volume</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Daily Price ($)</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Total Price ($)</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.position}</TableCell>
                  <TableCell>{row.buildDate}</TableCell>
                  <TableCell>{row.dismantleDate}</TableCell>
                  <TableCell>{row.totalDays}</TableCell>
                  <TableCell>{row.volume}</TableCell>
                  <TableCell>{row.dailyPrice}</TableCell>
                  <TableCell>{row.totalPrice}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={8} align="right">
                  <Typography variant="h6">TOTAL:</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">${totalPrice.toLocaleString()}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Footer />

    </>

  );
}
