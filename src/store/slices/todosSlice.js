import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { indexedDBStart } from "../../utils/indexedDB";
import { setDb } from "./indexedDbSlice";

export const getData = createAsyncThunk(
    'todos/getDate',
    async (_, { dispatch }) => {
        const response = await indexedDBStart((db) => dispatch(setDb(db)))
        if (response.categories.length) {
            dispatch(setCategories(response.categories))
        }
        if (response.categoriesOrder.length) {
            dispatch(setCategoriesOrder(response.categoriesOrder[0].order))
            console.log(response.categoriesOrder[0].order)
        } else {
            dispatch(setCategoriesOrder(['0']))
        }
        if (response.categoriesOrder.length) {
            dispatch(setTodos(response.todos))
        }
    }
)

const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        categories: [
            { id: '0', name: 'Без категории', categoryTodos: [] },
        ],
        todos: [],
        categoriesOrder: [],
    },
    reducers: {
        addTodo: (state, action) => {
            state.todos.push({
                ...action.payload,
                completed: false,
                created: (new Date()).toLocaleDateString()
            })
            state.categories.find(category => category.id === action.payload.categoryId).categoryTodos.push(action.payload.id)
        },
        toggleCompleted: (state, action) => {
            const index = state.todos.findIndex(todo => todo.id === action.payload)
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
} = todosSlice.actions;
export default todosSlice.reducer