import React from "react";
import styles from './Styles/Toggle.module.css'

export const Toggle = React.memo(
    function Toggle({state, toggleFunction}) {

        const handleClick = () => {
            toggleFunction(prev => !prev)
        }

        return (
    <div onClick={handleClick} className={`${styles.ToggleContainer} ${state ? styles.active : styles.inactive}`}>
            <div className={styles.StatusLayer}>
                <p>I</p>
                <p>O</p>
            </div>
            <div className={styles.MovingLayer}/>
        </div>
    )
});

