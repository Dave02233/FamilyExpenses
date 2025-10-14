

import { useParams, NavLink } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import styles from './Styles/Profile.module.css';
import { API_URL } from '../config';

// Hook personalizzato per font size responsive dei grafici
const useChartFontSize = () => {
    const [fontSize, setFontSize] = useState({
        axis: window.innerWidth >= 992 ? '0.875rem' : '0.75rem'
    });

    useEffect(() => {
        const handleResize = () => {
            const isLargeScreen = window.innerWidth >= 992;
            setFontSize({
                axis: isLargeScreen ? '0.875rem' : '0.75rem'
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return fontSize;
};

export const Profile = () => {
    const { user } = useParams();
    const chartFontSize = useChartFontSize();

    const [showPopup, setShowPopup] = useState(false);
    const [transactionType, setTransactionType] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [newGoal, setNewGoal] = useState('');
    const [filterType, setFilterType] = useState('1mese');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [monthlyIncomeExpenseData, setMonthlyIncomeExpenseData] = useState([]);

    const fetchProfileData = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/api/user/${user}/profile`);
            const data = await response.json();
            setProfileData(data);
        } catch (error) {
            console.error('Errore nel caricamento del profilo:', error);
        }
    }, [user]);

    const fetchRecentTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/api/user/${user}/recent-transactions?limit=10`);
            const data = await response.json();
            setRecentTransactions(data);
        } catch (error) {
            console.error('Errore nel caricamento delle transazioni:', error);
        }
    }, [user]);

    const fetchMonthlyIncomeExpense = useCallback(async () => {
        try {
            let url = `${API_URL}/api/user/${user}/monthly-income-expense`;
            const params = new URLSearchParams();
            
            if (filterType === 'custom' && startDate && endDate) {
                const start = new Date(startDate + '-01');
                const end = new Date(endDate + '-01');
                end.setMonth(end.getMonth() + 1);
                end.setDate(0);
                
                params.append('startDate', start.toISOString());
                params.append('endDate', end.toISOString());
            } else if (filterType === '1mese') {
                params.append('months', '1');
            } else if (filterType === '3mesi') {
                params.append('months', '3');
            } else if (filterType === '1anno') {
                params.append('months', '12');
            }
            
            if (params.toString()) {
                url += '?' + params.toString();
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            // Trasforma i dati in formato per recharts
            const transformedData = data.reduce((acc, item) => {
                const existing = acc.find(d => d.name === item.name);
                if (existing) {
                    if (item.type === 'income') {
                        existing.Entrate = parseFloat(item.total);
                    } else {
                        existing.Uscite = parseFloat(item.total);
                    }
                } else {
                    acc.push({
                        name: item.name,
                        Entrate: item.type === 'income' ? parseFloat(item.total) : 0,
                        Uscite: item.type === 'expense' ? parseFloat(item.total) : 0
                    });
                }
                return acc;
            }, []);
            
            setMonthlyIncomeExpenseData(transformedData);
        } catch (error) {
            console.error('Errore nel caricamento dei dati mensili:', error);
        }
    }, [user, filterType, startDate, endDate]);

    useEffect(() => {
        fetchProfileData();
        fetchRecentTransactions();
        fetchMonthlyIncomeExpense();
    }, [fetchProfileData, fetchRecentTransactions, fetchMonthlyIncomeExpense]);

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        if (e.target.value !== 'custom') {
            setStartDate('');
            setEndDate('');
        }
    };

    const handleAddIncome = () => {
        setTransactionType('income');
        setShowPopup(true);
    };

    const handleAddExpense = () => {
        setTransactionType('expense');
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setAmount('');
        setCategory('');
        setDescription('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const endpoint = transactionType === 'income' ? '/api/incomes' : '/api/expenses';
        const body = {
            user_name: user,
            amount: parseFloat(amount),
            category,
            description
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Errore durante il salvataggio');
            }

            const data = await response.json();
            console.log('Transazione salvata:', data);
            //alert('Transazione salvata con successo!');
            handleClosePopup();
            fetchProfileData();
            fetchRecentTransactions();
        } catch (error) {
            console.error('Errore:', error);
            alert('Errore durante il salvataggio della transazione');
        }
    };

    const handleEditGoal = () => {
        const currentGoal = profileData?.savings_goal || 0;
        setNewGoal(currentGoal.toString());
        setIsEditingGoal(true);
    };

    const handleSaveGoal = async () => {
        if (!newGoal || parseFloat(newGoal) < 0) {
            alert('Inserisci un valore valido');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/user/${user}/savings-goal`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ savings_goal: parseFloat(newGoal) }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Errore durante l\'aggiornamento');
            }

            await fetchProfileData();
            setIsEditingGoal(false);
            //alert('Obiettivo aggiornato con successo!');
        } catch (error) {
            console.error('Errore:', error);
            alert(`Errore durante l'aggiornamento dell'obiettivo: ${error.message}`);
        }
    };

    const handleCancelEditGoal = () => {
        setIsEditingGoal(false);
        setNewGoal('');
    };

    const handleDeleteTransaction = async (transactionId, transactionType) => {
        if (!window.confirm('Sei sicuro di voler eliminare questa transazione?')) {
            return;
        }

        try {
            const endpoint = transactionType === 'income' ? '/api/incomes' : '/api/expenses';
            const response = await fetch(`${API_URL}${endpoint}/${transactionId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Errore durante l\'eliminazione');
            }

            //alert('Transazione eliminata con successo!');
            fetchProfileData();
            fetchRecentTransactions();
            fetchMonthlyIncomeExpense();
        } catch (error) {
            console.error('Errore:', error);
            alert('Errore durante l\'eliminazione della transazione');
        }
    };

    const savingsGoal = parseFloat(profileData?.savings_goal) || 0;
    const currentSavings = parseFloat(profileData?.current_savings) || 0;
    const savingsPercentage = savingsGoal > 0 ? (currentSavings / savingsGoal) * 100 : 0;

    return (
        <div className={styles.profileContainer}>
            <NavLink to={'/'} className={styles.backButton}>
                ← Torna alla Dashboard
            </NavLink>
            <div className={styles.profileHeader}>
                <img 
                    src="/NoUserImg.svg" 
                    alt="Profile Picture" 
                    className={styles.profileImage}
                />
                <h1 className={styles.userName}>{user}</h1>
            </div>

            <div className={styles.savingsSection}>
                <h2>Obiettivo di Risparmio</h2>
                <div className={styles.savingsContent}>
                    <div className={styles.savingsAmount}>
                        <span className={styles.savingsLabel}>Obiettivo mensile:</span>
                        {isEditingGoal ? (
                            <div className={styles.editGoalContainer}>
                                <input
                                    type="number"
                                    value={newGoal}
                                    onChange={(e) => setNewGoal(e.target.value)}
                                    className={styles.goalInput}
                                    placeholder="Inserisci obiettivo"
                                    step="0.01"
                                />
                                <button onClick={handleSaveGoal} className={styles.saveGoalButton}>✓</button>
                                <button onClick={handleCancelEditGoal} className={styles.cancelGoalButton}>✕</button>
                            </div>
                        ) : (
                            <div className={styles.goalDisplay}>
                                <span className={styles.savingsValue}>{savingsGoal.toFixed(2)} €</span>
                                <button onClick={handleEditGoal} className={styles.editGoalButton}>✏️</button>
                            </div>
                        )}
                    </div>
                    <div className={styles.savingsProgress}>
                        <div className={styles.progressBar}>
                            <div 
                                className={`${styles.progressFill} ${currentSavings < 0 ? styles.negativeFill : ''}`} 
                                style={{width: `${savingsPercentage}%`}}
                            ></div>
                        </div>
                        <span className={`${styles.progressText} ${currentSavings < 0 ? styles.negativeText : ''}`}>
                            {currentSavings.toFixed(2)} € / {savingsGoal.toFixed(2)} € ({savingsPercentage.toFixed(0)}%)
                            {currentSavings < 0 && ' - In deficit'}
                        </span>
                    </div>
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

            {/* Sezione Grafico Entrate vs Uscite */}
            <div className={styles.chartSection}>
                <div className={styles.FilterContainer}>
                    <div className={styles.FilterGroup}>
                        <label htmlFor="filterType">Periodo:</label>
                        <select 
                            id="filterType"
                            value={filterType} 
                            onChange={handleFilterChange}
                            className={styles.FilterSelect}
                        >
                            <option value="1mese">1 Mese</option>
                            <option value="3mesi">3 Mesi</option>
                            <option value="1anno">1 Anno</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>

                    {filterType === 'custom' && (
                        <div className={styles.CustomDateContainer}>
                            <div className={styles.DateGroup}>
                                <label htmlFor="startDate">Da:</label>
                                <input 
                                    type="month"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className={styles.DateInput}
                                />
                            </div>
                            <div className={styles.DateGroup}>
                                <label htmlFor="endDate">A:</label>
                                <input 
                                    type="month"
                                    id="endDate"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className={styles.DateInput}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.BarChartContainer}>
                    <div className={styles.ChartHeader}>
                        <h2>Entrate vs Uscite Mensili</h2>
                        <span className={styles.ChartSubtitle}>Andamento finanziario personale</span>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart 
                            data={monthlyIncomeExpenseData} 
                            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                            barCategoryGap="15%"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#ffffff', fontSize: chartFontSize.axis }}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#ffffff', fontSize: chartFontSize.axis }}
                                tickFormatter={(value) => `${value}€`}
                            />
                            <Tooltip 
                                formatter={(value) => `${value}€`}
                                contentStyle={{
                                    backgroundColor: 'rgba(30, 30, 30, 0.95)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '8px',
                                    color: '#ffffff',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                                }}
                                labelStyle={{ color: '#ffffff' }}
                                itemStyle={{ color: '#ffffff' }}
                                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                            />
                            <Bar dataKey="Entrate" fill="#82ca9d" />
                            <Bar dataKey="Uscite" fill="#ff8042" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Sezione transazioni recenti */}
            <div className={styles.transactionsSection}>
                <h2>Ultime Transazioni</h2>
                {recentTransactions.length === 0 ? (
                    <p className={styles.placeholder}>Nessuna transazione trovata</p>
                ) : (
                    <div className={styles.transactionsList}>
                        {recentTransactions.map((transaction) => (
                            <div 
                                key={`${transaction.type}-${transaction.id}`} 
                                className={`${styles.transactionItem} ${transaction.type === 'income' ? styles.incomeItem : styles.expenseItem}`}
                            >
                                <div className={styles.transactionInfo}>
                                    <span className={styles.transactionCategory}>{transaction.category}</span>
                                    <span className={styles.transactionDescription}>{transaction.description || 'Nessuna descrizione'}</span>
                                    <span className={styles.transactionDate}>
                                        {new Date(transaction.created_at).toLocaleDateString('it-IT')}
                                    </span>
                                </div>
                                <div className={styles.transactionAmount}>
                                    <span className={transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount}>
                                        {transaction.type === 'income' ? '+' : '-'}{parseFloat(transaction.amount).toFixed(2)} €
                                    </span>
                                    <button 
                                        onClick={() => handleDeleteTransaction(transaction.id, transaction.type)}
                                        className={styles.deleteButton}
                                        title="Elimina transazione"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* popup per aggiungere transazione */}
            {showPopup && (
                <div className={styles.popupOverlay} onClick={handleClosePopup}>
                    <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.popupHeader}>
                            <h2>
                                {transactionType === 'income' ? 'Nuova Entrata' : 'Nuova Uscita'}
                            </h2>
                            <button 
                                className={styles.closeButton}
                                onClick={handleClosePopup}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.popupForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="amount">Importo *</label>
                                <input
                                    type="number"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    step="100"
                                    required
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="category">Categoria *</label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    className={styles.select}
                                >
                                    <option value="">Seleziona categoria</option>
                                    {transactionType === 'income' ? (
                                        <>
                                            <option value="stipendio">Stipendio</option>
                                            <option value="bonus">Bonus</option>
                                            <option value="investimenti">Investimenti</option>
                                            <option value="regalo">Regalo</option>
                                            <option value="furto">Furto</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="spesa">Spesa</option>
                                            <option value="sigarette">Sigarette</option>
                                            <option value="divertimento">Divertimento</option>
                                            <option value="vestiti">Vestiti</option>
                                            <option value="bollette">Bollette</option>
                                            <option value="trasporti">Trasporti</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="description">Descrizione (opzionale)</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Aggiungi una nota..."
                                    rows="3"
                                    maxLength={30}
                                    className={styles.textarea}
                                />
                            </div>

                            <div className={styles.popupActions}>
                                <button
                                    type="button"
                                    onClick={handleClosePopup}
                                    className={styles.cancelButton}
                                >
                                    Annulla
                                </button>
                                <button
                                    type="submit"
                                    className={`${styles.submitButton} ${
                                        transactionType === 'income' ? styles.submitIncome : styles.submitExpense
                                    }`}
                                >
                                    Salva
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}