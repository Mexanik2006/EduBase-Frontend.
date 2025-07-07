"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useNotification } from "../context/NotificationContext"
import { GraduationCap, Mail, Key, ArrowLeft } from "lucide-react"
import axios from "../service/authService"

const ActivationPage = () => {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const { showNotification } = useNotification()
    const navigate = useNavigate()
    const location = useLocation()

    useState(() => {
        const urlEmail = location.state?.email
        if (urlEmail) {
            setEmail(urlEmail)
            setStep(2)
        }
    }, [location.state])

    const handleSendCode = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post("/api/users/send-activation", { email })
            if (response.data.success) {
                showNotification(response.data.message, "success")
                setStep(2)
            }
        } catch (error) {
            const message = error.response?.data?.message || "Xato yuz berdi"
            showNotification(message, "error")
        } finally {
            setLoading(false)
        }
    }

    const handleActivate = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post("/api/users/activate", { email, code })
            if (response.data.success) {
                showNotification(response.data.message, "success")
                navigate("/login")
            }
        } catch (error) {
            const message = error.response?.data?.message || "Aktivatsiya xatosi"
            showNotification(message, "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                {/* Logo and Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-black rounded-lg flex items-center justify-center mb-6">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Hisobni faollashtirish</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        {step === 1 ? "Emailingizni kiriting" : "Emailga yuborilgan kodni kiriting"}
                    </p>
                </div>

                {/* Activation Form */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    {step === 1 ? (
                        <form onSubmit={handleSendCode} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                                    Email manzil
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Aktivatsiya kodi yuborish"
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleActivate} className="space-y-6">
                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-gray-900 mb-2">
                                    Aktivatsiya kodi
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Key className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        id="code"
                                        name="code"
                                        type="text"
                                        required
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-center text-lg tracking-widest transition-all duration-200"
                                        placeholder="123456"
                                        maxLength={6}
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Kod <span className="font-medium">{email}</span> manziliga yuborildi
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Hisobni faollashtirish"
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full flex items-center justify-center py-2 px-4 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Orqaga qaytish
                            </button>
                        </form>
                    )}

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Hisobingiz faolmi?{" "}
                            <button
                                onClick={() => navigate("/login")}
                                className="font-medium text-black hover:text-gray-700 transition-colors"
                            >
                                Kirish
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActivationPage
