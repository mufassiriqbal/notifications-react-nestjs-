import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import EditNotificationPage from './pages/EditNotificationPage'
import LoginPage from './pages/LoginPage'
import NewNotificationPage from './pages/NewNotificationPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/notifications/new"
          element={<NewNotificationPage />}
        />
        <Route
          path="/notifications/:id"
          element={<EditNotificationPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
