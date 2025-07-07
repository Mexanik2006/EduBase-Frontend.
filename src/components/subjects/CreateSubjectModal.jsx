"use client"
import { useState } from "react"
import { useNotification } from "../../context/NotificationContext"
import { X, BookOpen, DollarSign, FileText } from "lucide-react"
import subjectService from "../../service/subjectService"

const CreateSubjectModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const { showNotification } = useNotification()

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Fan nomi majburiy"
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Fan nomi kamida 2 ta belgidan iborat bo'lishi kerak"
        }

        if (!formData.price) {
            newErrors.price = "Fan narxi majburiy"
        } else if (Number(formData.price) < 0) {
            newErrors.price = "Fan narxi manfiy bo'lishi mumkin emas"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        try {
            const response = await subjectService.createSubject({
                ...formData,
                price: Number.parseFloat(formData.price),
            })
            if (response.success) {
                showNotification(response.message, "success")
                onSuccess()
                // Reset form
                setFormData({
                    name: "",
                    price: "",
                    description: "",
                })
                setErrors({})
            }
        } catch (error) {
            const message = error.response?.data?.message || "Fan yaratishda xato"
            showNotification(message, "error")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal */}
                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    {/* Header */}
                    <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Yangi Fan Yaratish</h3>
                                <p className="text-sm text-gray-600 mt-1">Yangi fanni tizimga qo'shish</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="bg-white px-6 py-6">
                        <div className="space-y-6">
                            {/* Fan nomi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fan nomi <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                        placeholder="Fan nomini kiriting"
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Fan narxi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fan narxi (so'm) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        min="0"
                                        step="1000"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ${errors.price ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                        placeholder="0"
                                    />
                                </div>
                                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                            </div>

                            {/* Tavsif */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tavsif (ixtiyoriy)</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                        placeholder="Fan haqida qo'shimcha ma'lumot"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full sm:w-auto px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Yaratilmoqda...
                                </>
                            ) : (
                                "Fan yaratish"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateSubjectModal
