import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export const PriceTable = ({ data, title, type, onEdit, onDelete, isVolume, isRent, headers }) => {
    const allHeaders = [
    ...new Set(data.flatMap(item => 
        Object.keys(item.prices).filter(key => key.toLowerCase() !== 'rent')
    )),
];

  const filteredHeaders = allHeaders.filter(unit => {
    if (isVolume) return unit !== 'Rent';
    if (isRent) return unit !== 'Volume';
    return true;
  });

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {/* Static header for Scaffold Name */}
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Scaffold Name
              </th>

              {/* Dynamic headers for price units */}
              {filteredHeaders.map(unit => (
                <th
                  key={unit}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-600"
                >
                  {unit === "Volume" ? isVolume ? "hourly rate" : unit : unit === "Rent" ? "per day" : unit}
                </th>
              ))}

              {/* Static header for Actions */}
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                {/* Scaffold Name */}
                <td className="px-4 py-3 text-sm text-gray-900">
                  {item.scaffoldName}
                </td>

                {/* Dynamic cells for price units */}
                {filteredHeaders.map(unit => (
                  <td key={unit} className="px-4 py-3 text-sm text-gray-900">
                    {item.prices[unit] ? `$${item.prices[unit]} / ${unit}` : '-'}
                    {/* {type === 'rent' && '/day'} */}
                  </td>
                ))}

                {/* Actions */}
                <td className="px-4 py-3 text-sm space-x-2">
                  <button
                    onClick={() => onEdit(item, type)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id, type)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
