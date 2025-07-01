"use client"
import { useNotification } from "../context/NotificationContext"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

const Notification = () => {
    const { notifications, removeNotification } = useNotification()

    const getIcon = (type) => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5" />
            case "error":
                return <AlertCircle className="w-5 h-5" />
            default:
                return <Info className="w-5 h-5" />
        }
    }

    const getStyles = (type) => {
        switch (type) {
            case "success":
                return "bg-green-50 border-green-200 text-green-800"
            case "error":
                return "bg-red-50 border-red-200 text-red-800"
            default:
                return "bg-blue-50 border-blue-200 text-blue-800"
        }
    }

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`flex items-center p-4 border rounded-lg shadow-lg min-w-80 ${getStyles(notification.type)}`}
                >
                    <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">{notification.message}</p>
                    </div>
                    <button onClick={() => removeNotification(notification.id)} className="ml-4 flex-shrink-0 hover:opacity-70">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    )
}

export default Notification
