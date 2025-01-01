import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import Link from './pages/Link'
import RedirectLink from './pages/RedirectLink'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/auth',
        element: <Auth />,
      },
      {
        path: '/link/:id',
        element: <Link />,
      },
      {
        path: '/:id',
        element: <RedirectLink />,
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />)