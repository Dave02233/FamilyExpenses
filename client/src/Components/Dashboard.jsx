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
                    <h2>Spese Mensili</h2>
                    <ResponsiveContainer className={styles.ResponsiveContainer}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Bar dataKey="Davide" stackId="a" fill="#8884d8" />
                            <Bar dataKey="Alessia" stackId="a" fill="#82ca9d" />
                            <Bar dataKey="Chiara" stackId="a" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
          
                <div className={styles.PieChartContainer}>
                    <ResponsiveContainer>
                            <PieChart>
                            <Pie 
                                data={pieData} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%" 
                                cy="50%" 
                                outerRadius={'100%'} 
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
}