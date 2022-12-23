import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddCategoryForm from '../../AddCategoryForm/AddCategoryForm'
import cl from './Select.module.scss'

function Select({ set }) {
    const categories = useSelector(state => state.todos.categories)
    const [selected, setSelected] = useState(categories.find(category => category.id === '0').name)
    const [isActive, setIsActive] = useState(false)
    const list = (
        <>
            <div
                onClick={() => {
                    setIsActive(!isActive)
                }}
                className={cl.wrapper}
            />
            <ul
                className={cl.list}
                onClick={(e) => {
                    const target = e.target.closest('li')
                    if (!target) return
                    setSelected(target.textContent)
                    set(target.dataset.id)
                    setIsActive(false)
                }}
            >
                {categories.map(category => (
                    <li
                        className={cl.item}
                        data-id={category.id}
                        key={category.id}
                    >
                        {category.name}
                    </li>
                ))}
                <AddCategoryForm
                    onClick={e => e.stopPropagation()}
                />
            </ul>
        </>
    )

    return (
        <div
            className={cl.select}
        >
            <div
                className={cl.title}
                onClick={() => {
                    setIsActive(!isActive)
                }}
            >
                <span>
                    {selected}
                </span>
            </div>
            {
                isActive
                    ? list
                    : null
            }
        </div>
    )
}

export default Select