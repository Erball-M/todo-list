import React from 'react'
import TodoItem from '../TodoItem/TodoItem'
import cl from './CategoryItem.module.scss'

function CategoryItem({ category, todos }) {
    if (!todos.length) return null
    return (
        <div className={cl.item}>
            <h2>{category.name}</h2>

            {todos.map(todo => (
                <TodoItem
                    todo={todo}
                    key={todo.id}
                />
            ))}
        </div>
    )
}

export default CategoryItem