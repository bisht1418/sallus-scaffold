const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
  token: "",
  loggedInUser: {},
  projectNumber: "",
  projectId: "",
  refreshToken: "",
  loading: false,
};
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload?.token;
      state.refreshToken = action.payload?.refreshToken;
    },
    setAdmin: (state, action) => {
      state.loggedInAdmin = action.payload;
    },
    clearAuth: (state, action) => {
      state.token = "";
      state.loggedInUser = {};
      state.projectNumber = "";
    },
    setProjectNumber: (state, action) => {
      state.projectNumber = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProjectId: (state, action) => {
      state.projectId = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.token = action.payload?.token;
      state.refreshToken = action.payload?.refreshToken;
    },
  },
});

export const {
  setAuth,
  setAdmin,
  clearAuth,
  setProjectNumber,
  setLoading,
  setProjectId,
  setRefreshToken,
} = adminSlice.actions;

export default adminSlice.reducer;
