import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    current_language: "en",
    current_theme: "",
    is_authenticated: false
}

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setCurrentLanguage: (state, action) => {
            state.current_language = action.payload
        }
        ,
        setCurrentTheme: (state, action) => {
            state.current_theme = action.payload
        },
        setIsAuthenticated: (state, action) => {
            state.is_authenticated = action.payload
        }
    }
})

export const { setCurrentLanguage, setCurrentTheme, setIsAuthenticated } = globalSlice.actions

export default globalSlice.reducer