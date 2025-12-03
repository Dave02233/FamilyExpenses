import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './App.module.css';
import { SideBar } from './Components/SideBar';
import { DEFAULT_API_URL } from './config';
import { ApiConfigProvider } from './context/ApiConfigContext';


function App() {

  const [sideBar, setSideBar] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'online', 'offline', 'checking'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [tempUrl, setTempUrl] = useState('');
  const [apiBaseUrl, setApiBaseUrl] = useState(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_API_URL;
    }
    return localStorage.getItem('apiBaseUrl') || DEFAULT_API_URL;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('apiBaseUrl', apiBaseUrl);
    }
  }, [apiBaseUrl]);

  const checkServerStatus = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/Test`, { 
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
  }, [apiBaseUrl]);

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000); // Controlla ogni 10 secondi
    return () => clearInterval(interval);
  }, [checkServerStatus]);

  const handleClickMenu = () => {
    setSideBar(prev => !prev)
  };

  const handleOpenModal = () => {
    setTempUrl(apiBaseUrl);
    setUrlError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUrlError('');
  };

  const handleUrlChange = (event) => {
    setTempUrl(event.target.value);
  };

  const handleSaveUrl = () => {
    const trimmed = tempUrl.trim();
    if (!trimmed) {
      setUrlError('Inserisci un indirizzo valido.');
      return;
    }

    if (!/^https?:\/\//i.test(trimmed)) {
      setUrlError('L\'indirizzo deve iniziare con http:// oppure https://');
      return;
    }

    setApiBaseUrl(trimmed.replace(/\/$/, ''));
    setServerStatus('checking');
    handleCloseModal();
  };

  const serverStatusLabel = serverStatus === 'online'
    ? 'Server Online'
    : serverStatus === 'offline'
      ? 'Server Offline'
      : 'Controllo...';

  return (
    <ApiConfigProvider value={{ apiBaseUrl, setApiBaseUrl }}>
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
            <button
              type="button"
              className={styles.serverStatusButton}
              onClick={handleOpenModal}
              aria-label="Configura indirizzo server"
            >
              <div className={styles.serverStatus}>
                <span className={`${styles.statusDot} ${styles[serverStatus]}`}></span>
                <span className={styles.statusText}>{serverStatusLabel}</span>
              </div>
              <span className={styles.serverUrlLabel}>{apiBaseUrl}</span>
            </button>
          </div>
        </header> 
        
        <div className={styles.ContentWrapper}>
          {sideBar && <SideBar open={sideBar} click={handleClickMenu}/>}
          <div className={styles.MainContent}>
            <Outlet />
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="server-config-title">
          <div className={styles.modalContent}>
            <h2 id="server-config-title">Configura indirizzo server</h2>
            <p>Inserisci l'URL completo dell'API (es. http://192.168.0.120:3001).</p>
            <input
              className={styles.modalInput}
              type="text"
              value={tempUrl}
              onChange={handleUrlChange}
              autoFocus
            />
            {urlError && <p className={styles.modalError}>{urlError}</p>}
            <div className={styles.modalActions}>
              <button type="button" onClick={handleSaveUrl} className={styles.primaryButton}>
                Salva
              </button>
              <button type="button" onClick={handleCloseModal} className={styles.secondaryButton}>
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </ApiConfigProvider>
  )
}

export default App;
