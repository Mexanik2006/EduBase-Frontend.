"use client"

import { AlertTriangle, Archive, Trash2, RotateCcw, CheckCircle, X } from "lucide-react"

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = "warning",
    confirmText = "Tasdiqlash",
    cancelText = "Bekor qilish",
    loading = false,
}) => {
    if (!isOpen) return null

    const getIcon = () => {
        switch (type) {
            case "danger":
                return <Trash2 className="h-5 w-5" />
            case "archive":
                return <Archive className="h-5 w-5" />
            case "restore":
                return <RotateCcw className="h-5 w-5" />
            case "success":
                return <CheckCircle className="h-5 w-5" />
            default:
                return <AlertTriangle className="h-5 w-5" />
        }
    }

    const getIconColor = () => {
        switch (type) {
            case "danger":
                return "text-red-500"
            case "archive":
                return "text-amber-500"
            case "restore":
                return "text-green-500"
            case "success":
                return "text-green-500"
            default:
                return "text-amber-500"
        }
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose}></div>

                {/* Modal */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200">
                    {/* Header */}
                    <div className="bg-white px-6 pt-6 pb-4">
                        <div className="flex items-start">
                            <div className={`flex-shrink-0 ${getIconColor()}`}>{getIcon()}</div>
                            <div className="ml-3 w-0 flex-1">
                                <h3 className="text-lg font-medium text-gray-900 leading-6">{title}</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 leading-5">{message}</p>
                                </div>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex">
                                <button
                                    onClick={onClose}
                                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    <span className="sr-only">Close</span>
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Jarayonda...
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal
