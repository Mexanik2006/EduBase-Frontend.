"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import { X, User, Mail, Phone } from "lucide-react"
import axios from "../../service/authService"

const EditUserModal = ({ isOpen, user, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        status: "",
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const { user: currentUser } = useAuth()
    const { showNotification } = useNotification()

    const isInactiveUser = user?.status === "inactive"

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                role: user.role || "",
                status: user.status || "",
            })
        }
    }, [user])

    const getAvailableRoles = () => {
        switch (currentUser?.role) {
            case "director":
                return [
                    { value: "manager", label: "Menejer", description: "Guruhlar va mentorlarni boshqaradi" },
                    { value: "mentor", label: "Mentor", description: "Dars o'tadi va talabalarni o'qitadi" },
                    { value: "accountant", label: "Buxgalter", description: "Moliyaviy ishlarni boshqaradi" },
                    { value: "reception", label: "Qabulxona", description: "Yangi talabalarni qabul qiladi" },
                    { value: "student", label: "Talaba", description: "Darslarni o'qiydi" },
                ]
            case "manager":
                return [
                    { value: "mentor", label: "Mentor", description: "Dars o'tadi va talabalarni o'qitadi" },
                    { value: "accountant", label: "Buxgalter", description: "Moliyaviy ishlarni boshqaradi" },
                    { value: "reception", label: "Qabulxona", description: "Yangi talabalarni qabul qiladi" },
                    { value: "student", label: "Talaba", description: "Darslarni o'qiydi" },
                ]
            default:
                return [
                    { value: "manager", label: "Menejer", description: "Guruhlar va mentorlarni boshqaradi" },
                    { value: "mentor", label: "Mentor", description: "Dars o'tadi va talabalarni o'qitadi" },
                    { value: "accountant", label: "Buxgalter", description: "Moliyaviy ishlarni boshqaradi" },
                    { value: "reception", label: "Qabulxona", description: "Yangi talabalarni qabul qiladi" },
                    { value: "student", label: "Talaba", description: "Darslarni o'qiydi" },
                ]
        }
    }

    const statuses = [
        { value: "active", label: "Faol", description: "Tizimga kirish mumkin" },
        { value: "inactive", label: "Nofaol", description: "Vaqtincha to'xtatilgan" },
    ]

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Ism majburiy"
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Ism kamida 2 ta belgidan iborat bo'lishi kerak"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email majburiy"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email formati noto'g'ri"
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Telefon raqam majburiy"
        } else if (!/^\+998\d{9}$/.test(formData.phone.replace(/\s/g, ""))) {
            newErrors.phone = "Telefon raqam formati: +998901234567"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })

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
            const response = await axios.put(`/api/users/${user._id}`, formData)
            if (response.data.success) {
                showNotification(response.data.message, "success")
                onSuccess()
                setErrors({})
            }
        } catch (error) {
            const message = error.response?.data?.message || "Foydalanuvchini yangilashda xato"
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
                                <h3 className="text-xl font-semibold text-gray-900">Foydalanuvchini tahrirlash</h3>
                                <p className="text-sm text-gray-600 mt-1">{user?.name} ma'lumotlarini yangilash</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white px-6 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Ism */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    To'liq ism <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={isInactiveUser}
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                                            } ${isInactiveUser ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
                                        placeholder="To'liq ismni kiriting"
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isInactiveUser}
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                                            } ${isInactiveUser ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Telefon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Telefon <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={isInactiveUser}
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                                            } ${isInactiveUser ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
                                        placeholder="+998 90 123 45 67"
                                    />
                                </div>
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            {isInactiveUser && (
                                <div className="md:col-span-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">Nofaol foydalanuvchi</h3>
                                            <div className="mt-1 text-sm text-yellow-700">
                                                <p>
                                                    Nofaol foydalanuvchilar uchun faqat status o'zgartirilishi mumkin. Boshqa ma'lumotlarni
                                                    o'zgartirish uchun avval foydalanuvchini faollashtiring.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Rol */}
                            {!isInactiveUser && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rol <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {getAvailableRoles().map((role) => (
                                            <label
                                                key={role.value}
                                                className={`relative flex flex-col p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${formData.role === role.value
                                                    ? "border-black bg-gray-50 ring-2 ring-black ring-opacity-20"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={role.value}
                                                    checked={formData.role === role.value}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <span className="font-medium text-gray-900">{role.label}</span>
                                                <span className="text-sm text-gray-600 mt-1">{role.description}</span>
                                                {formData.role === role.value && (
                                                    <div className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full"></div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 gap-3">
                                    {statuses.map((status) => (
                                        <label
                                            key={status.value}
                                            className={`relative flex flex-col p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${formData.status === status.value
                                                ? "border-black bg-gray-50 ring-2 ring-black ring-opacity-20"
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
                                            <span className="font-medium text-gray-900">{status.label}</span>
                                            <span className="text-sm text-gray-600 mt-1">{status.description}</span>
                                            {formData.status === status.value && (
                                                <div className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full"></div>
                                            )}
                                        </label>
                                    ))}
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
                            className="w-full sm:w-auto px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Saqlanmoqda...
                                </>
                            ) : isInactiveUser ? (
                                "Statusni o'zgartirish"
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

export default EditUserModal
