import React, { useState } from "react";
import { useSelector } from "react-redux";

// Main Pricing Feature Component
const PricingFeature = ( m2, m3, lm, hm ) => {
//   const isAdminId = useSelector((state) => state?.admin?.loggedInAdmin?._id);
  const isAdminId = true;

  // State for pricing configurations
  const [pricing, setPricing] = useState({
    m2: "",
    m3: "",
    LM: "",
    HM: "",
    hourlyRate: "",
  });

  // State for scaffold and project data
  const [projectData, setProjectData] = useState({
    scaffoldId: "",
    scaffoldType: "",
    size: "",
    pricingModel: "volume", // default to volume-based pricing
  });

  // State to display calculated results
  const [calculatedResults, setCalculatedResults] = useState({
    buildHours: 0,
    dismantleHours: 0,
    totalCost: 0,
  });

  // Handle price input change for admins
  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setPricing((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  // Handle scaffold and project data input
  const handleProjectDataChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  // Core calculation logic based on project data
  const calculatePricing = () => {
    const { size, pricingModel } = projectData;
    const { m2, m3, LM, HM, hourlyRate } = pricing;
    let buildHours = 0;
    let dismantleHours = 0;
    let totalCost = 0;

    // Calculate based on selected pricing model
    const sizeValue = parseFloat(size) || 0;
    switch (pricingModel) {
      case "volume":
        if (projectData.scaffoldType === "Standard") {
          totalCost = sizeValue * m2;
        } else if (projectData.scaffoldType === "Hanging") {
          totalCost = sizeValue * m3;
        }
        buildHours = (sizeValue * m2 * 0.6) / hourlyRate;
        dismantleHours = (sizeValue * m2 * 0.4) / hourlyRate;
        break;
      case "fixed":
        totalCost = m2 * sizeValue; // For demonstration, adjust as per fixed logic
        break;
      case "hourly":
        buildHours = dismantleHours = sizeValue;
        totalCost = buildHours * hourlyRate;
        break;
      default:
        break;
    }

    // Set calculated results
    setCalculatedResults({
      buildHours: buildHours.toFixed(2),
      dismantleHours: dismantleHours.toFixed(2),
      totalCost: totalCost.toFixed(2),
    });
  };

  console.log(isAdminId,'isAdminId');
  console.log(m2, m3, lm, hm)

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      {isAdminId && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <label style={{ display: "flex", flexDirection: "column" }}>
              Select Pricing Model:
              <select
                name="pricingModel"
                value={projectData.pricingModel}
                onChange={handleProjectDataChange}
              >
                <option value="volume">Volume-based (m²/m³)</option>
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Job</option>
              </select>
            </label>
            {/* Conditional Hourly Rate Input (only shown if "Hourly Job" is selected) */}
            {projectData.pricingModel === "hourly" && (
              <label style={{ display: "flex", flexDirection: "column" }}>
                Hourly Rate:
                <input
                  type="number"
                  name="hourlyRate"
                  value={pricing.hourlyRate}
                  onChange={handlePricingChange}
                />
              </label>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <button
          className="bg-[#0072BB] button-text px-[18px] py-[10px] w-full text-white rounded-[5px]"
          type="button"
          onClick={calculatePricing}
        >
          Calculate
        </button>
        {/* <button type="button" onClick={calculatePricing}>
          Calculate
        </button> */}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Calculation Display</h3>
        <p>
          <strong>Build Hours:</strong> {calculatedResults.buildHours} hours
        </p>
        <p>
          <strong>Dismantle Hours:</strong> {calculatedResults.dismantleHours}{" "}
          hours
        </p>
        <p>
          <strong>Total Cost:</strong> ${calculatedResults.totalCost}
        </p>
      </div>
    </div>
  );
};

export default PricingFeature;
