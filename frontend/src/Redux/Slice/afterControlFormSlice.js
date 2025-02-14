const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  afterControl: [],
  visualInspection: [],
  afterControlForm: [],
};

const afterControlSlice = createSlice({
  name: "aftercontrol",
  initialState,
  reducers: {
    SetAfterControl: (state, action) => {
      state.afterControl = action.payload;
    },
    SetVisualInspection: (state, action) => {
      const visualInspection = state.visualInspection || [];
      const newVisualInspection = visualInspection.filter(
        (item) => item.id !== action?.payload?.id
      );
      const newData = [...newVisualInspection, action.payload];
      state.visualInspection = newData;
    },
    SetAfterControlForm: (state, action) => {
      state.afterControlForm = action.payload;
    },
    EditAfterControlForm: (state, action) => {
      const AfterControl = state?.afterControlForm[0]?.afterControl?.map(
        (item) =>
          item?.id === action.payload?.id
            ? { ...item, control: action.payload?.visual }
            : item
      );
      state.afterControlForm = [
        { ...state.afterControlForm[0], afterControl: AfterControl },
      ];
    },
    visualInspectionClear: (state, action) => {
      state.visualInspection = [];
    },
  },
});

export const {
  SetAfterControl,
  SetVisualInspection,
  SetApprovalData,
  visualInspectionClear,
  SetAfterControlForm,
  EditAfterControlForm,
} = afterControlSlice.actions;

export default afterControlSlice.reducer;
