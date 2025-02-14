const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
  aluhak: [],
  alustar: [],
  layher: [],
  customList: [],
  searchList: [],
};
const materialListSlice = createSlice({
  name: "materialList",
  initialState,
  reducers: {
    SetMaterialList: (state, action) => {
      state.aluhak = action.payload.data[action.payload.lang].aluhak;
      state.alustar = action.payload.data[action.payload.lang].alustar;
      state.layher = action.payload.data[action.payload.lang].layher;
      state.customList = action.payload.data[action.payload.lang].customList;
    },
    CreateMaterialList: (state, action) => {
      state.customList = [...state.customList, action.payload];
    },
    UpdateMaterialList: (state, action) => {
      state.customList = action.payload;
    },
    clearMaterialList: (state, action) => {
      state.aluhak = [];
      state.alustar = [];
      state.layher = [];
      state.customList = [];
    },
    clearCreateMaterialList: (state, action) => {
      state.customList = [];
    },
    setSearchMaterialLits: (state, action) => {
      state.searchList = action.payload;
    },
    clearSearchMaterialLits: (state, action) => {
      state.searchList = [];
    },
  },
});

export const {
  SetMaterialList,
  clearMaterialList,
  CreateMaterialList,
  UpdateMaterialList,
  clearCreateMaterialList,
  setSearchMaterialLits,
  clearSearchMaterialLits,
} = materialListSlice.actions;

export default materialListSlice.reducer;
