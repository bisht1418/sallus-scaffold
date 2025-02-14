const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
    isProjectCreated: false,
    invite: [],
    project: [],
    projectUpdate: [],
    filterProject: [],
    scaffoldingWeight: {},
    projectName: "",
    accessLevel: 0
}
const projectSlice = createSlice({
    name: "project", initialState,
    reducers: {

        SetProjectCreated: (state, action) => {
            state.isProjectCreated = action.payload === "success" ? true : false
        },
        SetProjectinvite: (state, action) => {
            state.invite = action.payload
        },
        SetProject: (state, action) => {
            state.project = action.payload
        },
        clearProject: (state, action) => {
            state.isProjectCreated = false;
            state.invite = [];
            state.project = [];
            state.projectUpdate = [];
            state.filterProject = [];
            state.scaffoldingWeight = {};
            state.accessLevel = 0
        },
        SetProjectinviteupdate: (state, action) => {
            state.projectUpdate = action.payload
        },
        SetProjectFilterinvite: (state, action) => {
            state.filterProject = action.payload
        },
        SetscaffoldingWeight: (state, action) => {
            state.scaffoldingWeight = action.payload
        },
        SetProjectName: (state, action) => {
            state.projectName = action.payload
        },
        SetProjectAccessLevel: (state, action) => {
            state.accessLevel = action.payload
        }
    }
})

export const {
    SetProjectCreated,
    clearProject,
    SetProjectinvite,
    SetProject,
    SetProjectinviteupdate,
    SetProjectFilterinvite,
    SetscaffoldingWeight,
    SetProjectName,
    SetProjectAccessLevel

} = projectSlice.actions;

export default projectSlice.reducer;