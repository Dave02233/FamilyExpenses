import { useEffect, useState } from 'react';
import styles from './Styles/SideBar.module.css'

export const SideBar = ({ open }) => {

    useEffect(() => {
        setVisibility(open);
    }, [open])

    const [visibility, setVisibility] = useState(false);

    const checkExpenses = (num) => {
        if(num <= 0){
            return '.red';
        } else {
            return '.green';
        }
    }

    const users = [
        {
            name: 'Alessia',
            img: 'NoUserImg.svg',
            monthlyExpendables: 1200
        },
        {
            name: 'Chiara',
            img: 'NoUserImg.svg',
            monthlyExpendables: -200
        },
        {
            name: 'Davide',
            img: 'NoUserImg.svg',
            monthlyExpendables: 600
        }
    ]

    return (
        <div className={`${styles.SideBarContainer} ${visibility ? styles.open : styles.closed}`}>
            {
                users
                .map((user, i) => {
                    return (
                        <div key={i}>
                            <div className={styles.userPreview}>
                                <div className={styles.personalData}>
                                    <img src={user.img} alt="Profile Picture" />
                                    <h3>{user.name}</h3>
                                </div>
                                <p>{user.monthlyExpendables.toFixed(2)} €</p>
                            </div>
                            <hr />
                        </div>
                    )
                })
            }

      
        </div>
    )
}

