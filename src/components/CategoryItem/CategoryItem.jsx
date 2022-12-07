import React from 'react'
import { useSelector } from 'react-redux'
import { Droppable } from 'react-beautiful-dnd'
import TodoItem from '../TodoItem/TodoItem'
import cl from './CategoryItem.module.scss'

function CategoryItem({ category }) {
    const todos = useSelector(state => state.todos.todos)
    const filteredTodos = category.categoryTodos.map(item => todos.find(todo => todo.id === item))

    if (!filteredTodos.length) return null
    return (
        <div className={cl.item}>
            <h2>{category.name}</h2>
            <Droppable droppableId={category.id}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        key={category.id}
                        {...provided.droppableProps}
                    >
                        {filteredTodos.map((todo, index) => (
                            <TodoItem
                                todo={todo}
                                index={index}
                                key={todo.id}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}

export default CategoryItem