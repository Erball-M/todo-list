import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddCategoryForm from '../../AddCategoryForm/AddCategoryForm'
import List from '../../List/List'
import cl from './Select.module.scss'

function Select({ set }) {
    const categories = useSelector(state => state.todos.categories)
    const [selected, setSelected] = useState(categories.find(category => category.id === '0').name)
    const [isActive, setIsActive] = useState(false)

    const activeHandler = () => {
        setIsActive(!isActive)
    }
    const selectHandler = (e) => {
        const target = e.target.closest('li')
        if (!target) return
        setSelected(target.textContent)
        set(target.dataset.id)
        setIsActive(false)
    }

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
                    ?
                    <>
                        <div
                            onClick={activeHandler}
                            className={cl.wrapper}
                        />
                        <List
                            selectHandler={selectHandler}
                            activeHandler={activeHandler}
                            items={categories}
                            extraItems={
                                <AddCategoryForm
                                    onClick={e => e.stopPropagation()}
                                />}
                        />
                    </>
                    : null
            }
        </div>
    )
}

export default Select