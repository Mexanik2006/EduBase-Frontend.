"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import {
    Plus,
    Search,
    BookOpen,
    Archive,
    Trash2,
    Edit,
    RotateCcw,
    DollarSign,
    Filter,
    Download,
    Eye,
} from "lucide-react"
import CreateSubjectModal from "./CreateSubjectModal"
import EditSubjectModal from "./EditSubjectModal"
import subjectService from "../../service/subjectService"
import ConfirmationModal from "../common/ConfirmationModal"

const SubjectManagement = () => {
    const [subjects, setSubjects] = useState([])
    const [archivedSubjects, setArchivedSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [activeTab, setActiveTab] = useState("active")
    const [showFilters, setShowFilters] = useState(false)
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        archived: 0,
        totalRevenue: 0,
    })
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: "warning",
        title: "",
        message: "",
        onConfirm: null,
        loading: false,
    })

    const { user } = useAuth()
    const { showNotification } = useNotification()

    const calculateStats = useCallback((activeSubjects, archivedSubjects) => {
        return {
            total: activeSubjects.length,
            active: activeSubjects.filter((s) => s.status === "active").length,
            inactive: activeSubjects.filter((s) => s.status === "inactive").length,
            archived: archivedSubjects.length,
            totalRevenue: activeSubjects.reduce((acc, subject) => acc + (subject.price || 0), 0),
        }
    }, [])

    // Fanlarni yuklash
    const fetchSubjects = useCallback(async () => {
        try {
            setLoading(true)
            // Fetch both active and archived subjects in parallel
            const [activeResponse, archivedResponse] = await Promise.all([
                subjectService.getSubjects(),
                subjectService.getArchivedSubjects(),
            ])

            if (activeResponse.success) {
                setSubjects(activeResponse.subjects)
            }

            if (archivedResponse.success) {
                setArchivedSubjects(archivedResponse.subjects)
            }

            // Calculate stats immediately after fetching
            const newStats = calculateStats(
                activeResponse.success ? activeResponse.subjects : [],
                archivedResponse.success ? archivedResponse.subjects : [],
            )
            setStats(newStats)
        } catch (error) {
            showNotification("Fanlarni yuklashda xato", "error")
        } finally {
            setLoading(false)
        }
    }, [showNotification, calculateStats])

    // Filterlangan fanlar
    const filteredSubjects = useMemo(() => {
        const currentSubjects = activeTab === "active" ? subjects : archivedSubjects
        let filtered = currentSubjects

        // Search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(
                (subject) =>
                    subject.name?.toLowerCase().includes(searchLower) || subject.description?.toLowerCase().includes(searchLower),
            )
        }

        return filtered
    }, [subjects, archivedSubjects, activeTab, searchTerm])

    useEffect(() => {
        fetchSubjects()
    }, [fetchSubjects])

    // CRUD operatsiyalar
    const handleEdit = useCallback((subject) => {
        setSelectedSubject(subject)
        setShowEditModal(true)
    }, [])

    const handleArchive = useCallback(
        (subject) => {
            setConfirmModal({
                isOpen: true,
                type: "archive",
                title: "Fanni arxivga yuborish",
                message: `${subject.name} nomli fanni arxivga yuborishni tasdiqlaysizmi? Arxivlangan fanlar faol bo'lmaydi, lekin ma'lumotlari saqlanib qoladi.`,
                onConfirm: async () => {
                    setConfirmModal((prev) => ({ ...prev, loading: true }))
                    try {
                        const response = await subjectService.archiveSubject(subject._id)
                        if (response.success) {
                            showNotification(response.message, "success")
                            fetchSubjects()
                            setConfirmModal({
                                isOpen: false,
                                type: "warning",
                                title: "",
                                message: "",
                                onConfirm: null,
                                loading: false,
                            })
                        }
                    } catch (error) {
                        showNotification(error.response?.data?.message || "Xato yuz berdi", "error")
                    } finally {
                        setConfirmModal((prev) => ({ ...prev, loading: false }))
                    }
                },
            })
        },
        [showNotification, fetchSubjects],
    )

    const handleRestore = useCallback(
        (subject) => {
            setConfirmModal({
                isOpen: true,
                type: "restore",
                title: "Fanni qayta tiklash",
                message: `${subject.name} nomli fanni qayta tiklamoqchimisiz? Tiklangandan so'ng fan yana faol bo'ladi.`,
                onConfirm: async () => {
                    setConfirmModal((prev) => ({ ...prev, loading: true }))
                    try {
                        const response = await subjectService.restoreSubject(subject._id)
                        if (response.success) {
                            showNotification(response.message, "success")
                            fetchSubjects()
                            setConfirmModal({
                                isOpen: false,
                                type: "warning",
                                title: "",
                                message: "",
                                onConfirm: null,
                                loading: false,
                            })
                        }
                    } catch (error) {
                        showNotification(error.response?.data?.message || "Xato yuz berdi", "error")
                    } finally {
                        setConfirmModal((prev) => ({ ...prev, loading: false }))
                    }
                },
            })
        },
        [showNotification, fetchSubjects],
    )

    const handleDelete = useCallback(
        (subject) => {
            setConfirmModal({
                isOpen: true,
                type: "danger",
                title: "Fanni butunlay o'chirish",
                message: `${subject.name} nomli fanni butunlay o'chirishni tasdiqlaysizmi? Bu amal qaytarib bo'lmaydi va barcha ma'lumotlar yo'qoladi.`,
                onConfirm: async () => {
                    setConfirmModal((prev) => ({ ...prev, loading: true }))
                    try {
                        const response = await subjectService.deleteSubject(subject._id)
                        if (response.success) {
                            showNotification(response.message, "success")
                            fetchSubjects()
                            setConfirmModal({
                                isOpen: false,
                                type: "warning",
                                title: "",
                                message: "",
                                onConfirm: null,
                                loading: false,
                            })
                        }
                    } catch (error) {
                        showNotification(error.response?.data?.message || "Xato yuz berdi", "error")
                    } finally {
                        setConfirmModal((prev) => ({ ...prev, loading: false }))
                    }
                },
            })
        },
        [showNotification, fetchSubjects],
    )

    // Utility functions
    const getStatusColor = useCallback((status) => {
        const colors = {
            active: "bg-green-50 text-green-700 border-green-200",
            inactive: "bg-yellow-50 text-yellow-700 border-yellow-200",
            archived: "bg-red-50 text-red-700 border-red-200",
        }
        return colors[status] || "bg-gray-50 text-gray-700 border-gray-200"
    }, [])

    const getStatusLabel = useCallback((status) => {
        const labels = {
            active: "Faol",
            inactive: "Nofaol",
            archived: "Arxivlangan",
        }
        return labels[status] || status
    }, [])

    // Permissions
    const canCreateSubjects = useMemo(() => ["director", "manager"].includes(user?.role), [user?.role])
    const canEditSubjects = useMemo(() => ["director", "manager"].includes(user?.role), [user?.role])
    const canDeleteSubjects = useMemo(() => ["director"].includes(user?.role), [user?.role])

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Fanlar</h1>
                        <p className="text-gray-600 mt-1">Fanlarni boshqarish va nazorat qilish</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </button>
                        <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </button>
                        {canCreateSubjects && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Yangi Fan
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Jami Fanlar" value={stats.total} icon={BookOpen} color="blue" change="+12%" />
                <StatsCard title="Faol Fanlar" value={stats.active} icon={BookOpen} color="green" change="+8%" />
                <StatsCard
                    title="Jami Daromad"
                    value={`${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="purple"
                    change="+15%"
                />
                <StatsCard title="Arxivlangan" value={stats.archived} icon={Archive} color="orange" change="-2%" />
            </div>

            {/* Tabs */}
            <div className="bg-white border border-gray-200 rounded-xl">
                <div className="border-b border-gray-200">
                    <nav className="flex px-6">
                        <button
                            onClick={() => setActiveTab("active")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm mr-8 ${activeTab === "active"
                                ? "border-gray-900 text-gray-900"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Faol Fanlar ({stats.total})
                        </button>
                        {canEditSubjects && (
                            <button
                                onClick={() => setActiveTab("archived")}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "archived"
                                    ? "border-gray-900 text-gray-900"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                Arxivlangan Fanlar ({stats.archived})
                            </button>
                        )}
                    </nav>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Filterlar</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Qidirish</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Fan nomi, tavsif..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Subjects Content */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Fanlar ({filteredSubjects.length})</h2>
                        {searchTerm && <div className="text-sm text-gray-500">"{searchTerm}" bo'yicha qidiruv</div>}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Yuklanmoqda...</p>
                            </div>
                        </div>
                    ) : filteredSubjects.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? "Fan topilmadi" : activeTab === "active" ? "Hali fanlar yo'q" : "Arxivlangan fanlar yo'q"}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm
                                    ? "Qidiruv shartlaringizni o'zgartiring"
                                    : activeTab === "active"
                                        ? canCreateSubjects
                                            ? "Birinchi fanni yaratish uchun yuqoridagi tugmani bosing"
                                            : "Hozircha fanlar mavjud emas"
                                        : "Hali hech qanday fan arxivlanmagan"}
                            </p>
                            {canCreateSubjects && !searchTerm && activeTab === "active" && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Birinchi fanni yarating
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSubjects.map((subject) => (
                                <SubjectCard
                                    key={subject._id}
                                    subject={subject}
                                    onEdit={handleEdit}
                                    onArchive={() => handleArchive(subject)}
                                    onRestore={() => handleRestore(subject)}
                                    onDelete={() => handleDelete(subject)}
                                    getStatusColor={getStatusColor}
                                    getStatusLabel={getStatusLabel}
                                    canEditSubjects={canEditSubjects}
                                    canDeleteSubjects={canDeleteSubjects}
                                    activeTab={activeTab}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateSubjectModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false)
                        fetchSubjects()
                    }}
                />
            )}

            {showEditModal && selectedSubject && (
                <EditSubjectModal
                    isOpen={showEditModal}
                    subject={selectedSubject}
                    onClose={() => {
                        setShowEditModal(false)
                        setSelectedSubject(null)
                    }}
                    onSuccess={() => {
                        setShowEditModal(false)
                        setSelectedSubject(null)
                        fetchSubjects()
                    }}
                />
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() =>
                    setConfirmModal({ isOpen: false, type: "warning", title: "", message: "", onConfirm: null, loading: false })
                }
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                loading={confirmModal.loading}
                confirmText={
                    confirmModal.type === "archive"
                        ? "Arxivga yuborish"
                        : confirmModal.type === "restore"
                            ? "Qayta tiklash"
                            : "O'chirish"
                }
            />
        </div>
    )
}

// Helper Components
const StatsCard = ({ title, value, icon: Icon, color, change }) => {
    const colorClasses = {
        blue: "bg-blue-50 border-blue-200 text-blue-600",
        green: "bg-green-50 border-green-200 text-green-600",
        purple: "bg-purple-50 border-purple-200 text-purple-600",
        orange: "bg-orange-50 border-orange-200 text-orange-600",
    }

    const changeColor = change.startsWith("+") ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`${colorClasses[color]} p-2 rounded-lg border`}>
                    <Icon className="h-5 w-5" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${changeColor}`}>{change}</span>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    )
}

const SubjectCard = ({
    subject,
    onEdit,
    onArchive,
    onRestore,
    onDelete,
    getStatusColor,
    getStatusLabel,
    canEditSubjects,
    canDeleteSubjects,
    activeTab,
}) => {
    const [showActions, setShowActions] = useState(false)

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all duration-200 bg-white">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">{subject.name}</h3>
                        {subject.description && <p className="text-sm text-gray-600">{subject.description}</p>}
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowActions(!showActions)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>
                    {showActions && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="py-1">
                                <button
                                    onClick={() => setShowActions(false)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ko'rish
                                </button>
                                {canEditSubjects && activeTab === "active" && (
                                    <button
                                        onClick={() => {
                                            onEdit(subject)
                                            setShowActions(false)
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Tahrirlash
                                    </button>
                                )}
                                {canEditSubjects && activeTab === "active" && (
                                    <button
                                        onClick={() => {
                                            onArchive()
                                            setShowActions(false)
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <Archive className="h-4 w-4 mr-2" />
                                        Arxivga yuborish
                                    </button>
                                )}
                                {canEditSubjects && activeTab === "archived" && (
                                    <button
                                        onClick={() => {
                                            onRestore()
                                            setShowActions(false)
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Qayta tiklash
                                    </button>
                                )}
                                {canDeleteSubjects && activeTab === "archived" && (
                                    <button
                                        onClick={() => {
                                            onDelete()
                                            setShowActions(false)
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Butunlay o'chirish
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Narx:</span>
                    <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{subject.price?.toLocaleString() || 0} so'm</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status:</span>
                    <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(subject.status)}`}
                    >
                        {getStatusLabel(subject.status)}
                    </span>
                </div>
            </div>
            <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
                Yaratilgan: {new Date(subject.createdAt).toLocaleDateString("uz-UZ")}
            </div>
        </div>
    )
}

export default SubjectManagement
