const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const port = 3001;


app.use(cors());
app.use(express.json()); //Body parse per tutte le richieste

// Dist
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/Test', (req, res) => {
    db.query('SELECT * FROM expenses', [])
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Ottiene la lista di tutti gli utenti
app.get('/api/users', (req, res) => {
    db.query('SELECT name FROM users ORDER BY name', [])
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/api/expenses', (req, res) => {
    const { user_name, created_at, amount, category, description } = req.body;
    
    db.query('SELECT id FROM users WHERE name = $1', [user_name])
        .then(userResult => {
            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: 'Utente non trovato' });
            }
            const user_id = userResult.rows[0].id;
            
            return db.query(
                'INSERT INTO expenses (user_id, created_at, amount, category, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [user_id, created_at, amount, category, description]
            );
        })
        .then(result => {
            if (result) res.status(201).json(result.rows[0]);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/api/incomes', (req, res) => {
    const { user_name, amount, category, description } = req.body;
    
    db.query('SELECT id FROM users WHERE name = $1', [user_name])
        .then(userResult => {
            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: 'Utente non trovato' });
            }

            const user_id = userResult.rows[0].id;
            return db.query(
                'INSERT INTO incomes (user_id, amount, category, description) VALUES ($1, $2, $3, $4) RETURNING *',
                [user_id, amount, category, description]
            );
        })
        .then(result => {
            if (result) res.status(201).json(result.rows[0]);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Elimina una spesa
app.delete('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Spesa non trovata' });
            }
            res.json({ message: 'Spesa eliminata con successo', deleted: result.rows[0] });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Elimina un'entrata
app.delete('/api/incomes/:id', (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM incomes WHERE id = $1 RETURNING *', [id])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Entrata non trovata' });
            }
            res.json({ message: 'Entrata eliminata con successo', deleted: result.rows[0] });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/api/expenses/by-category', (req, res) => {
    const { startDate, endDate } = req.query;
    let query = 'SELECT category, SUM(amount) as total, COUNT(*) as count FROM expenses';
    const params = [];
    
    if (startDate && endDate) {
        query += ' WHERE created_at >= $1 AND created_at <= $2';
        params.push(startDate, endDate);
    } else if (startDate) {
        query += ' WHERE created_at >= $1';
        params.push(startDate);
    } else if (endDate) {
        query += ' WHERE created_at <= $1';
        params.push(endDate);
    }
    
    query += ' GROUP BY category ORDER BY total DESC';
    
    db.query(query, params)
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/api/expenses/by-category/:user_name', (req, res) => {
    const { user_name } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = `SELECT category, SUM(amount) as total, COUNT(*) as count 
         FROM expenses e 
         JOIN users u ON e.user_id = u.id 
         WHERE u.name = $1`;
    const params = [user_name];
    
    if (startDate && endDate) {
        query += ' AND e.created_at >= $2 AND e.created_at <= $3';
        params.push(startDate, endDate);
    } else if (startDate) {
        query += ' AND e.created_at >= $2';
        params.push(startDate);
    } else if (endDate) {
        query += ' AND e.created_at <= $2';
        params.push(endDate);
    }
    
    query += ' GROUP BY category ORDER BY total DESC';
    
    db.query(query, params)
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Ottiene le spese mensili aggregate per tutti gli utenti
app.get('/api/expenses/monthly', (req, res) => {
    const { startDate, endDate, months } = req.query;
    
    let query = `SELECT 
            TO_CHAR(created_at, 'Mon') as name,
            EXTRACT(MONTH FROM created_at) as month_num,
            EXTRACT(YEAR FROM created_at) as year_num,
            u.name as user_name,
            SUM(amount) as total
         FROM expenses e
         JOIN users u ON e.user_id = u.id`;
    
    const params = [];
    
    if (startDate && endDate) {
        query += ' WHERE created_at >= $1 AND created_at <= $2';
        params.push(startDate, endDate);
    } else if (months) {
        // Seleziona gli ultimi N mesi COMPLETI (dal primo giorno del mese più vecchio)
        const numMonths = parseInt(months);
        query += ` WHERE created_at >= DATE_TRUNC('month', NOW() - INTERVAL '${numMonths - 1} months')`;
    } else {
        query += ' WHERE created_at >= DATE_TRUNC(\'month\', NOW() - INTERVAL \'5 months\')';
    }
    
    query += ' GROUP BY month_num, year_num, TO_CHAR(created_at, \'Mon\'), u.name ORDER BY year_num, month_num';
    
    db.query(query, params)
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Ottiene i dati del profilo utente (obiettivo di risparmio, bilancio mensile)
app.get('/api/user/:user_name/profile', (req, res) => {
    const { user_name } = req.params;
    
    db.query(
        `SELECT 
            u.id,
            u.name,
            u.savings_goal,
            COALESCE(
                (SELECT SUM(amount) FROM incomes 
                 WHERE user_id = u.id 
                 AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
                 AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
                ), 0
            ) as total_income,
            COALESCE(
                (SELECT SUM(amount) FROM expenses 
                 WHERE user_id = u.id 
                 AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
                 AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
                ), 0
            ) as total_expenses,
            COALESCE(
                (SELECT SUM(amount) FROM incomes 
                 WHERE user_id = u.id
                ), 0
            ) - COALESCE(
                (SELECT SUM(amount) FROM expenses 
                 WHERE user_id = u.id
                ), 0
            ) as current_savings
         FROM users u
         WHERE u.name = $1`,
        [user_name]
    )
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Utente non trovato' });
            }
            res.json(result.rows[0]);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Ottiene entrate vs uscite mensili per un utente specifico
app.get('/api/user/:user_name/monthly-income-expense', (req, res) => {
    const { user_name } = req.params;
    const { startDate, endDate, months } = req.query;
    
    let query = `SELECT 
            TO_CHAR(created_at, 'Mon') as name,
            EXTRACT(MONTH FROM created_at) as month_num,
            EXTRACT(YEAR FROM created_at) as year_num,
            'income' as type,
            SUM(amount) as total
         FROM incomes i
         JOIN users u ON i.user_id = u.id
         WHERE u.name = $1`;
    
    const params = [user_name];
    
    if (startDate && endDate) {
        query += ' AND created_at >= $2 AND created_at <= $3';
        params.push(startDate, endDate);
    } else if (months) {
        const numMonths = parseInt(months);
        query += ` AND created_at >= DATE_TRUNC('month', NOW() - INTERVAL '${numMonths - 1} months')`;
    } else {
        query += ' AND created_at >= DATE_TRUNC(\'month\', NOW() - INTERVAL \'5 months\')';
    }
    
    query += ' GROUP BY month_num, year_num, TO_CHAR(created_at, \'Mon\')';
    query += ' UNION ALL ';
    query += `SELECT 
            TO_CHAR(created_at, 'Mon') as name,
            EXTRACT(MONTH FROM created_at) as month_num,
            EXTRACT(YEAR FROM created_at) as year_num,
            'expense' as type,
            SUM(amount) as total
         FROM expenses e
         JOIN users u ON e.user_id = u.id
         WHERE u.name = $1`;
    
    if (startDate && endDate) {
        query += ' AND created_at >= $2 AND created_at <= $3';
    } else if (months) {
        const numMonths = parseInt(months);
        query += ` AND created_at >= DATE_TRUNC('month', NOW() - INTERVAL '${numMonths - 1} months')`;
    } else {
        query += ' AND created_at >= DATE_TRUNC(\'month\', NOW() - INTERVAL \'5 months\')';
    }
    
    query += ' GROUP BY month_num, year_num, TO_CHAR(created_at, \'Mon\')';
    query += ' ORDER BY year_num, month_num';
    
    db.query(query, params)
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Ottiene le transazioni recenti di un utente
app.get('/api/user/:user_name/recent-transactions', (req, res) => {
    const { user_name } = req.params;
    const limit = req.query.limit || 10;
    
    db.query(
        `SELECT 
            'expense' as type,
            e.id,
            e.amount,
            e.category,
            e.description,
            e.created_at
         FROM expenses e
         JOIN users u ON e.user_id = u.id
         WHERE u.name = $1
         UNION ALL
         SELECT 
            'income' as type,
            i.id,
            i.amount,
            i.category,
            i.description,
            i.created_at
         FROM incomes i
         JOIN users u ON i.user_id = u.id
         WHERE u.name = $1
         ORDER BY created_at DESC
         LIMIT $2`,
        [user_name, limit]
    )
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Aggiorna l'obiettivo di risparmio dell'utente
app.put('/api/user/:user_name/savings-goal', (req, res) => {
    const { user_name } = req.params;
    const { savings_goal } = req.body;
    
    db.query('SELECT id FROM users WHERE name = $1', [user_name])
        .then(userResult => {
            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: 'Utente non trovato' });
            }
            const user_id = userResult.rows[0].id;
            
            return db.query(
                'UPDATE users SET savings_goal = $1 WHERE id = $2 RETURNING *',
                [savings_goal, user_id]
            );
        })
        .then(result => {
            if (result) res.json(result.rows[0]);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Catch-all route: deve essere DOPO tutte le route API
// Restituisce index.html per tutte le route non-API, permettendo a React Router di gestire il routing
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(port, '0.0.0.0',
    () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});


