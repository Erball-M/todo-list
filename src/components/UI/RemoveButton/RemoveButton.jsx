import React from 'react'
import cl from './RemoveButton.module.scss'

function RemoveButton(props) {
    return (
        <button
            className={cl.removeBtn}
            {...props}
        />
    )
}

export default RemoveButton