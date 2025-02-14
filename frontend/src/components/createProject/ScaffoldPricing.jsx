import React from "react";
import "./ScaffoldPricing.css";

const ScaffoldPricing = ({ selectedScaffoldType, priceDetails, isAdminId, handlePriceChange }) => {
  return (
    <div className="scaffold-pricing-container">
      {selectedScaffoldType ? (
        <div className="price-details">
          <h3>{selectedScaffoldType}</h3>
          {["pricePerM3", "pricePerM2", "pricePerLM", "pricePerHM", "hourlyRate"].map((field) => (
            <div className="price-row" key={field}>
              <span>{field.replace("pricePer", "Price per ")}:</span>
              {isAdminId ? (
                <input
                  type="number"
                  value={priceDetails ? priceDetails[field] : ""}
                  onChange={(e) => handlePriceChange(field, e.target.value)}
                  className="admin-input"
                />
              ) : (
                <span>${priceDetails ? priceDetails[field] : "N/A"}</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="placeholderAnth">
          Please select a scaffold type to view prices.
        </p>
      )}
    </div>
  );
};

export default ScaffoldPricing;