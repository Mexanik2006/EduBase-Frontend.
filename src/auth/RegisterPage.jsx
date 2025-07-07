"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Eye, EyeOff, User, Mail, Phone, Lock, GraduationCap, UserCheck } from "lucide-react"

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        login: "",
        password: "",
        role: "student",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { register } = useAuth()

    const roles = [
        { value: "student", label: "Talaba" },
        { value: "mentor", label: "Mentor" },
        { value: "reception", label: "Qabulxona" },
        { value: "accountant", label: "Buxgalter" },
        { value: "manager", label: "Menejer" },
        { value: "director", label: "Direktor" },
    ]

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const result = await register(formData)
        if (result.success && result.needsActivation) {
            navigate("/activate", { state: { email: result.email } })
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left side - Background */}
            <div className="hidden lg:block lg:w-1/2 bg-gray-50">
                <div className="h-full flex items-center justify-center p-12">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <GraduationCap className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">EduBase jamoasiga qo'shiling</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Zamonaviy ta'lim boshqaruv tizimi bilan ishlashni boshlang. Bir necha daqiqada ro'yxatdan o'ting va barcha
                            imkoniyatlardan foydalaning.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo and Header */}
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-black rounded-lg flex items-center justify-center mb-6">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Hisob yaratish</h1>
                        <p className="mt-2 text-sm text-gray-600">EduBase da yangi hisob yarating</p>
                    </div>

                    {/* Register Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Name Input */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                                    To'liq ism
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                                        placeholder="To'liq ismingizni kiriting"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            {/* Phone Input */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                                    Telefon raqam
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                                        placeholder="+998 90 123 45 67"
                                    />
                                </div>
                            </div>

                            {/* Login Input */}
                            <div>
                                <label htmlFor="login" className="block text-sm font-medium text-gray-900 mb-2">
                                    Login
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserCheck className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        id="login"
                                        name="login"
                                        type="text"
                                        required
                                        value={formData.login}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                                        placeholder="Noyob login kiriting"
                                    />
                                </div>
                            </div>

                            {/* Role Select */}
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-900 mb-2">
                                    Rol
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                                >
                                    {roles.map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                                    Parol
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                                        placeholder="Kamida 6 ta belgi"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Ro'yxatdan o'tish"
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Hisobingiz bormi?{" "}
                            <Link to="/login" className="font-medium text-black hover:text-gray-700 transition-colors">
                                Kirish
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
