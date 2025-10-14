import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './App.module.css';
import { SideBar } from './Components/SideBar';
import { API_URL } from './config';


function App() {

  const [sideBar, setSideBar] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'online', 'offline', 'checking'

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000); // Controlla ogni 10 secondi
    return () => clearInterval(interval);
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/Test`, { 
        method: 'GET',
        signal: AbortSignal.timeout(3000) // Timeout di 3 secondi
      });
      if (response.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (error) {
      setServerStatus('offline');
    }
  };

  const handleClickMenu = () => {
    setSideBar(prev => !prev)
  };

  return (
    <main className={styles.MainContainer}>
      <header className={styles.titleContainer}>
        <button 
          className={`${styles.menuButton} ${sideBar ? styles.active : ''}`} 
          onClick={handleClickMenu}
          aria-label="Menu"
        >
          <img src="/menu-icon.svg" alt="Menu" />
        </button>
        <h1>Spese Familiari</h1>
        <div className={styles.ToggleContainer}>
          <div className={styles.serverStatus}>
            <span className={`${styles.statusDot} ${styles[serverStatus]}`}></span>
            <span className={styles.statusText}>
              {serverStatus === 'online' ? 'Server Online' : 
               serverStatus === 'offline' ? 'Server Offline' : 
               'Controllo...'}
            </span>
          </div>
        </div>
      </header> 
      
      <div className={styles.ContentWrapper}>
        {sideBar && <SideBar open={sideBar}/>}
        <div className={styles.MainContent}>
          <Outlet />
        </div>
      </div>
    </main>
  )
}

export default App;
