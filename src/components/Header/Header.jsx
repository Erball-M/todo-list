import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeTheme } from '../../store/slices/themeSlice'
import { getRandomQuote } from '../../API/quotes'
import sun from '../../images/sun.svg'
import moon from '../../images/moon.svg'
import cl from './Header.module.scss'

function Header() {
    const dispatch = useDispatch()
    const currentTheme = useSelector(state => state.theme.theme)
    const currentIco = currentTheme === 'dark' ? moon : sun
    const quote = getRandomQuote()

    const togglerThemeHadnler = () => {
        dispatch(changeTheme())
    }

    return (
        <header className={cl.header}>
            <div className='container'>
                <div className={cl.quote}>
                    {quote}
                </div>
                <div
                    className={cl.btn}
                    onClick={togglerThemeHadnler}
                >
                    <img src={currentIco} alt='themeIco' />
                </div>
            </div>
        </header>
    )
}

export default Header