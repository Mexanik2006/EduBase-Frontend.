"use client"

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import { X, User, Mail, Phone, Lock, UserCheck, Eye, EyeOff } from "lucide-react"
import axios from "../../service/authService"

const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        login: "",
        password: "",
        role: "student",
    })
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const { user } = useAuth()
    const { showNotification } = useNotification()

    const getAvailableRoles = () => {
        switch (user?.role) {
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
            case "reception":
                return [{ value: "student", label: "Talaba", description: "Darslarni o'qiydi" }]
            default:
                return []
        }
    }

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

        if (!formData.login.trim()) {
            newErrors.login = "Login majburiy"
        } else if (formData.login.trim().length < 3) {
            newErrors.login = "Login kamida 3 ta belgidan iborat bo'lishi kerak"
        }

        if (!formData.password) {
            newErrors.password = "Parol majburiy"
        } else if (formData.password.length < 6) {
            newErrors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak"
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
            const response = await axios.post("/api/users", formData)
            if (response.data.success) {
                showNotification(response.data.message, "success")
                onSuccess()
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    login: "",
                    password: "",
                    role: "student",
                })
                setErrors({})
            }
        } catch (error) {
            const message = error.response?.data?.message || "Foydalanuvchi yaratishda xato"
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
                                <h3 className="text-xl font-semibold text-gray-900">Yangi Foydalanuvchi</h3>
                                <p className="text-sm text-gray-600 mt-1">Tizimga yangi foydalanuvchi qo'shish</p>
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
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
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
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
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
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                        placeholder="+998 90 123 45 67"
                                    />
                                </div>
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            {/* Login */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Login <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="login"
                                        required
                                        value={formData.login}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${errors.login ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                        placeholder="Noyob login"
                                    />
                                </div>
                                {errors.login && <p className="mt-1 text-sm text-red-600">{errors.login}</p>}
                            </div>

                            {/* Parol */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Parol <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                        placeholder="Kamida 6 ta belgi"
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            {/* Rol */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rol <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                                    Yaratilmoqda...
                                </>
                            ) : (
                                "Foydalanuvchi yaratish"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateUserModal
