import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { Dashboard } from './Components/Dashboard.jsx';
import { Profile } from './Components/Profile.jsx';
import { NewProfile } from './Components/NewProfile.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {index: true, element: <Dashboard />},
      {path: 'profile/:user', element: <Profile />},
      {path: 'newProfile', element: <NewProfile />}
    ]
  }

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
