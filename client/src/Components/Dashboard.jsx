import { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './Styles/Dashboard.module.css';
import { API_URL } from '../config';

const categoryColors = [
    '#8884d8', // Viola
    '#82ca9d', // Verde chiaro
    '#ffc658', // Giallo
    '#ff8042', // Arancione
    '#a4de6c', // Verde lime
    '#d084d0', // Rosa
    '#ff6b6b', // Rosso chiaro
    '#4ecdc4', // Turchese
    '#45b7d1', // Azzurro
    '#96ceb4', // Verde acqua
    '#fbac91', // Pesca
    '#d4a5a5', // Rosa antico
    '#9b6b9b', // Viola scuro
    '#c3a6ff', // Lavanda
    '#ffd93d', // Giallo oro
    '#ff9a8b', // Corallo
    '#98ddca', // Menta
    '#d4afb9', // Rosa polvere
    '#7ec4cf', // Azzurro chiaro
    '#9eb23b'  // Verde oliva
];

const formatCurrency = (value) => `${value.toFixed(0)}€`;

const useChartFontSize = () => {
    const [fontSize, setFontSize] = useState(() => {
        const isLargeScreen = window.innerWidth >= 992;
        return {
            axis: isLargeScreen ? '1rem' : '0.75rem',
            label: isLargeScreen ? '1rem' : '0.75rem',
            smallLabel: isLargeScreen ? '0.8rem' : '0.7rem'
        };
    });

    useEffect(() => {
        const handleResize = () => {
            const isLargeScreen = window.innerWidth >= 992;
            const newFontSize = {
                axis: isLargeScreen ? '1rem' : '0.75rem',
                label: isLargeScreen ? '1rem' : '0.75rem',
                smallLabel: isLargeScreen ? '0.8rem' : '0.7rem'
            };
            
            setFontSize(prev => {
                if (prev.smallLabel !== newFontSize.smallLabel) {
                    return newFontSize;
                }
                return prev;
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return fontSize;
};

export const Dashboard = () => {
    const chartFontSize = useChartFontSize();
    const [users, setUsers] = useState([]);
    const [filterType, setFilterType] = useState('3mesi');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [userCategoryData, setUserCategoryData] = useState({});
    const [isScrolling, setIsScrolling] = useState(false);
    const [expandedUserLegend, setExpandedUserLegend] = useState({});

    const fetchMonthlyData = useCallback(async () => {
        try {
            let url = `${API_URL}/api/expenses/monthly`;
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
            
            const transformedData = data.reduce((acc, item) => {
                const existing = acc.find(d => d.name === item.name);
                if (existing) {
                    existing[item.user_name] = parseFloat(item.total);
                } else {
                    acc.push({
                        name: item.name,
                        [item.user_name]: parseFloat(item.total)
                    });
                }
                return acc;
            }, []);
            
            setMonthlyData(transformedData);
        } catch (error) {
            console.error('Errore nel caricamento dei dati mensili:', error);
        }
    }, [filterType, startDate, endDate]);

    const fetchCategoryData = useCallback(async () => {
        try {
            let url = `${API_URL}/api/expenses/by-category`;
            const params = new URLSearchParams();
            
            if (filterType === 'custom' && startDate && endDate) {
                const start = new Date(startDate + '-01');
                const end = new Date(endDate + '-01');
                end.setMonth(end.getMonth() + 1);
                end.setDate(0);
                
                params.append('startDate', start.toISOString());
                params.append('endDate', end.toISOString());
            } else if (filterType !== 'custom') {
                const months = filterType === '1mese' ? 1 : filterType === '3mesi' ? 3 : 12;
                const startFilter = new Date();
                startFilter.setDate(1);
                startFilter.setMonth(startFilter.getMonth() - (months - 1));
                startFilter.setHours(0, 0, 0, 0);
                params.append('startDate', startFilter.toISOString());
            }
            
            if (params.toString()) {
                url += '?' + params.toString();
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            const transformedData = data.map((item, index) => ({
                name: item.category,
                value: parseFloat(item.total),
                fill: categoryColors[index % categoryColors.length]
            }));
            
            setCategoryData(transformedData);
        } catch (error) {
            console.error('Errore nel caricamento dei dati per categoria:', error);
        }
    }, [filterType, startDate, endDate]);

    const fetchUserCategoryData = useCallback(async () => {
        if (users.length === 0) return;
        
        try {
            const userData = {};
            for (const user of users) {
                let url = `${API_URL}/api/expenses/by-category/${user}`;
                const params = new URLSearchParams();
                
                if (filterType === 'custom' && startDate && endDate) {
                    const start = new Date(startDate + '-01');
                    const end = new Date(endDate + '-01');
                    end.setMonth(end.getMonth() + 1);
                    end.setDate(0);
                    
                    params.append('startDate', start.toISOString());
                    params.append('endDate', end.toISOString());
                } else if (filterType !== 'custom') {
                    const months = filterType === '1mese' ? 1 : filterType === '3mesi' ? 3 : 12;
                    const startFilter = new Date();
                    startFilter.setDate(1);
                    startFilter.setMonth(startFilter.getMonth() - (months - 1));
                    startFilter.setHours(0, 0, 0, 0);
                    params.append('startDate', startFilter.toISOString());
                }
                
                if (params.toString()) {
                    url += '?' + params.toString();
                }
                
                const response = await fetch(url);
                const data = await response.json();
                
                userData[user] = data.map((item, index) => ({
                    name: item.category,
                    value: parseFloat(item.total),
                    fill: categoryColors[index % categoryColors.length]
                }));
            }
            setUserCategoryData(userData);
        } catch (error) {
            console.error('Errore nel caricamento dei dati utente per categoria:', error);
        }
    }, [filterType, startDate, endDate, users]);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/api/users`);
            const data = await response.json();
            setUsers(data.map(user => user.name));
        } catch (error) {
            console.error('Errore nel caricamento degli utenti:', error);
            setUsers([]);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        if (users.length > 0) {
            fetchMonthlyData();
            fetchCategoryData();
            fetchUserCategoryData();
        }
    }, [fetchMonthlyData, fetchCategoryData, fetchUserCategoryData, users]);

    useEffect(() => {
        let scrollTimer;
        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                setIsScrolling(false);
            }, 150);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimer);
        };
    }, []);

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        if (e.target.value !== 'custom') {
            setStartDate('');
            setEndDate('');
        }
    };

    const barComponents = useMemo(() => 
        users.map((user, index) => (
            <Bar 
                key={user}
                dataKey={user}
                stackId="a"
                fill={categoryColors[index % categoryColors.length]}
                isAnimationActive={!isScrolling}
                animationDuration={800}
            />
        )),
        [users, isScrolling]
    );

    const totalCategoryValue = useMemo(() => 
        categoryData.reduce((sum, e) => sum + (e.value || 0), 0),
        [categoryData]
    );

    const categoryPieCells = useMemo(() => 
        categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
        )),
        [categoryData]
    );

    const categoryLegend = useMemo(() => 
        categoryData.map((entry, index) => (
            <div key={index} className={styles.LegendItem}>
                <div className={styles.LegendColor} style={{ backgroundColor: entry.fill }}></div>
                <div className={styles.LegendText}>
                    <span className={styles.LegendLabel}>{entry.name}</span>
                    <span className={styles.LegendValue}>
                        {formatCurrency(entry.value)} ({((entry.value / totalCategoryValue) * 100).toFixed(0)}%)
                    </span>
                </div>
            </div>
        )),
        [categoryData, totalCategoryValue]
    );

    const userPieChartCells = useMemo(() => {
        const cells = {};
        users.forEach(user => {
            cells[user] = (userCategoryData[user] || []).map((entry, index) => (
                <Cell key={`cell-${user}-${index}`} fill={entry.fill} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
            ));
        });
        return cells;
    }, [users, userCategoryData]);

    const userPieCharts = useMemo(() => 
        users.map((user) => {
            const userData = userCategoryData[user] || [];
            const userTotal = userData.reduce((sum, item) => sum + item.value, 0);
            
            return (
                <div key={user} className={styles.SmallPieChartContainer}>
                    <div className={styles.ChartHeader}>
                        <h3>{user}</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                        <PieChart>
                            <Pie 
                                data={userData} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%"  
                                cy="50%"
                                innerRadius="35%" 
                                outerRadius="75%" 
                                animationDuration={800}
                                isAnimationActive={!isScrolling}
                            >
                                {userPieChartCells[user]}
                            </Pie>
                            <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={chartFontSize.smallLabel}>
                                Totale
                            </text>
                            <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={chartFontSize.smallLabel} fontWeight={600}>
                                {formatCurrency(userTotal)}
                            </text>
                            <Tooltip 
                                formatter={(value, name) => [formatCurrency(value), name]}
                                contentStyle={{
                                    backgroundColor: 'rgba(30, 30, 30, 0.95)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '8px',
                                    color: '#ffffff',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                                }}
                                labelStyle={{ color: '#ffffff' }}
                                itemStyle={{ color: '#ffffff' }}
                                isAnimationActive={false}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className={styles.ChartLegend}>
                        <button 
                            className={styles.LegendToggle}
                            onClick={() => setExpandedUserLegend(prev => ({ ...prev, [user]: !prev[user] }))}
                        >
                            {expandedUserLegend[user] ? '▼' : '▶'} Categorie ({userData.length})
                        </button>
                        <div className={`${styles.LegendContent} ${expandedUserLegend[user] ? styles.LegendExpanded : ''}`}>
                            {userData.map((entry, index) => (
                                <div key={index} className={styles.LegendItem}>
                                    <div className={styles.LegendColor} style={{ backgroundColor: entry.fill }}></div>
                                    <div className={styles.LegendText}>
                                        <span className={styles.LegendLabel}>{entry.name}</span>
                                        <span className={styles.LegendValue}>
                                            {formatCurrency(entry.value)} ({userTotal > 0 ? ((entry.value / userTotal) * 100).toFixed(0) : 0}%)
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }),
        [users, userCategoryData, isScrolling, userPieChartCells, expandedUserLegend]
    );

    return (
        <>
            <div className={styles.ChartContainer}>
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
                        <h2>Spese Mensili</h2>
                        <span className={styles.ChartSubtitle}>Confronto per membro della famiglia</span>
                    </div>
                    <ResponsiveContainer className={styles.ResponsiveContainer}>
                        <BarChart 
                            data={monthlyData} 
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
                                formatter={(value, name) => [formatCurrency(value), name]}
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
                                isAnimationActive={false}
                            />
                            {barComponents}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
          
                <div className={styles.PieChartContainer}>
                    <div className={styles.ChartHeader}>
                        <h2>Categorie delle spese</h2>
                        <span className={styles.ChartSubtitle}>Distribuzione per categoria</span>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
                            <Pie 
                                data={categoryData} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%"  
                                innerRadius="55%" 
                                outerRadius="85%" 
                                animationDuration={800}
                                isAnimationActive={!isScrolling}
                            >
                                {categoryPieCells}
                            </Pie>
                            <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={chartFontSize.label}>
                                Totale
                            </text>
                            <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={chartFontSize.smallLabel} fontWeight={600}>
                                {formatCurrency(totalCategoryValue)}
                            </text>
                            <Tooltip 
                                formatter={(value, name) => [formatCurrency(value), name]}
                                contentStyle={{
                                    backgroundColor: 'rgba(30, 30, 30, 0.95)',
                                    border: '1px solid rgba(139, 100, 100, 0.2)',
                                    borderRadius: '8px',
                                    color: '#ffffff',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                                }}
                                labelStyle={{ color: '#ffffff' }}
                                itemStyle={{ color: '#ffffff' }}
                                isAnimationActive={false}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className={styles.ChartLegend}>
                        {categoryLegend}
                    </div>

                    <div className={styles.UserPieChartsContainer}>
                        {userPieCharts}
                    </div>
                </div>
            </div>
        </>
    );
}