import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './Styles/Dashboard.module.css';

const data = [
    { name: 'Gen', Davide: 120, Alessia: 200, Chiara: 80 },
    { name: 'Feb', Davide: 90, Alessia: 150, Chiara: 60 },
    { name: 'Mar', Davide: 160, Alessia: 220, Chiara: 120 },
    { name: 'Apr', Davide: 80, Alessia: 100, Chiara: 40 },
    { name: 'Mag', Davide: 130, Alessia: 170, Chiara: 50 },
    { name: 'Giu', Davide: 140, Alessia: 180, Chiara: 100 },
];

const pieData = [
    { name: 'Sigarette', value: 720, fill: '#8884d8' },
    { name: 'Spesa', value: 1020, fill: '#82ca9d' },
    { name: 'Vestiti', value: 450, fill: '#ffc658' },
];

const users = [
    'Alessia',
    'Chiara',
    'Davide',
]

const formatCurrency = (value) => `${value}€`;

export const Dashboard = () => {
    const [filterType, setFilterType] = useState('1mese');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        if (e.target.value !== 'custom') {
            setStartDate('');
            setEndDate('');
        }
    };
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
                        <h2>💰 Spese Mensili</h2>
                        <span className={styles.ChartSubtitle}>Confronto per membro della famiglia</span>
                    </div>
                    <ResponsiveContainer className={styles.ResponsiveContainer}>
                        <BarChart 
                            data={data} 
                            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                            barCategoryGap="15%"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#ffffff', fontSize: 12 }}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#ffffff', fontSize: 12 }}
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
                            />
                            <Bar dataKey="Davide" stackId="a" fill="#8884d8" />
                            <Bar dataKey="Alessia" stackId="a" fill="#82ca9d" />
                            <Bar dataKey="Chiara" stackId="a" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
          
                <div className={styles.PieChartContainer}>
                    <div className={styles.ChartHeader}>
                        <h2>📊 Categorie di Spesa</h2>
                        <span className={styles.ChartSubtitle}>Distribuzione per categoria</span>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                            <Pie 
                                data={pieData} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%"  
                                innerRadius="40%" 
                                outerRadius="75%" 
                                animationDuration={1000}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
                                ))}
                            </Pie>
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
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Pie charts per utente */}
                    <div className={styles.UserPieChartsContainer}>
                        {users.map((user) => (
                            <div key={user} className={styles.SmallPieChartContainer}>
                                <div className={styles.ChartHeader}>
                                    <h3>{user}</h3>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie 
                                            data={pieData} 
                                            dataKey="value" 
                                            nameKey="name" 
                                            cx="50%"  
                                            cy="50%"
                                            innerRadius="40%" 
                                            outerRadius="85%" 
                                            animationDuration={1000}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${user}-${index}`} fill={entry.fill} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
                                            ))}
                                        </Pie>
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
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}