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

const formatCurrency = (value) => `${value}€`;

export const Dashboard = () => {
    return (
        <>
            <div className={styles.ChartContainer}>
                <div className={styles.BarChartContainer}>
                    <div className={styles.ChartHeader}>
                        <h2>💰 Spese Mensili</h2>
                        <span className={styles.ChartSubtitle}>Confronto per membro della famiglia</span>
                    </div>
                    <ResponsiveContainer className={styles.ResponsiveContainer}>
                        <BarChart 
                            data={data} 
                            margin={{ top: 10, right: 15, left: 10, bottom: 5 }}
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
                    <ResponsiveContainer>
                        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <Pie 
                                data={pieData} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%" 
                                cy="50%" 
                                innerRadius="20%" 
                                outerRadius="35%" 
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
                </div>
            </div>
        </>
    );
}