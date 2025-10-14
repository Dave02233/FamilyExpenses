import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './App.module.css';
import { SideBar } from './Components/SideBar';


function App() {

  const [sideBar, setSideBar] = useState(true);

  const handleClickMenu = () => {
    setSideBar(prev => !prev)
  };

  return (
    <main className={styles.MainContainer}>
      <header className={styles.titleContainer}>
        <img className={sideBar ? styles.rotate : ''} src="vite.svg" alt="menu" onClick={handleClickMenu} />
        <h1>Spese Familiari</h1>
        <div className={styles.ToggleContainer}>
        
        
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
