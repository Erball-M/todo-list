import { configureStore } from "@reduxjs/toolkit";
import todosSlice from "./slices/todosSlice";
import themeSlice from "./slices/themeSlice";

const store = configureStore({
    reducer: {
        todos: todosSlice,
        theme: themeSlice,
    },
})

export default store