// // src/Redux/Slice/scaffoldSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
// scaffoldOptions : {
//         "Standard Scaffold": {
//           pricePerM3: 0,
//           pricePerM2: 0,
//           pricePerLM: 0,
//           pricePerHM: 0,
//           hourlyRate: 0,
//         },
//         "Fasade Scaffold": {
//           pricePerM3: 0,
//           pricePerM2: 0,
//           pricePerLM: 0,
//           pricePerHM: 0,
//           hourlyRate: 0,
//         },
//         "Hanging Scaffold": {
//           pricePerM3: 0,
//           pricePerM2: 0,
//           pricePerLM: 0,
//           pricePerHM: 0,
//           hourlyRate: 0,
//         },
//         "Rolling Scaffold": {
//           pricePerM3: 0,
//           pricePerM2: 0,
//           pricePerLM: 0,
//           pricePerHM: 0,
//           hourlyRate: 0,
//         },
//         "Support Scaffold": {
//           pricePerM3: 0,
//           pricePerM2: 0,
//           pricePerLM: 0,
//           pricePerHM: 0,
//           hourlyRate: 0,
//         },
//     }
// };

// const scaffoldSlice = createSlice({
//   name: "scaffolds",
//   initialState,
//   reducers: {
//     addScaffold: (state, action) => {
//       const { scaffoldName, prices } = action.payload;
//       state.scaffoldOptions[scaffoldName] = prices;
//     },
//     updateScaffoldPrices: (state, action) => {
//       const { scaffoldName, prices } = action.payload;
//       state.scaffoldOptions[scaffoldName] = {
//         ...state.scaffoldOptions[scaffoldName],
//         ...prices,
//       };
//     },
//   },
// });

// export const { addScaffold, updateScaffoldPrices } = scaffoldSlice.actions;
// export default scaffoldSlice.reducer;



// src/Redux/Slice/scaffoldSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   scaffoldOptions: {
//     "Standard Scaffold": {
//       pricePerM3: 0,
//       pricePerM2: 0,
//       pricePerLM: 0,
//       pricePerHM: 0,
//       hourlyRate: 0,
//     },
//     "Fasade Scaffold": {
//       pricePerM3: 0,
//       pricePerM2: 0,
//       pricePerLM: 0,
//       pricePerHM: 0,
//       hourlyRate: 0,
//     },
//     "Hanging Scaffold": {
//       pricePerM3: 0,
//       pricePerM2: 0,
//       pricePerLM: 0,
//       pricePerHM: 0,
//       hourlyRate: 0,
//     },
//     "Rolling Scaffold": {
//       pricePerM3: 0,
//       pricePerM2: 0,
//       pricePerLM: 0,
//       pricePerHM: 0,
//       hourlyRate: 0,
//     },
//     "Support Scaffold": {
//       pricePerM3: 0,
//       pricePerM2: 0,
//       pricePerLM: 0,
//       pricePerHM: 0,
//       hourlyRate: 0,
//     },
//   },
// };

// const scaffoldSlice = createSlice({
//   name: "scaffolds",
//   initialState,
//   reducers: {
//     addScaffold: (state, action) => {
//       const { scaffoldName, prices } = action.payload;
//       state.scaffoldOptions[scaffoldName] = prices;
//     },
//     // updateScaffoldPrices: (state, action) => {
//     //   const { scaffoldName, prices } = action.payload;
//     //   state.scaffoldOptions[scaffoldName] = {
//     //     ...state.scaffoldOptions[scaffoldName],
//     //     ...prices,
//     //   };
//     // },
//     updateScaffoldPrices: (state, action) => {
//       const { scaffoldName, prices } = action.payload;
//       state.scaffoldOptions[scaffoldName] = {
//         ...state.scaffoldOptions[scaffoldName],
//         ...prices, // Dynamically add new fields here
//       };
//     },
//     deleteScaffold: (state, action) => {
//       const scaffoldName = action.payload;
//       delete state.scaffoldOptions[scaffoldName];
//     },
//   },
// });

// export const { addScaffold, updateScaffoldPrices, deleteScaffold } = scaffoldSlice.actions;
// export default scaffoldSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scaffoldOptions: {},
};

const scaffoldTypeSlice = createSlice({
  name: "scaffolds",
  initialState,
  reducers: {
    addScaffold(state, action) {
      const { scaffoldName, prices } = action.payload;
      state.scaffoldOptions[scaffoldName] = prices;
    },
    updateScaffoldPrices(state, action) {
      const { scaffoldName, prices } = action.payload;
      if (state.scaffoldOptions[scaffoldName]) {
        state.scaffoldOptions[scaffoldName] = {
          ...state.scaffoldOptions[scaffoldName],
          ...prices,
        };
      }
    },
    deleteScaffold(state, action) {
      const scaffoldName = action.payload;
      delete state.scaffoldOptions[scaffoldName];
    },
  },
});

export const { addScaffold, updateScaffoldPrices, deleteScaffold } =
  scaffoldTypeSlice.actions;
export default scaffoldTypeSlice.reducer;


