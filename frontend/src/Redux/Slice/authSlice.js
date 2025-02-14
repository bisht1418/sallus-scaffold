const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
  token: "",
  loggedInUser: {},
  projectNumber: "",
  projectId: "",
  refreshToken: "",
  loading: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload?.token;
      state.refreshToken = action.payload?.refreshToken;
    },
    setUser: (state, action) => {
      state.loggedInUser = action.payload;
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
    setrefreshToken: (state, action) => {
      state.token = action.payload?.token;
      state.refreshToken = action.payload?.refreshToken;
    },
    updateSubscriptionStatus: (state, action) => {
      if (state.loggedInUser) {
        state.loggedInUser = {
          ...state.loggedInUser,
          isSubscription: action.payload
        };
      }
    },
  },
});

export const {
  setAuth,
  setUser,
  clearAuth,
  setProjectNumber,
  setLoading,
  setProjectId,
  setrefreshToken,
  updateSubscriptionStatus
} = authSlice.actions;

export default authSlice.reducer;


// Usage helper functions
export const updateUserSubscription = (dispatch, isSubscribed = false) => {
  try {
    dispatch(updateSubscriptionStatus(isSubscribed));
    return true;
  } catch (error) {
    console.error('Error updating subscription status:', error);
    return false;
  }
};
