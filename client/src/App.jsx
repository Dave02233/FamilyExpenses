import { useState } from 'react'
import styles from './App.module.css'
import { Toggle } from './Components/Toggle'
import { SideBar } from './Components/SideBar'

function App() {

  const [sideBar, setSideBar] = useState(true);

  const handleClickMenu = () => {
    setSideBar(prev => !prev)
  };

  const [nightMode, setNightMode] = useState(true);

  return (
    <main className={styles.MainContainer}>
      <header className={styles.titleContainer}>
        <img className={sideBar ? styles.rotate : ''} src="vite.svg" alt="menu" onClick={handleClickMenu} />
        <h1>Spese Familiari</h1>
        <div className={styles.ToggleContainer}>
        
        <h3>Modalità notte</h3>
        <Toggle state={nightMode} toggleFunction={setNightMode}/>
        
        </div>

      </header> 
      <SideBar open={sideBar}/>
      <div className={styles.DataContainer}>

      </div>
    </main>
  )
}

export default App
