import { createSlice } from "@reduxjs/toolkit";

const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        categories: [
            { id: '0', name: 'Без категории', categoryTodos: ['12'] },
            { id: '1', name: 'С категорией', categoryTodos: ['22'] },
        ],
        todos: [
            { id: '12', body: 'first', completed: false },
            { id: '22', body: 'second', completed: false },
        ],
        categoriesOrder: ['0', '1']
    },
    reducers: {
        addTodo: (state, action) => {
            state.todos.push({ ...action.payload, completed: false })
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
        // cleanCompleted: (state) => {
        //     state.todos = state.todos.filter(todo => todo.completed === true)
        // },
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
} = todosSlice.actions;
export default todosSlice.reducer