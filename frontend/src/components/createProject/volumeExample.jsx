import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Typography, TextField, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import DateRangePicker from "./DateRangePicker"; // Assuming DateRangePicker is imported
import ScaffoldPricing from "./ScaffoldPricing"; // Assuming ScaffoldPricing is imported
import { getApprovalFormByProjectId } from "../api"; // Adjust the import based on your API

export default function VolumePage() {
  const { projectId } = useParams();
  const isAdminId = true;
  
  const scaffoldOptions = {
    "Standard Scaffold": { pricePerM3: 10, pricePerM2: 8, pricePerLM: 3, pricePerHM: 2, hourlyRate: 20 },
    "Fasade Scaffold": { pricePerM3: 9, pricePerM2: 15, pricePerLM: 3, pricePerHM: 2, hourlyRate: 20 },
    "Hanging Scaffold": { pricePerM3: 15, pricePerM2: 12, pricePerLM: 8, pricePerHM: 8, hourlyRate: 20 },
    "Rolling Scaffold": { pricePerM3: 18, pricePerM2: 20, pricePerLM: 4, pricePerHM: 4, hourlyRate: 20 },
    "Support Scaffold": { pricePerM3: 40, pricePerM2: 40, pricePerLM: 10, pricePerHM: 10, hourlyRate: 20 },
  };
  
  const [scaffoldSize, setScaffoldSize] = useState([]);
  const [selectedScaffoldType, setSelectedScaffoldType] = useState("");
  const [selectedPriceDetailsUpdate, setSelectedPriceDetailsUpdate] = useState(scaffoldOptions);
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedScaffoldBase, setSelectedScaffoldBase] = useState("Volume Based");
  const [percentages, setPercentages] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Memoizing getPriceForKey to avoid unnecessary recalculations
  const getPriceForKey = useCallback((key) => {
    const scaffold = scaffoldOptions[selectedScaffoldType];
    return scaffold ? scaffold[key] || 0 : 0;
  }, [selectedScaffoldType]);

  const getApprovalFormByItsProjectId = useCallback(async () => {
    try {
      const response = await getApprovalFormByProjectId(projectId);
      setScaffoldSize(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  }, [projectId]);

  // Filtering active scaffolds
  const activeScaffolds = useMemo(() => {
    return scaffoldSize.filter((item) => item.status === "active");
  }, [scaffoldSize]);

  const activeScaffoldsDetails = useMemo(() => {
    return activeScaffolds.map((item) => 
      item.scaffoldName.map((scaffold) => ({
        ...scaffold,
        scaffoldIdentificationNumber: item.scaffoldIdentificationNumber,
      }))
    );
  }, [activeScaffolds]);

  const handlePriceChange = (field, value) => {
    setSelectedPriceDetailsUpdate((prevPrices) => ({
      ...prevPrices,
      [selectedScaffoldType]: { ...prevPrices[selectedScaffoldType], [field]: parseFloat(value) || 0 },
    }));
    setIsSaved(false);
  };

  const handleSavePrices = () => setIsSaved(true);
  const handleScaffoldSelectType = (event) => setSelectedScaffoldType(event.target.value);
  const handleScaffoldSelectBase = (e) => setSelectedScaffoldBase(e.target.value);

  // Handling percentage change
  const handlePercentageChange = (index, type, value) => {
    const updatedValue = Math.max(0, Math.min(100, parseFloat(value) || 0));
    setPercentages((prevPercentages) => {
      const newPercentages = [...prevPercentages];
      newPercentages[index] = type === "build" 
        ? { build: updatedValue, dismantle: 100 - updatedValue }
        : { build: 100 - updatedValue, dismantle: updatedValue };
      return newPercentages;
    });
  };

  // Memoized calculation of scaffold totals
  const scaffoldTotalsHours = useMemo(() => {
    return activeScaffoldsDetails.map((scaffoldGroup) => {
      const scaffold = scaffoldGroup[0];

      const m3Total = getPriceForKey("pricePerM3") * scaffold.measurements.m3.reduce((acc, m3) =>
        acc + m3.length * m3.width * m3.height, 0);

      const m2Total = getPriceForKey("pricePerM2") * scaffold.measurements.m2.reduce((acc, m2) =>
        acc + m2.length * m2.width, 0);

      const lmTotal = getPriceForKey("pricePerLM") * scaffold.measurements.lm.reduce((acc, lm) =>
        acc + lm.length, 0);

      const hmTotal = getPriceForKey("pricePerHM") * scaffold.measurements.hm.reduce((acc, hm) =>
        acc + hm.height, 0);

      const TotalAmount = m3Total + m2Total + lmTotal + hmTotal;
      const TotalHourJob = Math.round(TotalAmount / getPriceForKey("hourlyRate"));

      return { scaffold, TotalHourJob, TotalAmount };
    });
  }, [activeScaffoldsDetails, getPriceForKey]);

  useEffect(() => {
    getApprovalFormByItsProjectId();
  }, [getApprovalFormByItsProjectId]);

  useEffect(() => {
    const filteredByType = selectedScaffoldType
      ? scaffoldTotalsHours.filter((item) => item.scaffold.key.toLowerCase() === selectedScaffoldType.toLowerCase())
      : scaffoldTotalsHours;

    const filtered = searchInput.length >= 3
      ? filteredByType.filter(({ scaffold }) => 
          scaffold.value.toLowerCase().includes(searchInput.toLowerCase()) || 
          scaffold.scaffoldIdentificationNumber.includes(searchInput))
      : filteredByType;

    setFilteredData(filtered);
  }, [searchInput, scaffoldTotalsHours, selectedScaffoldType]);

  // Handling Date Range Filtering
  const normalizeDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const filterScaffoldByDateRange = (data) => {
    if (!startDate || !endDate) return data;
    const start = normalizeDate(startDate);
    const end = normalizeDate(endDate);

    return data.filter((item) => {
      const itemDate = normalizeDate(item.date);
      return itemDate >= start && itemDate <= end;
    });
  };

  useEffect(() => {
    const filteredData = filterScaffoldByDateRange(scaffoldSize);
    setScaffoldSize(filteredData);
  }, [startDate, endDate, scaffoldSize]);

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <Container>
      <h1 className="title-text text-center mb-20">VOLUME BASED PRICE</h1>
      <DateRangePicker onDateRangeChange={handleDateRangeChange} value={{ startDate, endDate }} />
      
      <ScaffoldPricing
        selectedScaffoldType={selectedScaffoldType}
        priceDetails={selectedPriceDetailsUpdate[selectedScaffoldType]}
        isAdminId={isAdminId}
        handlePriceChange={handlePriceChange}
      />
      
      {isAdminId && (
        <div className="flex justify-center">
          <button type="button" onClick={handleSavePrices} className="mt-[20px] px-[20px] py-[10px] bg-[#0072BB] text-white border-none rounded-[5px]">
            Save Prices
          </button>
        </div>
      )}
      
      {isSaved && <p className="save-confirmation">Prices saved successfully!</p>}
      
      <div className="flex justify-around items-center space-x-4 mt-10">
        <input 
          type="text" placeholder="Search..." className="!h-[40px] !w-full !rounded-[6px]" 
          value={searchInput} onChange={(e) => setSearchInput(e.target.value)} 
        />
        <select className="w-full px-4 py-2" onChange={handleScaffoldSelectBase} value={selectedScaffoldBase}>
          <option value="Volume Based">Volume Based</option>
          <option value="Hour Based">Hour Based</option>
        </select>
        <select className="w-full px-4 py-2" onChange={handleScaffoldSelectType} value={selectedScaffoldType}>
          <option value="">Select Scaffold Type</option>
          {Object.keys(scaffoldOptions).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <Table aria-label="scaffolding table" sx={{ whiteSpace: "nowrap" }}>
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="h5">Active</Typography></TableCell>
            <TableCell><Typography variant="h5">ID</Typography></TableCell>
            <TableCell><Typography variant="h5">M3</Typography></TableCell>
            <TableCell><Typography variant="h5">M2</Typography></TableCell>
            <TableCell><Typography variant="h5">LM</Typography></TableCell>
            <TableCell><Typography variant="h5">HM</Typography></TableCell>
            {selectedScaffoldBase === "Hour Based" ? (
              <>
                <TableCell><Typography variant="h5">Total Hr</Typography></TableCell>
                <TableCell><Typography variant="h5">Build Hr</Typography></TableCell>
                <TableCell><Typography variant="h5">Dismantle Hr</Typography></TableCell>
              </>
            ) : (
              <>
                <TableCell><Typography variant="h5">Total $</Typography></TableCell>
                <TableCell><Typography variant="h5">Build $</Typography></TableCell>
                <TableCell><Typography variant="h5">Dismantle $</Typography></TableCell>
              </>
            )}
            <TableCell><Typography variant="h5">Build %</Typography></TableCell>
            <TableCell><Typography variant="h5">Dismantle %</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map(({ scaffold, TotalHourJob, TotalAmount }, index) => {
            const buildAmount = (percentages[index]?.build / 100) * TotalAmount;
            const dismantleAmount = (percentages[index]?.dismantle / 100) * TotalAmount;
            const buildHour = (percentages[index]?.build / 100) * TotalHourJob;
            const dismantleHour = (percentages[index]?.dismantle / 100) * TotalHourJob;
            return (
              <TableRow key={scaffold.scaffoldIdentificationNumber}>
                <TableCell>{scaffold.status}</TableCell>
                <TableCell>{scaffold.scaffoldIdentificationNumber}</TableCell>
                <TableCell>{scaffold.measurements.m3}</TableCell>
                <TableCell>{scaffold.measurements.m2}</TableCell>
                <TableCell>{scaffold.measurements.lm}</TableCell>
                <TableCell>{scaffold.measurements.hm}</TableCell>
                {selectedScaffoldBase === "Hour Based" ? (
                  <>
                    <TableCell>{TotalHourJob}</TableCell>
                    <TableCell>{buildHour}</TableCell>
                    <TableCell>{dismantleHour}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{TotalAmount}</TableCell>
                    <TableCell>{buildAmount}</TableCell>
                    <TableCell>{dismantleAmount}</TableCell>
                  </>
                )}
                <TableCell>
                  <input 
                    type="number" 
                    value={percentages[index]?.build || 0} 
                    onChange={(e) => handlePercentageChange(index, "build", e.target.value)} 
                  />
                </TableCell>
                <TableCell>
                  <input 
                    type="number" 
                    value={percentages[index]?.dismantle || 0} 
                    onChange={(e) => handlePercentageChange(index, "dismantle", e.target.value)} 
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Container>
  );
}








