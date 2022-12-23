import { createSlice } from "@reduxjs/toolkit";

const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        categories: [
            { id: '0', name: 'Без категории', categoryTodos: [] },
        ],
        todos: [],
        categoriesOrder: ['0'],
    },
    reducers: {
        addTodo: (state, action) => {
            state.todos.push({
                ...action.payload,
                completed: false,
                created: (new Date()).toLocaleDateString()
            })
            state.categories.find(category => category.id === action.payload.categoryId).categoryTodos.push(action.payload.id)
            window.localStorage.setItem('todosStore', JSON.stringify(state))
        },
        toggleCompleted: (state, action) => {
            const index = state.todos.findIndex(todo => todo.id === action.payload)
            state.todos.splice(index, 1, { ...state.todos[index], completed: !state.todos[index].completed })
            window.localStorage.setItem('todosStore', JSON.stringify(state))
        },
        removeTodo: (state, action) => {
            const zxx = state.categories.find(category => category.categoryTodos.includes(action.payload))
            zxx.categoryTodos = zxx.categoryTodos.filter(todoId => todoId !== action.payload)
            state.todos = state.todos.filter(todo => todo.id !== action.payload)
            window.localStorage.setItem('todosStore', JSON.stringify(state))
        },
        // cleanCompleted: (state) => {
        //     state.todos = state.todos.filter(todo => todo.completed === true)
        // },
        addCategory: (state, action) => {
            state.categories.push({ ...action.payload, categoryTodos: [] })
            state.categoriesOrder.push(action.payload.id)
            window.localStorage.setItem('todosStore', JSON.stringify(state))
        },
        setOrder: (state, action) => {
            state.categories.find(category => category.id === action.payload.id).categoryTodos = action.payload.order
            window.localStorage.setItem('todosStore', JSON.stringify(state))
        },
        setCategoriesOrder: (state, action) => {
            state.categoriesOrder = action.payload
            window.localStorage.setItem('todosStore', JSON.stringify(state))
        },
        getSaved: (state) => {
            const saved = JSON.parse(window.localStorage.getItem('todosStore'))
            if (!saved) return
            state.categories = saved.categories
            state.categoriesOrder = saved.categoriesOrder
            state.todos = saved.todos
        },
    }
})

export const {
    addTodo,
    toggleCompleted,
    removeTodo,
    // cleanCompleted,
    addCategory,
    setOrder,
    setCategoriesOrder,
    getSaved,
} = todosSlice.actions;
export default todosSlice.reducer