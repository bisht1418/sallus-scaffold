import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { PriceInput } from '../PriceInput/PriceInput';
import { UNIT_TYPES } from '../constants/constants';

import { FormError } from '../Form/FormError';

export const AddScaffoldForm = ({
    formData,
    onSubmit,
    onInputChange,
    errors,
    onAddCustomUnit,
    headers
}) => {
    const [customUnit, setCustomUnit] = useState('');

    const handleAddUnitClick = () => {
        onAddCustomUnit(customUnit.trim());
        setCustomUnit(''); // Reset input
    };
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scaffold Name
                </label>
                <input
                    type="text"
                    name="scaffoldName"
                    placeholder="Type Custom Scaffold Name"
                    value={formData.scaffoldName}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.scaffoldName ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-blue-500 focus:border-blue-500`}

                />
                <FormError error={errors.scaffoldName} />
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Unit Prices</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {headers.map(unit => (
                        <PriceInput
                            key={unit}
                            unitType={unit}
                            value={formData.prices[unit]}
                            onChange={onInputChange}
                            error={errors.prices?.[unit]}
                        />
                    ))}
                </div>
                <FormError error={errors.general} />
            </div>

            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Add Custom Unit"
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    className="px-3 py-2 border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="button"
                    onClick={handleAddUnitClick}
                    className="inline-flex items-center px-4 py-3 bg-[#0072BB] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-nowrap hover:bg-[#0084D3] "
                >
                    Add Unit
                </button>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-[#0084D3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Scaffold
                </button>
            </div>
        </form>
    );

}


