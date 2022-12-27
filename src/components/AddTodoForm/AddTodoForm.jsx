import React, { useState } from 'react'
import { v4 } from 'uuid'
import { useDispatch, useSelector } from 'react-redux'
import { addTodo, setStats } from '../../store/slices/todosSlice'
import {
    addCategory as addCategoryDB,
    addTodo as addTodoDB,
    setCategoriesOrder as setCategoriesOrderDB,
    setTotal as setTotalDB
} from '../../API/indexedDB'
import Select from '../UI/Select/Select'
import Button from '../UI/Button/Button'
import cl from './AddTodoForm.module.scss'
import { toast } from 'react-toastify'

function AddTodoForm() {
    const dispatch = useDispatch()
    const [input, setInput] = useState('')
    const [selected, setSelected] = useState('0')

    const db = useSelector(state => state.indexedDb.db)
    const categories = useSelector(state => state.todos.categories)
    const categoriesOrder = useSelector(state => state.todos.categoriesOrder)
    const stats = useSelector(state => state.todos.stats)

    const addTodoHandler = () => {
        const checkedInput = input.trim();
        if (!checkedInput) {
            toast('Название должно что-то содержать')
            return
        }
        const newTodo = {
            body: checkedInput,
            categoryId: selected || 'none',
            id: v4(),
        }

        dispatch(addTodo(newTodo))
        addTodoDB(db, newTodo)
        const categoryItem = categories.find(category => category.id === newTodo.categoryId)
        addCategoryDB(db, { ...categoryItem, categoryTodos: [...categoryItem.categoryTodos, newTodo.id] })
        setTotalDB(db, stats.total + 1)
        setCategoriesOrderDB(db, categoriesOrder)

        setInput('')
    }

    return (
        <form
            className={cl.form}
            onSubmit={e => e.preventDefault()}
        >
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder='Задание, которое предстоит выполнить...'
            />
            <Select
                set={setSelected}
            />
            <Button
                onClick={addTodoHandler}
            >
                добавить
            </Button>
        </form>
    )
}

export default AddTodoForm