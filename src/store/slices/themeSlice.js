import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name: {},
    initialState: {
        theme: window.localStorage.getItem('theme') || 'dark'
    },
    reducers: {
        changeTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark'
            window.localStorage.setItem('theme', state.theme)
        },
    },
})

export const {
    changeTheme,
} = themeSlice.actions;
export default themeSlice.reducer;