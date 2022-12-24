import { createSlice } from "@reduxjs/toolkit";

const indexedDBSlice = createSlice({
    name: 'indexedDb',
    initialState: {
        db: null,
    },
    reducers: {
        setDb: (state, action) => {
            state.db = action.payload
        },
    }
})

export const {
    setDb
} = indexedDBSlice.actions
export default indexedDBSlice.reducer;