import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { removeTodo, toggleCompleted } from '../../store/slices/todosSlice';
import CheckBox from '../UI/CheckBox/CheckBox';
import RemoveButton from '../UI/RemoveButton/RemoveButton';
import cl from './TodoItem.module.scss'

function TodoItem({ todo, index }) {
    const dispatch = useDispatch()
    const isCompletedClassName = todo.completed ? cl.done + ' ' + cl.todo : cl.todo
    const [isCutted, setIsCutted] = useState(true)
    const cuttedText = todo.body.length > 100 ? todo.body.slice(0, 100) + '...' : todo.body
    const text = isCutted ? cuttedText : todo.body

    const toggleCompletedHandler = () => {
        dispatch(toggleCompleted(todo.id))
    }
    const removeTodoHandler = () => {
        dispatch(removeTodo(todo.id))
    }

    return (
        <Draggable
            draggableId={todo.id}
            index={index}
        >
            {(provided) => (
                <div
                    className={isCompletedClassName}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className={cl.left}>
                        <CheckBox
                            value={todo.completed}
                            onChange={toggleCompletedHandler}
                        />
                        <div className={cl.body}>
                            <div className={cl.text}>
                                {text}
                            </div>
                            <div className={cl.infoBlock}>
                                <div>{todo.created}</div>
                                {
                                    todo.body.length > 100
                                        ? <button
                                            className={cl.readMoreBtn}
                                            onClick={() => setIsCutted(!isCutted)}
                                        >
                                            {
                                                isCutted
                                                    ? 'Читать больше...'
                                                    : 'Читать меньше...'
                                            }
                                        </button>
                                        : null
                                }
                            </div>
                        </div>
                    </div>
                    <div className={cl.btns}>
                        <RemoveButton
                            onClick={removeTodoHandler}
                        />
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default TodoItem