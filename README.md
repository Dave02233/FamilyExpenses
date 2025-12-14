# FamilyExpenses

Applicazione full-stack per gestire le spese familiari con interfaccia React, API Node.js e script SQL per l'inizializzazione del database.

## Panoramica
- **Client** (`client/`): dashboard Vite + React con selezione dinamica dell'endpoint API direttamente dall'interfaccia.
- **Server** (`server/`): applicazione Express che espone endpoint per spese, entrate e profili collegati al database relazionale.
- **Database** (`DB/`): `Create.sql` per creare lo schema e `InsertTestData.sql` per inserire dati di esempio.

## Requisiti
- Node.js 20 o superiore
- npm 10 o superiore
- Database compatibile con PostgreSQL (configurabile in `server/db.js`)

## Installazione
1. **Dipendenze**
   ```powershell
   cd server; npm install
   cd ..\client; npm install
   ```
2. **Database**
   - Eseguire `DB/Create.sql` per creare le tabelle.
   - Facoltativo: lanciare `DB/InsertTestData.sql` per popolare dati di test.
3. **Variabili d'ambiente**
   - Server: creare `server/.env` con `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
   - Client: creare `client/.env` con `VITE_API_URL=http://localhost:3001` (o l'host dell'API).

## Avvio in locale
1. Avviare l'API (consigliato in modalità produzione con pm2):
   ``bash
   cd server
   pm2 start app.js --name expenses-api
   ``
2. Avviare il front-end in un altro terminale:
   ``bash
   cd client
   npm run dev
   ``
3. Aprire l'URL fornito da Vite (tipicamente http://localhost:5173).

## Modifica dell'URL API
Cliccare sul badge di stato server nell'header per aprire il modal, inserire il nuovo indirizzo (es. `http://192.168.0.120:3001`) e salvarlo. Il valore viene memorizzato in `localStorage` e applicato a tutte le richieste successive.

## Distribuzione
- Build del client: `cd client; npm run build`, quindi servire il contenuto della cartella `dist`.
- Esecuzione del server: ``cd server; pm2 start app.js --name expenses-api`` con le variabili d'ambiente configurate.
- Nel mio setup, l’API gira su un Raspberry Pi collegato alla rete locale di casa, con IP statico assegnato dal router per avere un indirizzo fisso.
- Per l’accesso remoto utilizzo Tailscale, in modo da raggiungere il Raspberry Pi in sicurezza tramite VPN, senza esporre direttamente il servizio su Internet.
- Se l’API è pubblica, configurare un proxy o un bilanciatore che gestisca HTTPS e limiti gli accessi non autorizzati.