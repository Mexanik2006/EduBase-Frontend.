"use client"
import { useState, useEffect } from "react"
import { useNotification } from "../../context/NotificationContext"
import { X, BookOpen, DollarSign, FileText, AlertTriangle } from "lucide-react"
import subjectService from "../../service/subjectService"

const EditSubjectModal = ({ isOpen, subject, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        status: "active",
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const { showNotification } = useNotification()

    const statuses = [
        { value: "active", label: "Faol", description: "Fan faol holatda" },
        { value: "inactive", label: "Nofaol", description: "Vaqtincha to'xtatilgan" },
    ]

    const isInactiveSubject = subject?.status === "inactive"

    useEffect(() => {
        if (isOpen && subject) {
            setFormData({
                name: subject.name || "",
                price: subject.price?.toString() || "",
                description: subject.description || "",
                status: subject.status || "active",
            })
            setErrors({})
        }
    }, [isOpen, subject])

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

        if (!formData.status) {
            newErrors.status = "Status tanlash majburiy"
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
            const response = await subjectService.updateSubject(subject._id, {
                ...formData,
                price: Number.parseFloat(formData.price),
            })
            if (response.success) {
                showNotification(response.message, "success")
                onSuccess()
                setErrors({})
            }
        } catch (error) {
            const message = error.response?.data?.message || "Fanni yangilashda xato"
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
                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    {/* Header */}
                    <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Fanni Tahrirlash</h3>
                                <p className="text-sm text-gray-600 mt-1">{subject?.name} ma'lumotlarini yangilash</p>
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
                            {/* Warning for inactive subject */}
                            {isInactiveSubject && (
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-amber-800">Nofaol fan</h3>
                                            <div className="mt-1 text-sm text-amber-700">
                                                <p>
                                                    Nofaol fanlar uchun ba'zi ma'lumotlar cheklangan bo'lishi mumkin. Fanni faollashtirish uchun
                                                    statusni o'zgartiring.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Fan nomi */}
                                <div className="md:col-span-2">
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
                            </div>

                            {/* Status Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {statuses.map((status) => (
                                        <label
                                            key={status.value}
                                            className={`relative flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 ${formData.status === status.value
                                                ? "border-gray-900 bg-gray-50 ring-2 ring-gray-900 ring-opacity-20"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="status"
                                                value={status.value}
                                                checked={formData.status === status.value}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div
                                                        className={`w-3 h-3 rounded-full ${status.value === "active" ? "bg-emerald-500" : "bg-amber-500"
                                                            }`}
                                                    />
                                                </div>
                                                <div className="ml-3">
                                                    <span className="font-medium text-gray-900">{status.label}</span>
                                                    <p className="text-sm text-gray-600 mt-1">{status.description}</p>
                                                </div>
                                            </div>
                                            {formData.status === status.value && (
                                                <div className="absolute top-3 right-3 w-2 h-2 bg-gray-900 rounded-full"></div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
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
                                        rows={4}
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
                                    Saqlanmoqda...
                                </>
                            ) : (
                                "O'zgarishlarni saqlash"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditSubjectModal
