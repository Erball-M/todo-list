import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { v4 } from 'uuid'
import { addCategory } from '../../store/slices/todosSlice'
import { addCategory as addCategoryDB, setCategoriesOrder as setCategoriesOrderDB } from '../../API/indexedDB'
import Button from '../UI/Button/Button'
import cl from './AddCategoryForm.module.scss'
import { toast } from 'react-toastify'

function AddCategoryForm(props) {
    const dispatch = useDispatch()
    const categories = useSelector(state => state.todos.categories)
    const categoriesOrder = useSelector(state => state.todos.categoriesOrder)
    const [input, setInput] = useState('')
    const ref = useRef()

    const db = useSelector(state => state.indexedDb.db)

    const addCategoryHandler = () => {
        const name = input.trim()
        if (!name.length) {
            toast('Название категории должно что-то содержать')
            return
        }
        if (categories.find(category => category.name === name)) {
            toast('Категория с таким названием уже существует')
            return
        }
        const newCategory = {
            id: v4(),
            name,
            categoryTodos: [],
        }
        setInput('')
        ref.current.blur()
        dispatch(addCategory(newCategory))
        if (db) {
            addCategoryDB(db, newCategory)
            setCategoriesOrderDB(db, [...categoriesOrder, newCategory.id])
        }
    }
    return (
        <li
            className={cl.item}
            {...props}
        >
            <input
                className={cl.input}
                value={input}
                onChange={e => setInput(e.target.value)}
                ref={ref}
                placeholder='Новая категория...'
            />
            <Button
                onClick={addCategoryHandler}
            >
                +
            </Button>
        </li>
    )
}

export default AddCategoryForm