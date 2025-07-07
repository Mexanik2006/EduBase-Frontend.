"use client"

import { useAuth } from "../context/AuthContext"
import { AlertCircle } from "lucide-react"

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth()

    if (!allowedRoles.includes(user?.role)) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Kirish taqiqlangan</h2>
                    <p className="text-gray-600">Bu sahifaga kirish huquqingiz yo'q</p>
                </div>
            </div>
        )
    }

    return children
}

export default ProtectedRoute
