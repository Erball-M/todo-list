import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import indexedDBService from "../../API/indexedDBService";
import { dataCorrector, fileCorrector } from "../../utils/dataCorrector.js";

export const openDB = createAsyncThunk(
    'todos/openDB',
    async () => {
        try {
            const data = await indexedDBService.open()

            const correctedData = dataCorrector(data)
            return correctedData
        } catch (err) {
            console.log(err.message)
        }
    }
)
export const importData = createAsyncThunk(
    'todos/importData',
    async (info) => {
        try {
            const { file, type = 'change' } = info

            const correctedFile = await fileCorrector(file)
            return ({ data: correctedFile, type })
        } catch (err) {
            console.log(err.message)
        }
    }
)

const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        categories: [{ id: '0', name: 'Без категории', categoryTodos: [] },],
        todos: [],
        categoriesOrder: [{ order: ['0'] }],
        stats: [{ done: 0, total: 0 }],
    },
    reducers: {
        setTodo: (state, action) => {
            const todo = action.payload
            const newTodo = {
                completed: false,
                created: (new Date()).toLocaleDateString(),
                ...todo,
            }

            const todoIndex = state.todos.findIndex(todo => todo.id === newTodo.id)
            if (todoIndex > -1) {
                state.todos.splice(todoIndex, 1, newTodo)
                if (newTodo.completed) {
                    const newDoneCount = state.stats[0].done + 1
                    state.stats[0].done = newDoneCount
                    indexedDBService.set('stats', { id: 'stats', total: state.stats[0].total, done: newDoneCount })
                } else {
                    const newDoneCount = state.stats.done - 1;
                    if (newDoneCount < 0) return;
                    state.stats[0].done = newDoneCount;
                    indexedDBService.set('stats', { id: 'stats', total: state.stats[0].total, done: newDoneCount })
                }
            } else {
                state.todos.push(newTodo)
                const todosCategory = state.categories.find(category => category.id === newTodo.categoryId)
                todosCategory.categoryTodos.push(newTodo.id)
                const newTotalCount = state.stats[0].total + 1
                state.stats[0].total = newTotalCount

                indexedDBService.set('stats', { id: 'stats', done: state.stats[0].done, total: newTotalCount })
                indexedDBService.set('categories', { ...todosCategory, categoryTodos: [...todosCategory.categoryTodos] })
            }

            indexedDBService.set('todos', newTodo)
        },
        removeTodo: (state, action) => {
            const id = action.payload
            const todosCategory = state.categories
                .find(category => category.categoryTodos.includes(id))
            todosCategory.categoryTodos = todosCategory.categoryTodos
                .filter(todoId => todoId !== id)

            state.todos = state.todos.filter(todo => todo.id !== id)

            indexedDBService.set('categories', { ...todosCategory })
            indexedDBService.remove('todos', id)
        },

        addCategory: (state, action) => {
            const newCategory = {
                categoryTodos: [],
                ...action.payload,
            }

            state.categories.push(newCategory)

            const order = state.categoriesOrder[0].order
            order.push(newCategory.id)

            indexedDBService.set('categoriesOrder', { id: 'order', order: [...order] })
            indexedDBService.set('categories', newCategory)
        },
        setTodosOrder: (state, action) => {
            const info = action.payload

            const category = state.categories
                .find(category => category.id === info.id)

            const set = Array.from(new Set(info.order))
            if (set.length !== info.order.length) {
                toast('Слишком быстро!')
                return
            }

            category.categoryTodos = info.order

            indexedDBService.set('categories', { ...category, categoryTodos: [...info.order] })
        },
        setCategoriesOrder: (state, action) => {
            const newOrder = action.payload

            state.categoriesOrder[0].order = [...newOrder]

            indexedDBService.set('categoriesOrder', { id: 'order', order: [...newOrder] })
        },
    },
    extraReducers: {
        [openDB.fulfilled]: (state, action) => {
            const data = action.payload

            Object.keys(data).forEach(key => {
                state[key] = [...data[key]]
            })
        },
        [importData.fulfilled]: (state, action) => {
            const { data, type } = action.payload

            if (type === 'change') {
                Object.keys(data).forEach(key => {
                    state[key] = [...data[key]]
                })

                indexedDBService.updateData(data, type)
            } else if (type === 'add') {
                function getIds(data) {
                    const res = data.reduce((acc, item) => {
                        acc.push(item.id)
                        return acc
                    }, [])
                    return res
                }
                const categoriesIds = getIds(state.categories)

                //Добавление новых категорий и их заданий
                const newCategories = data.categories.filter(item => !categoriesIds.includes(item.id))
                let newTodos = []
                newCategories.forEach(category => {
                    newTodos.push(...category.categoryTodos)
                    indexedDBService.set('categories', category)
                })
                newTodos.forEach(item => {
                    indexedDBService.set
                })
                state.todos.push(...newTodos.map(item => data.todos.find(todo => todo.id === item)))
                state.categories.push(...newCategories)
            }
            return
        },
    }
})

export const {
    setTodo,
    removeTodo,
    addCategory,
    setTodosOrder,
    setCategoriesOrder,
} = todosSlice.actions;
export default todosSlice.reducer