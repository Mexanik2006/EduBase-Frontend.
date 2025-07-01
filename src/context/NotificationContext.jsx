"use client"

import { createContext, useContext, useState } from "react"

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

    const showNotification = (message, type = "info") => {
        const id = Date.now()
        const notification = { id, message, type }

        setNotifications((prev) => [...prev, notification])

        // 5 soniyadan keyin o'chirish
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id))
        }, 5000)
    }

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }

    return (
        <NotificationContext.Provider value={{ showNotification, notifications, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    )
}
