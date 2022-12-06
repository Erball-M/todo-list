import React from 'react'
import { useDispatch } from 'react-redux'
import { removeTodo, toggleCompleted } from '../../store/slices/todosSlice';
import cl from './TodoItem.module.scss'

function TodoItem({ todo }) {
    const className = todo.completed ? cl.item + ' ' + cl.completed : cl.item
    const dispatch = useDispatch();

    const toggleCompletedHandler = () => {
        dispatch(toggleCompleted(todo.id))
    }
    const removeTodoHandler = () => {
        dispatch(removeTodo(todo.id))
    }

    return (
        <div className={className}>
            <div className={cl.left}>
                <input
                    value={todo.completed}
                    onChange={toggleCompletedHandler}
                    type='checkbox'
                />
                {todo.body}
            </div>
            <div className={cl.btns}>
                <button
                    onClick={removeTodoHandler}
                >
                    X
                </button>
            </div>
        </div>
    )
}

export default TodoItem