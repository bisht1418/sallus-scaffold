const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
    file: []
}
const fileSlice = createSlice({
    name: "file", initialState,
    reducers: {
        setFile: (state, action) => {
            state.file = action.payload
        },
    }
})

export const {
    setFile,
} = fileSlice.actions;

export default fileSlice.reducer;
