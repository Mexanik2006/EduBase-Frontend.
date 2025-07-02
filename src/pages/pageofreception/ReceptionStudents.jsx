"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useAuth } from "../../context/AuthContext"
import { Plus, Search, Users, GraduationCap, UserCheck, UserX, Send } from "lucide-react"
import axios from "axios"
import { useNotification } from "../../context/NotificationContext"

// Create Student Modal Component
const CreateStudentModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        login: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { showNotification } = useNotification()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await axios.post("/api/users", {
                ...formData,
                role: "student",
            })

            if (response.data.success) {
                showNotification("Talaba muvaffaqiyatli yaratildi", "success")
                onSuccess()
                setFormData({
                    name: "",
                    phone: "",
                    email: "",
                    login: "",
                    password: "",
                })
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Xato yuz berdi"
            setError(errorMessage)
            showNotification(errorMessage, "error")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-bold mb-4">Yangi Talaba Yaratish</h2>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To'liq ism</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Talaba ismini kiriting"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqam</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="+998901234567"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="student@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Login</label>
                        <input
                            type="text"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="student_login"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Kamida 6 ta belgi"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            disabled={loading}
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Yaratilmoqda...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Yaratish
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function ReceptionStudents() {
    const [students, setStudents] = useState([])
    const [archivedStudents, setArchivedStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [activeTab, setActiveTab] = useState("active") // "active" or "archived"
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        archived: 0,
    })

    const { user, showNotification } = useAuth()

    // Fetch active students
    const fetchStudents = useCallback(async () => {
        try {
            setLoading(true)

            const response = await axios.get("/api/users?role=student")

            if (response.data.success) {
                setStudents(response.data.users)

                // Calculate stats
                const total = response.data.users.length
                const active = response.data.users.filter((s) => s.status === "active").length
                const inactive = response.data.users.filter((s) => s.status === "inactive").length

                setStats((prev) => ({ ...prev, total, active, inactive }))
            }
        } catch (error) {
            showNotification("Talabalarni yuklashda xato", "error")
        } finally {
            setLoading(false)
        }
    }, [showNotification])

    // Fetch archived students
    const fetchArchivedStudents = useCallback(async () => {
        try {
            const response = await axios.get("/api/users?role=student&status=archived")

            if (response.data.success) {
                setArchivedStudents(response.data.users)
                const archived = response.data.users.length
                setStats((prev) => ({ ...prev, archived }))
            }
        } catch (error) {
            showNotification("Arxivlangan talabalarni yuklashda xato", "error")
        }
    }, [showNotification])

    // Filter students based on search
    const handleSearch = useCallback((searchValue) => {
        setSearchTerm(searchValue)
    }, [])

    // Get current students list based on active tab
    const currentStudents = activeTab === "active" ? students : archivedStudents

    // Filtered students with search
    const searchedStudents = useMemo(() => {
        if (!searchTerm) return currentStudents

        return currentStudents.filter(
            (student) =>
                student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.login?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.phone?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    }, [currentStudents, searchTerm])

    // Send activation code
    const handleSendActivationCode = async (studentEmail, studentName) => {
        try {
            const response = await axios.post("/api/users/send-activation", {
                email: studentEmail,
            })

            if (response.data.success) {
                showNotification(`${studentName} ga aktivatsiya kodi yuborildi`, "success")
            }
        } catch (error) {
            showNotification(error.response?.data?.message || "Aktivatsiya kodi yuborishda xato", "error")
        }
    }

    // Get status color
    const getStatusColor = (status) => {
        const colors = {
            active: "bg-green-100 text-green-800",
            inactive: "bg-yellow-100 text-yellow-800",
            archived: "bg-red-100 text-red-800",
        }
        return colors[status] || "bg-gray-100 text-gray-800"
    }

    // Get status label
    const getStatusLabel = (status) => {
        const labels = {
            active: "Faol",
            inactive: "Nofaol",
            archived: "Arxivlangan",
        }
        return labels[status] || status
    }

    useEffect(() => {
        fetchStudents()
        fetchArchivedStudents()
    }, [fetchStudents, fetchArchivedStudents])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Talabalar</h1>
                    <p className="text-gray-600">Talabalarni boshqarish va ro'yxatga olish</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Yangi Talaba
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Jami Talabalar</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <UserCheck className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Faol Talabalar</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <UserX className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Nofaol Talabalar</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Users className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Arxivlangan</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.archived}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        <button
                            onClick={() => setActiveTab("active")}
                            className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === "active"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Faol Talabalar ({stats.total})
                        </button>
                        <button
                            onClick={() => setActiveTab("archived")}
                            className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === "archived"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Arxivlangan Talabalar ({stats.archived})
                        </button>
                    </nav>
                </div>

                {/* Search */}
                <div className="p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Talaba qidirish (ism, email, login, telefon)..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Talaba
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Telefon
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Login
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Yaratilgan
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amallar
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {searchedStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <GraduationCap className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                    <div className="text-sm text-gray-500">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.login}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}
                                            >
                                                {getStatusLabel(student.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(student.createdAt).toLocaleDateString("uz-UZ")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                {activeTab === "active" && student.status === "inactive" && (
                                                    <button
                                                        onClick={() => handleSendActivationCode(student.email, student.name)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Aktivatsiya kodi yuborish"
                                                    >
                                                        <Send className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {searchedStudents.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    {searchTerm
                                        ? "Talaba topilmadi"
                                        : activeTab === "active"
                                            ? "Hali talabalar yo'q"
                                            : "Arxivlangan talabalar yo'q"}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm
                                        ? "Qidiruv shartlaringizni o'zgartiring"
                                        : activeTab === "active"
                                            ? "Birinchi talabani yaratish uchun yuqoridagi tugmani bosing"
                                            : "Hali hech qanday talaba arxivlanmagan"}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Student Modal */}
            <CreateStudentModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => {
                    setShowCreateModal(false)
                    fetchStudents()
                }}
            />
        </div>
    )
}

export default ReceptionStudents
