const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
 subscription: {},
 subscriptionTypes: [],
 allottedSubscription: {}
}

const subscriptionSlice = createSlice({
 name: "subscription", initialState,
 reducers: {
  setSubscription: (state, action) => {
   state.subscription = action.payload
  },
  setSubscriptionTypes: (state, action) => {
   state.subscriptionTypes = action.payload
  },
  setAllottedSubscription: (state, action) => {
   state.allottedSubscription = action.payload
  },
  clearSubscription: (state, action) => {
   state.subscription = {}
  },
  clearSubscriptionTypes: (state, action) => {
   state.subscriptionTypes = []
  },
  clearAllottedSubscription: (state, action) => {
   state.allottedSubscription = {}
  },
 }
})

export const {
 setSubscription,
 setSubscriptionTypes,
 setAllottedSubscription,
 clearSubscription,
 clearAllottedSubscription,
 clearSubscriptionTypes,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
