import React, { useState } from 'react'
import { v4 } from 'uuid'
import { useDispatch } from 'react-redux'
import { addTodo } from '../../store/slices/todosSlice'
import Select from '../UI/Select/Select'
import cl from './AddTodoForm.module.scss'

function AddTodoForm() {
    const dispatch = useDispatch()
    const [input, setInput] = useState('')
    const [selected, setSelected] = useState('0')

    const addTodoHandler = () => {
        const checkedInput = input.trim();
        if (!checkedInput) {
            alert('Название должно что-то содержать')
            return
        }
        const newTodo = {
            body: checkedInput,
            categoryId: selected || 'none',
            id: v4(),
        }
        dispatch(addTodo(newTodo))
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
            <button
                onClick={addTodoHandler}
            >
                добавить
            </button>
        </form>
    )
}

export default AddTodoForm