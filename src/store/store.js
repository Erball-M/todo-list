import { configureStore } from "@reduxjs/toolkit";
import todosSlice from "./slices/todosSlice";
import themeSlice from "./slices/themeSlice";
import quotesSlice from "./slices/quotesSlice";

const store = configureStore({
    reducer: {
        todos: todosSlice,
        theme: themeSlice,
        quotes: quotesSlice,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false
        })
    },
})

export default store