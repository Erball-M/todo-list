import React from 'react'
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux'
import { removeTodo, toggleCompleted } from '../../store/slices/todosSlice';
import cl from './TodoItem.module.scss'

function TodoItem({ todo, index }) {
    const className = todo.completed ? cl.item + ' ' + cl.completed : cl.item
    const dispatch = useDispatch();

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
                    className={className}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className={cl.left}>
                        <label className={cl.label}>
                            <input
                                className={cl.checkbox}
                                value={todo.completed}
                                onChange={toggleCompletedHandler}
                                type='checkbox'
                            />
                            <div className={cl.done} />
                        </label>
                        <div className={cl.todoBody}>
                            {todo.body}
                        </div>
                    </div>
                    <div className={cl.btns}>
                        <button
                            className={cl.removeBtn}
                            onClick={removeTodoHandler}
                        />
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default TodoItem