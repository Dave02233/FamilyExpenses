import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Styles/SideBar.module.css'
import { API_URL } from '../config';

export const SideBar = ({ open, click }) => {

    const [visibility, setVisibility] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setVisibility(open);
        if (open) {
            fetchUsersData();
        }
    }, [open]);

    const fetchUsersData = async () => {
        const userNames = ['Alessia', 'Chiara', 'Davide'];
        const promises = userNames.map(name => 
            fetch(`${API_URL}/api/user/${name}/profile`)
                .then(res => res.json())
                .catch(err => {
                    console.error(`Errore caricamento ${name}:`, err);
                    return { name, current_savings: 0 };
                })
        );

        const results = await Promise.all(promises);
        setUsersData(results);
    };

    const handleUserClick = (userName) => {
        click();
        setVisibility(false);
        navigate(`/profile/${userName}`);
    }; 

    return (
        <div className={`${styles.SideBarContainer} ${visibility ? styles.open : styles.closed}`}>
            {usersData.length === 0 ? (
                <div className={styles.loading}>Caricamento...</div>
            ) : (
                usersData.map((user, i) => {
                    const savings = parseFloat(user.current_savings) || 0;
                    return (
                        <div key={i} className={styles.userPreview} onClick={()=>handleUserClick(user.name)}>
                            <div className={styles.personalData}>
                                <img src="/NoUserImg.svg" alt="Profile Picture" />
                                <h3>{user.name}</h3>
                            </div>
                            <p className={savings <= 0 ? styles.negative : ''}>
                                {savings.toFixed(2)} €
                            </p>
                        </div>
                    );
                })
            )}
        </div>
    );
}

