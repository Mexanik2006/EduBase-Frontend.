"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
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
    const [isInitialized, setIsInitialized] = useState(false)
    const { showNotification } = useNotification()
    const checkingAuth = useRef(false)

    // Auth check function with useCallback to prevent re-creation
    const checkAuth = useCallback(async () => {
        // Prevent multiple simultaneous auth checks
        if (checkingAuth.current) return

        checkingAuth.current = true

        try {
            const response = await authService.getMe()
            if (response.success) {
                setUser(response.user)
            } else {
                setUser(null)
            }
        } catch (error) {
            // Cookie yo'q yoki yaroqsiz bo'lsa, user null bo'ladi
            setUser(null)
        } finally {
            setLoading(false)
            setIsInitialized(true)
            checkingAuth.current = false
        }
    }, [])

    // Initial auth check - only once
    useEffect(() => {
        if (!isInitialized) {
            checkAuth()
        }
    }, [checkAuth, isInitialized])

    const login = useCallback(
        async (loginData) => {
            try {
                const response = await authService.login(loginData)
                if (response.success) {
                    setUser(response.user)
                    showNotification(response.message, "success")
                    return { success: true }
                }
            } catch (error) {
                const errorData = error.response?.data
                if (errorData?.needsActivation) {
                    return {
                        success: false,
                        needsActivation: true,
                        email: errorData.email,
                        message: errorData.message,
                    }
                }
                const message = errorData?.message || "Login xatosi"
                showNotification(message, "error")
                return { success: false, message }
            }
        },
        [showNotification],
    )

    const register = useCallback(
        async (registerData) => {
            try {
                const response = await authService.register(registerData)
                if (response.success) {
                    if (response.needsActivation) {
                        return {
                            success: true,
                            needsActivation: true,
                            email: response.email,
                            message: response.message,
                        }
                    }
                    setUser(response.user)
                    showNotification(response.message, "success")
                    return { success: true }
                }
            } catch (error) {
                const message = error.response?.data?.message || "Ro'yxatdan o'tishda xato"
                showNotification(message, "error")
                return { success: false, message }
            }
        },
        [showNotification],
    )

    const logout = useCallback(async () => {
        try {
            await authService.logout()
            setUser(null)
            showNotification("Muvaffaqiyatli chiqdingiz", "success")
        } catch (error) {
            // Xato bo'lsa ham user ni null qilish
            setUser(null)
            showNotification("Chiqish amalga oshirildi", "info")
        }
    }, [showNotification])

    // Memoize the context value to prevent unnecessary re-renders
    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isInitialized,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
