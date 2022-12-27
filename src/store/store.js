import { configureStore } from "@reduxjs/toolkit";
import todosSlice from "./slices/todosSlice";
import themeSlice from "./slices/themeSlice";
import indexedDbSlice from "./slices/indexedDbSlice";

const store = configureStore({
    reducer: {
        todos: todosSlice,
        theme: themeSlice,
        indexedDb: indexedDbSlice,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false
        })
    },
})

export default store