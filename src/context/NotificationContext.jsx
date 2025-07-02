"use client"

import { createContext, useContext, useState, useCallback } from "react"

const NotificationContext = createContext()

export const useNotification = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error("useNotification NotificationProvider ichida ishlatilishi kerak")
    }
    return context
}

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])

    const showNotification = useCallback((message, type = "info") => {
        const id = Date.now() + Math.random() // Unique ID
        const notification = { id, message, type }

        setNotifications((prev) => [...prev, notification])

        // 5 soniyadan keyin o'chirish
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id))
        }, 5000)
    }, [])

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, [])

    const value = {
        showNotification,
        notifications,
        removeNotification,
    }

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
