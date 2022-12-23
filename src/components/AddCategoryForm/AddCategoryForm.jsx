import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { v4 } from 'uuid'
import { addCategory } from '../../store/slices/todosSlice'
import cl from './AddCategoryForm.module.scss'

function AddCategoryForm(props) {
    const dispatch = useDispatch()
    const categories = useSelector(state => state.todos.categories)
    const [input, setInput] = useState('')
    const ref = useRef()

    const addCategoryHandler = () => {
        const name = input.trim()
        if (!name.length) {
            alert('Название категории должно что-то содержать')
            return
        }
        if (categories.find(category => category.name === name)) {
            alert('Категория с таким названием уже существует')
            return
        }
        const newCategory = {
            id: v4(),
            name,
        }
        setInput('')
        ref.current.blur()
        dispatch(addCategory(newCategory))
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
            <button
                className={cl.btn}
                onClick={addCategoryHandler}
            >
                +
            </button>
        </li>
    )
}

export default AddCategoryForm