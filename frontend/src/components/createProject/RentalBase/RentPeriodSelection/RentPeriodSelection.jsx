import React, { useState, useEffect, useCallback } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  TablePagination,
  Alert,
  InputAdornment,
} from "@mui/material";
import { Search } from "lucide-react";
import { ExportButtons } from "../ExportButton/ExportButton";
import debounce from "lodash/debounce";

const normalizeUnit = (unit) => {
  const normalized = unit.toLowerCase().trim();

  if (normalized === "m2" || normalized === "m²") {
    return "m²";
  }
  if (normalized === "m3" || normalized === "m³") {
    return "m³";
  }
  if (normalized === "lm" || normalized === "hm") {
    return normalized.toLowerCase();
  }
  return normalized;
};

const extractNumber = (str) => {
  const match = String(str).match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

const calculateDaysDifference = (buildDate, dismantleDate) => {
  if (!buildDate || buildDate === "Invalid Date") return 0;
  const start = new Date(buildDate);
  const end =
    dismantleDate &&
    dismantleDate !== "(Not entered yet)" &&
    dismantleDate !== "Invalid Date"
      ? new Date(dismantleDate)
      : new Date();
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateTotalPrice = (dailyPrice, size, days) => {
  const numericSize = extractNumber(size);
  return numericSize && dailyPrice ? dailyPrice * numericSize * days : 0;
};

function manipulateScaffoldData(data, rentData) {
  const result = [];
  if (!Array.isArray(data)) return result;

  data.forEach((scaffoldData) => {
    if (!scaffoldData || !Array.isArray(scaffoldData.scaffoldName)) return;

    scaffoldData.scaffoldName.forEach((scaffold) => {
      if (!scaffold || !scaffold.measurements) return;

      const scaffoldType = scaffold.key || "Unknown";
      const measurements = scaffold.measurements;

      Object.entries(measurements || {}).forEach(([unit, dimensions]) => {
        if (!Array.isArray(dimensions)) return;

        dimensions.forEach((dimension) => {
          if (!dimension) return;

          let size = "";
          const normalizedUnit = normalizeUnit(unit);

          const length = parseFloat(dimension.length) || 0;
          const width = parseFloat(dimension.width) || 0;
          const height = parseFloat(dimension.height) || 0;

          if (normalizedUnit === "m²" || normalizedUnit === "m3") {
            const area = length * width;
            size = `${area.toFixed(2)} m²`;
          } else if (normalizedUnit === "m³" || normalizedUnit === "m3") {
            const volume = length * width * height;
            size = `${volume.toFixed(2)} m³`;
          } else if (
            normalizedUnit === "lm" ||
            normalizedUnit === "hm" ||
            normalizedUnit === "LM" ||
            normalizedUnit === "HM"
          ) {
            if (normalizedUnit === "lm" || normalizedUnit === "LM") {
              size = `${length.toFixed(2)} ${unit.toUpperCase()}`;
            } else {
              size = `${height.toFixed(2)} ${unit.toUpperCase()}`;
            }
          }

          const buildDate =
            scaffoldData.date && !isNaN(Date.parse(scaffoldData.date))
              ? new Date(scaffoldData.date).toISOString().split("T")[0]
              : null;

          const dismantleDate =
            scaffoldData.dismantledDate &&
            !isNaN(Date.parse(scaffoldData.dismantledDate))
              ? new Date(scaffoldData.dismantledDate)
                  .toISOString()
                  .split("T")[0]
              : "(Not entered yet)";

          if (size && buildDate) {
            result.push({
              id: scaffoldData._id
                ? String(scaffoldData._id).slice(0, 6)
                : Math.random().toString(36).slice(2, 8),
              type: scaffoldType,
              size: size,
              buildDate,
              dismantleDate,
              position: scaffoldData.location || "Unknown",
              dailyPrice: 0,
              scaffoldId: scaffoldData?.scaffoldIdentificationNumber,
            });
          }
        });
      });
    });
  });

  return result;
}

export default function RentPeriodSelection({
  rentData,
  headers,
  loading,
  approvalFormData,
  projectId,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredScaffolds, setFilteredScaffolds] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scaffolds, setScaffolds] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Initialize scaffolds from approval form data
  useEffect(() => {
    try {
      if (Array.isArray(approvalFormData) && approvalFormData.length > 0) {
        const manipulatedData = manipulateScaffoldData(
          approvalFormData,
          rentData
        );
        setScaffolds(manipulatedData);
        setError(null);
      }
    } catch (error) {
      setError("Error loading approval form data. Please try again.");
      console.error("Error processing approval form data:", error);
    }
  }, [approvalFormData]);

  // Update prices when rent data changes
  useEffect(() => {
    if (!scaffolds.length || !rentData?.length) return;
    try {
      const updatedScaffolds = scaffolds.map((scaffold) => {
        const rentItem = rentData.find(
          (item) =>
            item.scaffoldName.toLowerCase() === scaffold.type.toLowerCase()
        );

        if (rentItem) {
          const sizeUnit = normalizeUnit(scaffold.size.split(" ")[1]);
          const priceEntry = Object.entries(rentItem.prices).find(
            ([unit]) => normalizeUnit(unit) === sizeUnit
          );

          if (priceEntry) {
            return { ...scaffold, dailyPrice: parseFloat(priceEntry[1]) };
          }
        }
        return { ...scaffold, dailyPrice: 0 };
      });

      setScaffolds(updatedScaffolds);
      setFilteredScaffolds(updatedScaffolds);
      setError(null);
    } catch (error) {
      setError("Error updating prices. Please refresh the page.");
      console.error("Error updating daily prices:", error);
    }
  }, [rentData, scaffolds.length]);

  const handleDateChange = useCallback((id, field, value) => {
    try {
      setScaffolds((prevScaffolds) =>
        prevScaffolds.map((scaffold) =>
          scaffold.id === id ? { ...scaffold, [field]: value } : scaffold
        )
      );
      setError(null);
    } catch (error) {
      setError("Error updating date. Please try again.");
      console.error("Error updating date:", error);
    }
  }, []);

  const calculateGrandTotal = useCallback(() => {
    return filteredScaffolds.reduce((total, scaffold) => {
      const days = calculateDaysDifference(
        scaffold.buildDate,
        scaffold.dismantleDate
      );
      return (
        total + calculateTotalPrice(scaffold.dailyPrice, scaffold.size, days)
      );
    }, 0);
  }, [filteredScaffolds]);

  const getCurrentPageScaffolds = useCallback(() => {
    return filteredScaffolds.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredScaffolds, page, rowsPerPage]);

  const handleSearch = debounce((searchValue) => {
    setSearchQuery(searchValue);
    setPage(0);
  }, 300);

  // Filter scaffolds based on search query
  useEffect(() => {
    if (!scaffolds) return;

    const filtered = scaffolds.filter((scaffold) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        scaffold.id.toLowerCase().includes(searchLower) ||
        scaffold.type.toLowerCase().includes(searchLower) ||
        scaffold.position.toLowerCase().includes(searchLower)
      );
    });

    setFilteredScaffolds(filtered);
  }, [searchQuery, scaffolds]);

  return (
    <div className="p-6">
      <Typography variant="h4" component="h1" gutterBottom className="mb-6">
        Rent Period Selection
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="mb-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center">
            <Search className="h-5 w-5 text-gray-500" />
          </span>
          <input
            type="text"
            placeholder="Search by ID, Type, or Position..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
          />
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="scaffold table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "action.hover" }}
              >
                Scaffold ID
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "action.hover" }}
              >
                Scaffold Type
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "action.hover" }}
              >
                Position
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "action.hover" }}
              >
                Build Date
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "action.hover" }}
              >
                Dismantle Date
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "action.hover" }}
              >
                Days
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "action.hover" }}
              >
                Size/Volume
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "action.hover" }}
              >
                Daily Price
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "action.hover" }}
              >
                Total Price
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCurrentPageScaffolds().map((row) => {
              const days = calculateDaysDifference(
                row.buildDate,
                row.dismantleDate
              );
              const totalPrice = calculateTotalPrice(
                row.dailyPrice,
                row.size,
                days
              );
              return (
                <TableRow
                  key={row.scaffoldId + Math.random()}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row.scaffoldId}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.position}</TableCell>
                  <TableCell>
                    <input
                      type="date"
                      value={row.buildDate || ""}
                      onChange={(e) =>
                        handleDateChange(row.id, "buildDate", e.target.value)
                      }
                      className="p-2 border rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="date"
                      value={
                        row.dismantleDate === "(Not entered yet)"
                          ? new Date().toISOString().split("T")[0]
                          : row.dismantleDate || ""
                      }
                      onChange={(e) =>
                        handleDateChange(
                          row.id,
                          "dismantleDate",
                          e.target.value ||
                            new Date().toISOString().split("T")[0]
                        )
                      }
                      className="p-2 border rounded"
                    />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {days} days
                  </TableCell>
                  <TableCell>{row.size}</TableCell>
                  <TableCell>$ {row.dailyPrice.toFixed(2)}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                    $ {totalPrice.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow
              sx={{
                backgroundColor: "#f5f5f5",
                "& > td": { fontWeight: "bold" },
                whiteSpace: "nowrap",
              }}
            >
              <TableCell colSpan={8} align="right">
                Total:
              </TableCell>
              <TableCell>$ {calculateGrandTotal().toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredScaffolds.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />

        <ExportButtons scaffolds={filteredScaffolds} />
      </TableContainer>
    </div>
  );
}
