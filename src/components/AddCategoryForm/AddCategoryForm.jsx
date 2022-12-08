import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'
import { addCategory } from '../../store/slices/todosSlice'
import cl from './AddCategoryForm.module.scss'

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
        if (checkedInput.length > 50) {
            alert('Название не может содеражать больше 50 символов')
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
        <div className={cl.wrapper}>
            {
                isActive
                    ?
                    <form
                        className={cl.form
                        }
                        onSubmit={e => e.preventDefault()}
                    >
                        <div
                            className={cl.backBtn}
                            tabIndex={0}
                            onClick={formActivationHandler}
                        >
                            <span>отмена</span>
                        </div>
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
                    </form >
                    :
                    <button
                        className={cl.toggler}
                        onClick={formActivationHandler}
                    >
                        Добавить категорию
                    </button>
            }
        </div>
    )
}

export default AddCategoryForm