import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Eye, EyeOff, User, Lock, GraduationCap } from 'lucide-react'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(formData)
    if (result.needsActivation) {
      navigate("/activate", { state: { email: result.email } })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left Panel */}
        <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">EduBase</span>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Hisobingizga kiring
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Ta'lim boshqaruv tizimiga xush kelibsiz
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="login" className="block text-sm font-medium text-gray-900 mb-2">
                  Login yoki Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="login"
                    name="login"
                    type="text"
                    required
                    value={formData.login}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Login yoki email kiriting"
                  />
                </div>
              </div>

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
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Parolingizni kiriting"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Kirish"
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 space-y-4">
              <p className="text-center text-sm text-gray-600">
                Hisobingiz yo'qmi?{" "}
                <Link to="/register" className="font-medium text-gray-900 hover:text-gray-700 transition-colors">
                  Ro'yxatdan o'ting
                </Link>
              </p>
              <p className="text-center text-sm text-gray-600">
                Hisobingiz faollashtirilmaganmi?{" "}
                <Link to="/activate" className="font-medium text-gray-900 hover:text-gray-700 transition-colors">
                  Faollashtirish
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="hidden lg:block relative w-0 flex-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="h-full flex items-center justify-center p-12">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ta'lim boshqaruvini soddalashtiring
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  EduBase bilan talabalar, mentorlar va boshqaruv jarayonlarini bir joyda boshqaring.
                  Zamonaviy va qulay interfeys orqali ta'lim sifatini oshiring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
