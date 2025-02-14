const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
    transferProject: [],
    materialListsAdmin: [],
    materialListsUser: [],
    projectTransfer: [],
    notification: []
}
const materialListWithProjectSlice = createSlice({
    name: "materialListWithProject", initialState,
    reducers: {
        SetTransferProject: (state, action) => {
            state.transferProject = action.payload
        },
        SetMaterialListsAdmin: (state, action) => {
            state.materialListsAdmin = action.payload
        },
        SetMaterialListsuser: (state, action) => {
            state.materialListsUser = action.payload
        },
        SetProjectTransfer: (state, action) => {
            state.projectTransfer = action.payload
        },
        SetNotification: (state, action) => {
            state.notification = action.payload
        },
        ClearMaterialListWithProject: (state, action) => {
            state.transferProject = [];
            state.materialListsAdmin = [];
            state.materialListsUser = [];
            state.projectTransfer = [];
            state.notification = []
        }
    }
})

export const {
    SetTransferProject,
    SetMaterialListsAdmin,
    SetMaterialListsuser,
    SetProjectTransfer,
    ClearMaterialListWithProject,
    SetNotification
} = materialListWithProjectSlice.actions;

export default materialListWithProjectSlice.reducer;
