import React from 'react'
import { useSelector } from 'react-redux'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import TodoItem from '../TodoItem/TodoItem'
import cl from './CategoryItem.module.scss'

function CategoryItem({ category, index }) {
    const todos = useSelector(state => state.todos.todos)
    const filteredTodos = category.categoryTodos.map(item => todos.find(todo => todo.id === item))

    if (!filteredTodos.length) return null
    return (
        <Draggable
            draggableId={category.id}
            index={index}
        >
            {(provided) => (
                <div
                    className={cl.item}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className={cl.title}>
                        <h2>{category.name}</h2>
                    </div>
                    <Droppable droppableId={category.id}>
                        {(provided) => (<div
                            className={cl.list}
                            ref={provided.innerRef}
                            key={category.id}
                            {...provided.droppableProps}
                        >
                            {
                                filteredTodos.map((todo, index) => (
                                    <TodoItem
                                        todo={todo}
                                        index={index}
                                        key={todo.id}
                                    />
                                ))
                            }
                            {provided.placeholder}
                        </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    )
}

export default CategoryItem