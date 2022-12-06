import React from 'react'
import { useSelector } from 'react-redux'
import CategoryItem from '../CategoryItem/CategoryItem'
import cl from './CategoriesList.module.scss'

function CategoriesList() {
    const categories = useSelector(state => state.todos.categories)
    const todos = useSelector(state => state.todos.todos)

    if (todos.length === 1) return <h2 className={cl.title}>Заданий пока нет...</h2>
    return (
        <div className={cl.list}>
            {categories.map(category => (
                <CategoryItem
                    category={category}
                    todos={todos.filter(todo => todo.categoryId === category.id)}
                    key={category.id}
                />
            ))}
        </div>
    )
}

export default CategoriesList