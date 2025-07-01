"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../service/authService"
import { useNotification } from "./NotificationContext"

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth AuthProvider ichida ishlatilishi kerak")
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const { showNotification } = useNotification()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const response = await authService.getMe()
            if (response.success) {
                setUser(response.user)
            }
        } catch (error) {
            console.log("Auth tekshirishda xato")
        } finally {
            setLoading(false)
        }
    }

    const login = async (loginData) => {
        try {
            const response = await authService.login(loginData)
            if (response.success) {
                setUser(response.user)
                showNotification(response.message, "success")
                return { success: true }
            }
        } catch (error) {
            const message = error.response?.data?.message || "Login xatosi"
            showNotification(message, "error")
            return { success: false, message }
        }
    }

    const register = async (registerData) => {
        try {
            const response = await authService.register(registerData)
            if (response.success) {
                setUser(response.user)
                showNotification(response.message, "success")
                return { success: true }
            }
        } catch (error) {
            const message = error.response?.data?.message || "Ro'yxatdan o'tishda xato"
            showNotification(message, "error")
            return { success: false, message }
        }
    }

    const logout = async () => {
        try {
            await authService.logout()
            setUser(null)
            showNotification("Muvaffaqiyatli chiqdingiz", "success")
        } catch (error) {
            showNotification("Chiqishda xato", "error")
        }
    }

    const value = {
        user,
        login,
        register,
        logout,
        loading,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
