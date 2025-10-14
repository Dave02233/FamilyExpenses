import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Styles/SideBar.module.css'

export const SideBar = ({ open }) => {

    useEffect(() => {
        setVisibility(open);
    }, [open])

    const [visibility, setVisibility] = useState(false);
    const navigate = useNavigate();

    const handleUserClick = (userName) => {
        setVisibility(false);
        navigate(`/profile/${userName}`);
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
                        <div key={i} className={styles.userPreview} onClick={()=>handleUserClick(user.name)}>
                            <div className={styles.personalData}>
                                <img src={user.img} alt="Profile Picture" />
                                <h3>{user.name}</h3>
                            </div>
                            <p className={user.monthlyExpendables <= 0 ? styles.negative : ''}>
                                {user.monthlyExpendables.toFixed(2)} €
                            </p>
                        </div>
                    )
                })
            }

      
        </div>
    )
}

