# Family Expenses - Client

Applicazione React per la gestione delle spese familiari.

## Setup

### 1. Installa le dipendenze
```bash
npm install
```

### 2. Configura le variabili d'ambiente

Copia il file `.env.example` in `.env` e modifica i valori:

```bash
cp .env.example .env
```

Modifica il file `.env`:
```env
VITE_API_URL=http://localhost:3001
```

Se il server è su un'altra macchina o porta, cambia l'URL di conseguenza:
```env
# Esempio: server su macchina diversa
VITE_API_URL=http://192.168.1.100:3001

# Esempio: server su porta diversa
VITE_API_URL=http://localhost:5000
```

### 3. Avvia il dev server

```bash
npm run dev
```

### 4. Build per produzione

```bash
npm run build
```

## Variabili d'Ambiente

| Variabile | Descrizione | Default |
|-----------|-------------|---------|
| `VITE_API_URL` | URL del server backend | `http://localhost:3001` |

## Tecnologie

- React + Vite
- React Router
- Recharts (grafici)
- CSS Modules

---

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
