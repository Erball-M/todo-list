import React from 'react'
import cl from './List.module.scss'

function List({ selectHandler, activeHandler, items, extraItems }) {
    return (
        <ul
            className={cl.list}
            onClick={selectHandler}
        >
            {items.map(item => (
                <li
                    className={cl.item}
                    data-id={item.id}
                    key={item.id}
                >
                    {item.name}
                </li>
            ))}
            {extraItems}
        </ul>
    )
}

export default List