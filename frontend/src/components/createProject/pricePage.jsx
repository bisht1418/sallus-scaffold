// import React, { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   addScaffold,
//   updateScaffoldPrices,
// } from "../../Redux/Slice/scaffoldTypeSlice";

// const PricePage = () => {
//   const dispatch = useDispatch();
//   const scaffoldOptions = useSelector(
//     (state) => state.scaffolds.scaffoldOptions
//   );

//   const [newScaffold, setNewScaffold] = useState({
//     scaffoldName: "",
//     pricePerM3: "",
//     pricePerM2: "",
//     pricePerLM: "",
//     pricePerHM: "",
//     hourlyRate: "",
//   });

//   const [extraPrices, setExtraPrices] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedScaffold, setSelectedScaffold] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewScaffold({ ...newScaffold, [name]: value });
//   };

//   const handleExtraPriceChange = (index, field, value) => {
//     const updatedExtraPrices = [...extraPrices];
//     updatedExtraPrices[index][field] = value;
//     setExtraPrices(updatedExtraPrices);
//   };

//   const handleAddExtraPrice = () => {
//     setExtraPrices([...extraPrices, { name: "", value: "" }]);
//   };

//   const handleAddScaffold = () => {
//     const dynamicPrices = extraPrices.reduce((acc, item) => {
//       if (item.name && item.value) acc[item.name] = Number(item.value);
//       return acc;
//     }, {});

//     dispatch(
//       addScaffold({
//         scaffoldName: newScaffold.scaffoldName,
//         prices: {
//           pricePerM3: Number(newScaffold.pricePerM3),
//           pricePerM2: Number(newScaffold.pricePerM2),
//           pricePerLM: Number(newScaffold.pricePerLM),
//           pricePerHM: Number(newScaffold.pricePerHM),
//           hourlyRate: Number(newScaffold.hourlyRate),
//           ...dynamicPrices,
//         },
//       })
//     );

//     resetForm();
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//     setSelectedScaffold("");
//     setExtraPrices([]);
//   };

//   const handleSave = () => {
//     if (!selectedScaffold) return;

//     const dynamicPrices = extraPrices.reduce((acc, item) => {
//       if (item.name && item.value) acc[item.name] = Number(item.value);
//       return acc;
//     }, {});

//     dispatch(
//       updateScaffoldPrices({
//         scaffoldName: selectedScaffold,
//         prices: {
//           pricePerM3: Number(newScaffold.pricePerM3),
//           pricePerM2: Number(newScaffold.pricePerM2),
//           pricePerLM: Number(newScaffold.pricePerLM),
//           pricePerHM: Number(newScaffold.pricePerHM),
//           hourlyRate: Number(newScaffold.hourlyRate),
//           ...dynamicPrices,
//         },
//       })
//     );

//     setIsEditing(false);
//     resetForm();
//   };

//   const resetForm = () => {
//     setNewScaffold({
//       scaffoldName: "",
//       pricePerM3: "",
//       pricePerM2: "",
//       pricePerLM: "",
//       pricePerHM: "",
//       hourlyRate: "",
//     });
//     setExtraPrices([]);
//   };

//   const getAllDynamicColumns = () => {
//     const dynamicColumns = new Set([
//       "pricePerM3",
//       "pricePerM2",
//       "pricePerLM",
//       "pricePerHM",
//       "hourlyRate",
//     ]);

//     Object.values(scaffoldOptions).forEach((prices) => {
//       Object.keys(prices).forEach((key) => dynamicColumns.add(key));
//     });

//     extraPrices.forEach((price) => {
//       if (price.name) dynamicColumns.add(price.name);
//     });

//     return Array.from(dynamicColumns);
//   };

//   const allDynamicColumns = getAllDynamicColumns();

//   return (
//     <div className="scaffold-pricing-container">
//       <h1 className="title-text text-center mb-20">
//         {isEditing ? "Edit Scaffold" : "Add New Scaffold"}
//         {" "}
//       </h1>
//       {/* <div className="price-details">
//         {isEditing ? (
//           <select
//             name="scaffoldName"
//             value={selectedScaffold}
//             onChange={(e) => {
//               const scaffoldName = e.target.value;
//               setSelectedScaffold(scaffoldName);
//               if (scaffoldName) {
//                 const prices = scaffoldOptions[scaffoldName];
//                 setNewScaffold({
//                   scaffoldName,
//                   ...prices,
//                 });
//               }
//             }}
//           >
//             <option value="">Select Scaffold</option>
//             {Object.keys(scaffoldOptions).map((scaffold) => (
//               <option key={scaffold} value={scaffold}>
//                 {scaffold}
//               </option>
//             ))}
//           </select>
//         ) : (
//           <input
//             type="text"
//             name="scaffoldName"
//             placeholder="Scaffold Name"
//             value={newScaffold.scaffoldName}
//             onChange={handleChange}
//           />
//         )}
//         <input
//           type="number"
//           name="pricePerM3"
//           placeholder="Price Per M3"
//           value={newScaffold.pricePerM3}
//           onChange={handleChange}
//         />
//         <input
//           type="number"
//           name="pricePerM2"
//           placeholder="Price Per M2"
//           value={newScaffold.pricePerM2}
//           onChange={handleChange}
//         />
//         <input
//           type="number"
//           name="pricePerLM"
//           placeholder="Price Per LM"
//           value={newScaffold.pricePerLM}
//           onChange={handleChange}
//         />
//         <input
//           type="number"
//           name="pricePerHM"
//           placeholder="Price Per HM"
//           value={newScaffold.pricePerHM}
//           onChange={handleChange}
//         />
//         <input
//           type="number"
//           name="hourlyRate"
//           placeholder="Hourly Rate"
//           value={newScaffold.hourlyRate}
//           onChange={handleChange}
//         />

//         {extraPrices.map((price, index) => (
//           <div key={index} className="extra-price-row">
//             <input
//               type="text"
//               placeholder="Price Name"
//               value={price.name}
//               onChange={(e) =>
//                 handleExtraPriceChange(index, "name", e.target.value)
//               }
//             />
//             <input
//               type="number"
//               placeholder="Price Value"
//               value={price.value}
//               onChange={(e) =>
//                 handleExtraPriceChange(index, "value", e.target.value)
//               }
//             />
//           </div>
//         ))}

//         <button
//           className="circular-add-button bg-[#0072BB] text-white rounded-full w-[40px] h-[40px] flex items-center justify-center mt-[10px]"
//           onClick={handleAddExtraPrice}
//         >
//           +
//         </button>
//       </div> */}
//       <div className="price-details grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 px-4">
//         {isEditing ? (
//           <div className="col-span-full">
//             <select
//               name="scaffoldName"
//               value={selectedScaffold}
//               onChange={(e) => {
//                 const scaffoldName = e.target.value;
//                 setSelectedScaffold(scaffoldName);
//                 if (scaffoldName) {
//                   const prices = scaffoldOptions[scaffoldName];
//                   setNewScaffold({
//                     scaffoldName,
//                     ...prices,
//                   });
//                 }
//               }}
//               className="w-full p-2 border border-gray-300 rounded-md"
//             >
//               <option value="">Select Scaffold</option>
//               {Object.keys(scaffoldOptions).map((scaffold) => (
//                 <option key={scaffold} value={scaffold}>
//                   {scaffold}
//                 </option>
//               ))}
//             </select>
//           </div>
//         ) : (
//           <div className="col-span-full">
//             <input
//               type="text"
//               name="scaffoldName"
//               placeholder="Scaffold Name"
//               value={newScaffold.scaffoldName}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 rounded-md"
//             />
//           </div>
//         )}

//         {/* Standard Inputs */}
//         <input
//           type="number"
//           name="pricePerM3"
//           placeholder="Price Per M3"
//           value={newScaffold.pricePerM3}
//           onChange={handleChange}
//           className="w-full p-2 border border-gray-300 rounded-md"
//         />
//         <input
//           type="number"
//           name="pricePerM2"
//           placeholder="Price Per M2"
//           value={newScaffold.pricePerM2}
//           onChange={handleChange}
//           className="w-full p-2 border border-gray-300 rounded-md"
//         />
//         <input
//           type="number"
//           name="pricePerLM"
//           placeholder="Price Per LM"
//           value={newScaffold.pricePerLM}
//           onChange={handleChange}
//           className="w-full p-2 border border-gray-300 rounded-md"
//         />
//         <input
//           type="number"
//           name="pricePerHM"
//           placeholder="Price Per HM"
//           value={newScaffold.pricePerHM}
//           onChange={handleChange}
//           className="w-full p-2 border border-gray-300 rounded-md"
//         />
//         <button
//           className="circular-add-button bg-[#0072BB] text-white rounded-full w-[40px] h-[40px] flex items-center justify-center"
//           onClick={handleAddExtraPrice}
//         >
//           +
//         </button>
//         <input
//           type="number"
//           name="hourlyRate"
//           placeholder="Hourly Rate"
//           value={newScaffold.hourlyRate}
//           onChange={handleChange}
//           className="w-full p-2 border border-gray-300 rounded-md"
//         />

//         {/* Dynamic Extra Prices */}
//         {extraPrices.map((price, index) => (
//           <div key={index} className="col-span-full flex flex-wrap gap-4">
//             <input
//               type="text"
//               placeholder="Price Name"
//               value={price.name}
//               onChange={(e) =>
//                 handleExtraPriceChange(index, "name", e.target.value)
//               }
//               className="w-full sm:w-[45%] p-2 border border-gray-300 rounded-md"
//             />
//             <input
//               type="number"
//               placeholder="Price Value"
//               value={price.value}
//               onChange={(e) =>
//                 handleExtraPriceChange(index, "value", e.target.value)
//               }
//               className="w-full sm:w-[45%] p-2 border border-gray-300 rounded-md"
//             />
//           </div>
//         ))}

//         {/* Circular Add Button */}
//         {/* <div className="col-span-full flex justify-center mt-4">
//           <button
//             className="circular-add-button bg-[#0072BB] text-white rounded-full w-[40px] h-[40px] flex items-center justify-center"
//             onClick={handleAddExtraPrice}
//           >
//             +
//           </button>
//         </div> */}
//       </div>
//       <div className="flex justify-around items-center">
//         <button
//           className="button-text bg-[#0072BB] px-[20px] mt-[20px] py-[10px] rounded-[5px] text-white"
//           onClick={handleAddScaffold}
//           disabled={isEditing}
//         >
//           Add Scaffold
//         </button>
//         <button
//           className="button-text bg-[#0072BB] px-[20px] mt-[20px] py-[10px] rounded-[5px] text-white"
//           onClick={isEditing ? handleSave : handleEdit}
//           disabled={!isEditing && !Object.keys(scaffoldOptions).length}
//         >
//           {isEditing ? "Save" : "Edit"}
//         </button>
//       </div>
//       <table className="min-w-full table-auto border-collapse">
//         <thead>
//           <tr>
//             <th>Scaffold Type</th>
//             {allDynamicColumns.map((col) => (
//               <th key={col}>{col}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {Object.entries(scaffoldOptions).map(([scaffold, prices]) => (
//             <tr key={scaffold}>
//               <td>{scaffold}</td>
//               {allDynamicColumns.map((col) => (
//                 <td key={col}>{prices[col] !== undefined ? prices[col] : 0}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PricePage;

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addScaffold,
  updateScaffoldPrices,
  deleteScaffold, // Add the delete action
} from "../../Redux/Slice/scaffoldTypeSlice";

const PricePage = () => {
  const dispatch = useDispatch();
  const scaffoldOptions = useSelector(
    (state) => state.scaffolds.scaffoldOptions
  );

  const [newScaffold, setNewScaffold] = useState({
    scaffoldName: "",
    pricePerM3: "",
    pricePerM2: "",
    pricePerLM: "",
    pricePerHM: "",
    hourlyRate: "",
  });

  const [extraPrices, setExtraPrices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedScaffold, setSelectedScaffold] = useState("");
  const [error, setError] = useState(""); // Error state for validation
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [scaffoldToDelete, setScaffoldToDelete] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewScaffold({ ...newScaffold, [name]: value });
  };

  const handleExtraPriceChange = (index, field, value) => {
    const updatedExtraPrices = [...extraPrices];
    updatedExtraPrices[index][field] = value;
    setExtraPrices(updatedExtraPrices);
  };

  const handleAddExtraPrice = () => {
    setExtraPrices([...extraPrices, { name: "", value: "" }]);
  };

  const handleAddScaffold = () => {
    if (!newScaffold.scaffoldName.trim()) {
      setError("Scaffold name cannot be empty!");
      return;
    }

    setError(""); // Clear error
    const dynamicPrices = extraPrices.reduce((acc, item) => {
      if (item.name && item.value) acc[item.name] = Number(item.value);
      return acc;
    }, {});

    dispatch(
      addScaffold({
        scaffoldName: newScaffold.scaffoldName,
        prices: {
          pricePerM3: Number(newScaffold.pricePerM3),
          pricePerM2: Number(newScaffold.pricePerM2),
          pricePerLM: Number(newScaffold.pricePerLM),
          pricePerHM: Number(newScaffold.pricePerHM),
          hourlyRate: Number(newScaffold.hourlyRate),
          ...dynamicPrices,
        },
      })
    );

    resetForm();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSelectedScaffold("");
    setExtraPrices([]);
  };

  const handleSave = () => {
    if (!selectedScaffold) return;

    if (!newScaffold.scaffoldName.trim()) {
      setError("Scaffold name cannot be empty!");
      return;
    }

    setError(""); // Clear error
    const dynamicPrices = extraPrices.reduce((acc, item) => {
      if (item.name && item.value) acc[item.name] = Number(item.value);
      return acc;
    }, {});

    dispatch(
      updateScaffoldPrices({
        scaffoldName: selectedScaffold,
        prices: {
          pricePerM3: Number(newScaffold.pricePerM3),
          pricePerM2: Number(newScaffold.pricePerM2),
          pricePerLM: Number(newScaffold.pricePerLM),
          pricePerHM: Number(newScaffold.pricePerHM),
          hourlyRate: Number(newScaffold.hourlyRate),
          ...dynamicPrices,
        },
      })
    );

    setIsEditing(false);
    resetForm();
  };

  const handleDelete = (scaffoldName) => {
    dispatch(deleteScaffold(scaffoldName));
  };
  // Open confirmation popup
  const handleDeleteClick = (scaffoldName) => {
    setScaffoldToDelete(scaffoldName);
    setIsPopupOpen(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    dispatch(deleteScaffold(scaffoldToDelete));
    setIsPopupOpen(false);
    setScaffoldToDelete("");
  };

  // Cancel deletion
  const cancelDelete = () => {
    setIsPopupOpen(false);
    setScaffoldToDelete("");
  };

  const resetForm = () => {
    setNewScaffold({
      scaffoldName: "",
      pricePerM3: "",
      pricePerM2: "",
      pricePerLM: "",
      pricePerHM: "",
      hourlyRate: "",
    });
    setExtraPrices([]);
  };

  const getAllDynamicColumns = () => {
    const dynamicColumns = new Set([
      "pricePerM3",
      "pricePerM2",
      "pricePerLM",
      "pricePerHM",
      "hourlyRate",
    ]);

    Object.values(scaffoldOptions).forEach((prices) => {
      Object.keys(prices).forEach((key) => dynamicColumns.add(key));
    });

    extraPrices.forEach((price) => {
      if (price.name) dynamicColumns.add(price.name);
    });

    return Array.from(dynamicColumns);
  };

  const allDynamicColumns = getAllDynamicColumns();

  return (
    <div className="scaffold-pricing-container">
      <>
      <h1 className="title-text text-center mb-10">
        {isEditing ? "Edit Scaffold" : "Add New Scaffold"}
      </h1>
      <div className="price-details grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7 px-4">
        {/* Add/Edit Form */}
        {isEditing ? (
          <div className="col-span-full">
            <select
              name="scaffoldName"
              value={selectedScaffold}
              onChange={(e) => {
                const scaffoldName = e.target.value;
                setSelectedScaffold(scaffoldName);
                if (scaffoldName) {
                  const prices = scaffoldOptions[scaffoldName];
                  setNewScaffold({
                    scaffoldName,
                    ...prices,
                  });
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Scaffold</option>
              {Object.keys(scaffoldOptions).map((scaffold) => (
                <option key={scaffold} value={scaffold}>
                  {scaffold}
                </option>
              ))}
            </select>
          </div>
        ) : (
          // <div className="col-span-full">
          <>
            <input
              type="text"
              name="scaffoldName"
              placeholder="Scaffold Type"
              value={newScaffold.scaffoldName}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md"
            />
            {error && <p className="text-red-500">{error}</p>}
          </>
          // </div>
        )}
        <input
          type="number"
          name="pricePerM3"
          placeholder="Price Per M3"
          value={newScaffold.pricePerM3}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded-md"
        />
        <input
          type="number"
          name="pricePerM2"
          placeholder="Price Per M2"
          value={newScaffold.pricePerM2}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded-md"
        />
        <input
          type="number"
          name="pricePerLM"
          placeholder="Price Per LM"
          value={newScaffold.pricePerLM}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded-md"
        />
        <input
          type="number"
          name="pricePerHM"
          placeholder="Price Per HM"
          value={newScaffold.pricePerHM}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded-md"
        />
        <button
          className="circular-add-button bg-[#0072BB] text-white rounded-full w-[40px] h-[40px] flex items-center justify-center"
          onClick={handleAddExtraPrice}
        >
          +
        </button>
        <input
          type="number"
          name="hourlyRate"
          placeholder="Hourly Rate"
          value={newScaffold.hourlyRate}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded-md"
        />
        {/* Dynamic Extra Prices */}
        {extraPrices.map((price, index) => (
          <div key={index} className="col-span-full flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Scaffold Type"
              value={price.name}
              onChange={(e) =>
                handleExtraPriceChange(index, "name", e.target.value)
              }
              className="w-full sm:w-[45%] p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Price"
              value={price.value}
              onChange={(e) =>
                handleExtraPriceChange(index, "value", e.target.value)
              }
              className="w-full sm:w-[45%] p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
      </div>
      {/* Action Buttons */}
      <div className="flex justify-around items-center">
        <button
          className="button-text bg-[#0072BB] px-[20px] mt-[20px] py-[10px] rounded-[5px] text-white"
          onClick={handleAddScaffold}
          disabled={isEditing}
        >
          Add Scaffold
        </button>
        <h1 className="title-text text-center mb-10">Volume</h1>
        <button
          className="button-text bg-[#0072BB] px-[20px] mt-[20px] py-[10px] rounded-[5px] text-white"
          onClick={isEditing ? handleSave : handleEdit}
          disabled={!isEditing && !Object.keys(scaffoldOptions).length}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
      {/* Table */}
      <div className="overflow-x-auto mt-10">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="text-left px-2 py-1 text-sm sm:text-base">Scaffold Type</th>
            {allDynamicColumns.map((col) => (
              <th className="text-left px-2 py-1 text-sm sm:text-base" key={col}>{col}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(scaffoldOptions).map(([scaffold, prices]) => (
            <tr key={scaffold}>
              <td className="text-left px-2 py-1 text-sm sm:text-base" >{scaffold}</td>
              {allDynamicColumns.map((col) => (
                <td className="text-left px-2 py-1 text-sm sm:text-base" key={col}>{prices[col] !== undefined ? prices[col] : 0}</td>
              ))}
              <td>
                <button
                  className="button-text bg-red-500 px-4 py-2 text-white rounded-md"
                  onClick={() => handleDeleteClick(scaffold)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {isPopupOpen && (
        <div className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="popup-content bg-white p-6 rounded-md shadow-md">
            <p className="text-center mb-4">
              Are you sure you want to delete the scaffold{" "}
              <strong>{scaffoldToDelete}</strong>?
            </p>
            <div className="flex justify-around">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      <>
      {/* Action Buttons */}
      <div className="flex justify-around items-center">
        {/* <button
          className="button-text bg-[#0072BB] px-[20px] mt-[20px] py-[10px] rounded-[5px] text-white"
          onClick={handleAddScaffold}
          disabled={isEditing}
        >
          Add Scaffold
        </button> */}
        <h1 className="title-text text-center mb-10 px-[20px] mt-[20px] py-[10px] rounded-[5px] text-white">Rent</h1>
        {/* <button
          className="button-text bg-[#0072BB] px-[20px] mt-[20px] py-[10px] rounded-[5px] text-white"
          onClick={isEditing ? handleSave : handleEdit}
          disabled={!isEditing && !Object.keys(scaffoldOptions).length}
        >
          {isEditing ? "Save" : "Edit"}
        </button> */}
      </div>
      {/* Table */}
      <div className="overflow-x-auto mt-10">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="text-left px-2 py-1 text-sm sm:text-base">Scaffold Type</th>
            {allDynamicColumns.map((col) => (
              <th className="text-left px-2 py-1 text-sm sm:text-base" key={col}>{col}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(scaffoldOptions).map(([scaffold, prices]) => (
            <tr key={scaffold}>
              <td className="text-left px-2 py-1 text-sm sm:text-base" >{scaffold}</td>
              {allDynamicColumns.map((col) => (
                <td className="text-left px-2 py-1 text-sm sm:text-base" key={col}>{prices[col] !== undefined ? prices[col] : 0}</td>
              ))}
              <td>
                <button
                  className="button-text bg-red-500 px-4 py-2 text-white rounded-md"
                  onClick={() => handleDeleteClick(scaffold)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {isPopupOpen && (
        <div className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="popup-content bg-white p-6 rounded-md shadow-md">
            <p className="text-center mb-4">
              Are you sure you want to delete the scaffold{" "}
              <strong>{scaffoldToDelete}</strong>?
            </p>
            <div className="flex justify-around">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </>

    </div>
  );
};

export default PricePage;
