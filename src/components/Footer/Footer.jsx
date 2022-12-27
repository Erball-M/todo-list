import React from 'react'
import { useSelector } from 'react-redux'
import cl from './Footer.module.scss'

function Footer() {
    const { done, total } = useSelector(state => state.todos.stats)
    return (
        <div className={cl.footer}>
            <div className='container'>
                <p className={cl.statItem}>
                    Выполнено: {done}
                </p>
                <p className={cl.statItem}>
                    Добавлено заданий за все время: {total}
                </p>
            </div>
        </div>
    )
}

export default Footer