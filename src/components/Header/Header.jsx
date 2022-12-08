import React from 'react'
import cl from './Header.module.scss'

function Header() {
    const toggleTheme = () => {
        const isDark = document.body.dataset.theme === 'dark'
        document.body.dataset.theme = isDark ? 'light' : 'dark'
    }

    return (
        <header className={cl.header}>
            <div className='container'>
                <button
                    className={cl.toggler}
                    onClick={toggleTheme}
                >
                    toggle theme
                </button>
            </div>
        </header>
    )
}

export default Header