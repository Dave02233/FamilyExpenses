

import { useParams } from 'react-router-dom';
import { useState } from 'react';
import styles from './Styles/Profile.module.css';

export const Profile = () => {
    const { user } = useParams();
    const [salary, setSalary] = useState(1500);
    const [isEditingSalary, setIsEditingSalary] = useState(false);

    const handleSalaryChange = (e) => {
        setSalary(parseFloat(e.target.value) || 0);
    };

    const handleSalaryEdit = () => {
        setIsEditingSalary(!isEditingSalary);
    };

    const handleAddIncome = () => {
        // TODO: Implementa logica per aggiungere entrata
        console.log('Aggiungi entrata');
    };

    const handleAddExpense = () => {
        // TODO: Implementa logica per aggiungere uscita
        console.log('Aggiungi uscita');
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
                <img 
                    src="/NoUserImg.svg" 
                    alt="Profile Picture" 
                    className={styles.profileImage}
                />
                <h1 className={styles.userName}>{user}</h1>
            </div>

            <div className={styles.salarySection}>
                <h2>Stipendio Mensile</h2>
                <div className={styles.salaryContainer}>
                    {isEditingSalary ? (
                        <input
                            type="number"
                            value={salary}
                            onChange={handleSalaryChange}
                            className={styles.salaryInput}
                            step="0.01"
                        />
                    ) : (
                        <p className={styles.salaryDisplay}>{salary.toFixed(2)} €</p>
                    )}
                    <button 
                        onClick={handleSalaryEdit}
                        className={styles.editButton}
                    >
                        {isEditingSalary ? 'Salva' : 'Modifica'}
                    </button>
                </div>
            </div>

            <div className={styles.actionsSection}>
                <h2>Gestione Transazioni</h2>
                <div className={styles.actionButtons}>
                    <button 
                        onClick={handleAddIncome}
                        className={`${styles.actionButton} ${styles.incomeButton}`}
                    >
                        + Registra Entrata
                    </button>
                    <button 
                        onClick={handleAddExpense}
                        className={`${styles.actionButton} ${styles.expenseButton}`}
                    >
                        - Registra Uscita
                    </button>
                </div>
            </div>

            {/* Sezione per future implementazioni */}
            <div className={styles.transactionsSection}>
                <h2>Ultime Transazioni</h2>
                <p className={styles.placeholder}>Le transazioni verranno visualizzate qui...</p>
            </div>
        </div>
    );
}