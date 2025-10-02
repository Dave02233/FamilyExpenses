import { useEffect, useState } from 'react';
import styles from './Styles/SideBar.module.css'

export const SideBar = ({ open }) => {

    useEffect(() => {
        setVisibility(open);
    }, [open])

    const [visibility, setVisibility] = useState(false);

    const users = [
        {
            name: 'Alessia',
            img: 'NoUserImg.svg',
            monthlyExpenses: 1200
        },
        {
            name: 'Chiara',
            img: 'NoUserImg.svg',
            monthlyExpenses: 900
        },
        {
            name: 'Davide',
            img: 'NoUserImg.svg',
            monthlyExpenses: 600
        }
    ]

    return (
        <div className={`${styles.SideBarContainer} ${visibility ? styles.open : styles.closed}`}>
            {
                users
                .map(user => {
                    return (
                        <>
                            <div className={styles.userPreview}>
                                <div className={styles.personalData}>
                                    <img src={user.img} alt="Profile Picture" />
                                    <h3>{user.name}</h3>
                                </div>
                                <p>{user.monthlyExpenses.toFixed(2)} €</p>
                            </div>
                            <hr />
                        </>
                    )
                })
            }

      
        </div>
    )
}

