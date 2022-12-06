import { createSlice } from "@reduxjs/toolkit";

const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        categories: [
            { id: '0', name: 'Без категории' },
        ],
        todos: [
            {},
        ],
    },
    reducers: {
        addTodo: (state, action) => {
            state.todos.push({ ...action.payload, completed: false })
        },
        toggleCompleted: (state, action) => {
            const index = state.todos.findIndex(todo => todo.id === action.payload)
            state.todos.splice(index, 1, { ...state.todos[index], completed: !state.todos[index].completed })
        },
        removeTodo: (state, action) => {
            state.todos = state.todos.filter(todo => todo.id !== action.payload)
        },
        cleanCompleted: (state, action) => {
            state.todos = state.todos.filter(todo => todo.completed === true)
        },
        addCategory: (state, action) => {

            state.categories.push(action.payload)
        },
        setTodos: (state, action) => {
            state.todos = action.payload
        }
    }
})

export const {
    addTodo,
    toggleCompleted,
    removeTodo,
    cleanCompleted,
    addCategory,
    setTodos,
} = todosSlice.actions;
export default todosSlice.reducer