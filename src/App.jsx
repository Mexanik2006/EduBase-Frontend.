import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import LoginPage from "./auth/LoginPage"
import RegisterPage from "./auth/RegisterPage"
import ActivationPage from "./auth/ActivationPage"
import Dashboard from "./components/Dashboard"
import Notification from "./components/Notification"
import { useMemo } from "react"

function App() {
  const { user, loading, isInitialized } = useAuth()

  const loadingComponent = useMemo(
    () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="mt-4 text-sm text-gray-600 font-medium">Yuklanmoqda...</p>
        </div>
      </div>
    ),
    [],
  )

  if (!isInitialized || loading) {
    return loadingComponent
  }

  return (
    <Router>
      <div className="App">
        <Notification />
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
          <Route path="/activate" element={user ? <Navigate to="/dashboard" replace /> : <ActivationPage />} />
          <Route path="/dashboard/*" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
