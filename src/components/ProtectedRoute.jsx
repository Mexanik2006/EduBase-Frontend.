"use client"
import { useAuth } from "../context/AuthContext"
import { AlertCircle } from "lucide-react"

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth()

    if (!allowedRoles.includes(user?.role)) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Kirish taqiqlangan</h2>
                    <p className="text-gray-600">Bu sahifaga kirish huquqingiz yo'q</p>
                </div>
            </div>
        )
    }

    return children
}

export default ProtectedRoute
