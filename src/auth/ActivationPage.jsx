"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useNotification } from "../context/NotificationContext"
import { GraduationCap, Mail, Key, ArrowLeft } from "lucide-react"
import axios from "axios"

const ActivationPage = () => {
    const [step, setStep] = useState(1) // 1: email, 2: code
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const { showNotification } = useNotification()
    const navigate = useNavigate()
    const location = useLocation()

    // URL dan email olish
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Logo va sarlavha */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
                        <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Hisobni faollashtirish</h2>
                    <p className="text-gray-600">{step === 1 ? "Emailingizni kiriting" : "Emailga yuborilgan kodni kiriting"}</p>
                </div>

                {/* Activation forma */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {step === 1 ? (
                        <form onSubmit={handleSendCode} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email manzil
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    "Aktivatsiya kodi yuborish"
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleActivate} className="space-y-6">
                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                                    Aktivatsiya kodi
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Key className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="code"
                                        name="code"
                                        type="text"
                                        required
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest"
                                        placeholder="123456"
                                        maxLength={6}
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Kod <strong>{email}</strong> manziliga yuborildi
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    "Hisobni faollashtirish"
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full flex items-center justify-center py-2 px-4 text-sm text-gray-600 hover:text-gray-800"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Orqaga qaytish
                            </button>
                        </form>
                    )}

                    {/* Login havolasi */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Hisobingiz faolmi?{" "}
                            <button
                                onClick={() => navigate("/login")}
                                className="font-medium text-primary-600 hover:text-primary-500 transition duration-200"
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
