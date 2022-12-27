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
            <div className={cl.placeholder}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="25"
                    viewBox="0 0 30 25"
                    fill="none"
                >
                    <path d="M9.61883 17.8013L25.4933 0.792769C25.9865 0.264255 26.6143 0 27.3767 0C28.139 0 28.7668 0.264255 29.2601 0.792769C29.7534 1.32128 30 1.99393 30 2.81073C30 3.62752 29.7534 4.30018 29.2601 4.82869L11.5022 23.8552C10.9641 24.4317 10.3363 24.72 9.61883 24.72C8.90134 24.72 8.27354 24.4317 7.73543 23.8552L0.739909 16.3599C0.246636 15.8314 0 15.1587 0 14.3419C0 13.5251 0.246636 12.8525 0.739909 12.324C1.23318 11.7955 1.86099 11.5312 2.62332 11.5312C3.38565 11.5312 4.01345 11.7955 4.50673 12.324L9.61883 17.8013Z" />
                </svg>
            </div>
        </label>
    )
}

export default CheckBox