import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getTheme = createAsyncThunk(
    'theme/fetch',
    async () => {
        try {
            const currentTheme = await window.localStorage.getItem('theme')
            if (!currentTheme) {
                return 'dark'
            }
            return currentTheme
        } catch (err) {
            console.log(err.message)
            return 'dark'
        }
    }
)
export const changeTheme = createAsyncThunk(
    'theme/change',
    async () => {
        try {
            const prevTheme = await window.localStorage.getItem('theme')
            const newTheme = prevTheme === 'dark' ? 'light' : 'dark'

            await window.localStorage.setItem('theme', theme)

            return newTheme
        } catch (err) {
            console.log(err)
        }
    }
)

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        theme: null,
    },
    reducers: {},
    extraReducers: {
        [getTheme.fulfilled]: (state, action) => {
            state.theme = action.payload
        },
        [changeTheme.fulfilled]: (state, action) => {
            state.theme = action.payload
        },
    }
})

export default themeSlice.reducer;