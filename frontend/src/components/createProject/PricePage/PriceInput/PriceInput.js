import React from 'react';
import { FormError } from '../Form/FormError';


export const PriceInput = ({ unitType, value, onChange, isRental, error }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {`${unitType !== "Volume" ? unitType : ""} ${unitType !== "Volume" ? "Price" : ""} ${unitType === "Volume" ? "Hourly rate" : unitType === "Rent" ? "per day" : ""}`}
        </label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(e, unitType)}
            className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'
                } focus:ring-blue-500 focus:border-blue-500`}
            min="0"
            step="0.01"
            placeholder={`Price per ${unitType}${isRental ? '/day' : ''}`}
        />
        <FormError error={error} />
    </div>
);