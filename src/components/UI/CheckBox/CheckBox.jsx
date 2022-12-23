import React from 'react'
import cl from './CheckBox.module.scss'

function CheckBox(props) {
    return (
        <label
            className={cl.label}
        >
            <input
                className={cl.checkbox}
                type='checkbox'
                {...props}
            />
            <div className={cl.placeholder} />
        </label>
    )
}

export default CheckBox