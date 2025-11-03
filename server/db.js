const { Pool } = require('pg');

const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 5432,
});

// Evento per errori di connessione
pool.on('error', (err) => {
    console.error('Errore imprevisto nel pool di connessione:', err);
});

// Test iniziale della connessione
pool.connect((err, client, release) => {
    if (err) {
        console.error('Errore di connessione al database:', err.message);
        console.error('Verifica che PostgreSQL sia in esecuzione e che le credenziali siano corrette');
        return;
    }
    console.log('Connessione al database stabilita con successo');
    release();
});

module.exports = {
    query: (text, params) => pool.query(text, params)
}