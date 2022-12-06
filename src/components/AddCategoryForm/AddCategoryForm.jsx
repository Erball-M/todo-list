import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'
import { addCategory } from '../../store/slices/todosSlice'

function AddCategoryForm() {
    const dispatch = useDispatch()
    const categories = useSelector(state => state.todos.categories)
    const [input, setInput] = useState('')
    const [isActive, setIsActive] = useState(false)

    const formActivationHandler = () => {
        setIsActive(!isActive)
    }
    const addCategoryHandler = () => {
        const checkedInput = input.trim();
        if (!checkedInput) {
            alert('Название должно что-то содержать')
            return
        }

        if (categories.find(category => category.name.toLowerCase() === checkedInput.toLowerCase())) {
            alert('Категория с таким названием уже существует')
            return
        }

        const newCategory = {
            id: v4(),
            name: checkedInput,
        }
        dispatch(addCategory(newCategory))
        setInput('')
        setIsActive(false)
    }

    return (
        <>
            <button
                className='addBtn'
                onClick={formActivationHandler}
            >
                Добавить категорию
            </button>
            {isActive
                ? <form
                    onSubmit={e => e.preventDefault()}
                >
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder='Название категории...'
                    />
                    <button
                        onClick={addCategoryHandler}
                    >
                        добавить
                    </button>
                </form>
                : null}
        </>
    )
}

export default AddCategoryForm