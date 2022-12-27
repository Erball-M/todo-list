import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { indexedDBStart } from "../../API/indexedDB";
import { setDb } from "./indexedDbSlice";

export const getData = createAsyncThunk(
    'todos/getDate',
    async (_, { dispatch }) => {
        const response = await indexedDBStart((db) => dispatch(setDb(db)))

        dispatch(setTodos([...response.todos]))
        dispatch(setCategories([...response.categories]))
        dispatch(setCategoriesOrder([...response.categoriesOrder]))
        dispatch(setStats({ ...response.stats }))
    }
)

const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        categories: [
            { id: '0', name: 'Без категории', categoryTodos: [] },
        ],
        todos: [],
        categoriesOrder: null,
        stats: {
            done: 0,
            total: 0,
        }
    },
    reducers: {
        addTodo: (state, action) => {
            state.todos.push({
                ...action.payload,
                completed: false,
                created: (new Date()).toLocaleDateString(),
            })
            state.categories.find(category => category.id === action.payload.categoryId).categoryTodos.push(action.payload.id)
            state.stats.total += 1
        },
        toggleCompleted: (state, action) => {
            const index = state.todos.findIndex(todo => todo.id === action.payload)

            if (!state.todos[index].completed) {
                state.stats.done += 1
            } else {
                if (state.stats.done - 1 >= 0) state.stats.done -= 1
            }

            state.todos.splice(index, 1, { ...state.todos[index], completed: !state.todos[index].completed })
        },
        removeTodo: (state, action) => {
            const zxx = state.categories.find(category => category.categoryTodos.includes(action.payload))
            zxx.categoryTodos = zxx.categoryTodos.filter(todoId => todoId !== action.payload)
            state.todos = state.todos.filter(todo => todo.id !== action.payload)
        },
        addCategory: (state, action) => {
            state.categories.push({ ...action.payload, categoryTodos: [] })
            state.categoriesOrder.push(action.payload.id)
        },
        setOrder: (state, action) => {
            state.categories.find(category => category.id === action.payload.id).categoryTodos = action.payload.order
        },
        setCategoriesOrder: (state, action) => {
            state.categoriesOrder = action.payload
        },
        setCategories: (state, action) => {
            state.categories = action.payload
        },
        setTodos: (state, action) => {
            state.todos = action.payload
        },
        setStats: (state, action) => {
            state.stats.total = action.payload.total
            state.stats.done = action.payload.done
        },
    },
})

export const {
    addTodo,
    toggleCompleted,
    removeTodo,
    addCategory,
    setOrder,
    setCategoriesOrder,
    setCategories,
    setTodos,
    setStats,
} = todosSlice.actions;
export default todosSlice.reducer