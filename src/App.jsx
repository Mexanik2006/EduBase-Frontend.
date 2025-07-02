"use client"

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

  // Memoize the loading component to prevent re-renders
  const loadingComponent = useMemo(
    () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    ),
    [],
  )

  // Show loading only if not initialized
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
