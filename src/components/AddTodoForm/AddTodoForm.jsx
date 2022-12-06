import React, { useState } from 'react'
import { v4 } from 'uuid'
import { useDispatch, useSelector } from 'react-redux'
import { addTodo } from '../../store/slices/todosSlice'

function AddTodoForm() {
    const categories = useSelector(state => state.todos.categories)
    const dispatch = useDispatch()
    const [input, setInput] = useState('')
    const [select, setSelect] = useState('0')

    const addTodoHandler = () => {
        const checkedInput = input.trim();
        if (!checkedInput) {
            alert('Название должно что-то содержать')
            return
        }
        const newTodo = {
            body: checkedInput,
            categoryId: select || 'none',
            id: v4(),
        }
        dispatch(addTodo(newTodo))
        setInput('')
    }

    return (
        <form
            onSubmit={e => e.preventDefault()}
        >
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder='Задание, которое предстоит выполнить...'
            /> <select
                value={select}
                onChange={e => setSelect(e.target.value)}
            >
                {categories.map(category => (
                    <option
                        value={category.id}
                        key={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </select>
            <button
                onClick={addTodoHandler}
            >
                добавить
            </button>
        </form>
    )
}

export default AddTodoForm