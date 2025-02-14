import React from 'react';
import { X } from 'lucide-react';
import { PriceInput } from '../PriceInput/PriceInput';

export const EditModal = ({
    formData,
    editingState,
    onClose,
    onSubmit,
    onInputChange,
    headers
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        Edit {editingState.type === 'volume' ? 'Volume' : 'Rental'} Prices
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Scaffold Name
                        </label>
                        <input
                            type="text"
                            name="scaffoldName"
                            value={formData.scaffoldName}
                            onChange={onInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                            disabled
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {headers
                            ?.filter(unit => {
                                if (editingState.type === 'volume') return unit !== 'Rent';
                                if (editingState.type === 'rent') return unit !== 'Volume';
                                return true;
                            })
                            .map(unit => (
                                <PriceInput
                                    key={unit}
                                    unitType={unit}
                                    value={formData.prices[unit]}
                                    onChange={onInputChange}
                                    isRental={editingState.type === 'rent'}
                                />
                            ))}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}