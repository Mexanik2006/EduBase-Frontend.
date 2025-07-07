"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import {
    Plus,
    Search,
    Users,
    Archive,
    Trash2,
    Edit,
    RotateCcw,
    GraduationCap,
    User,
    MapPin,
    Eye,
    Filter,
    Download,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import CreateGroupModal from "./CreateGroupModal"
import EditGroupModal from "./EditGroupModal"
import groupService from "../../service/groupService"
import ConfirmationModal from "../common/ConfirmationModal"

const GroupManagement = () => {
    const [groups, setGroups] = useState([])
    const [archivedGroups, setArchivedGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedLevel, setSelectedLevel] = useState("all")
    const [selectedSubject, setSelectedSubject] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [activeTab, setActiveTab] = useState("active")
    const [showFilters, setShowFilters] = useState(false)
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        archived: 0,
        totalStudents: 0,
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
    const navigate = useNavigate()

    const levels = [
        { value: "all", label: "Barcha levellar" },
        { value: "beginner", label: "Beginner" },
        { value: "elementary", label: "Elementary" },
        { value: "intermediate", label: "Intermediate" },
        { value: "upper-intermediate", label: "Upper-Intermediate" },
        { value: "advanced", label: "Advanced" },
    ]

    const subjects = [
        { value: "all", label: "Barcha fanlar" },
        { value: "English", label: "Ingliz tili" },
        { value: "Russian", label: "Rus tili" },
        { value: "Korean", label: "Koreys tili" },
        { value: "German", label: "Nemis tili" },
        { value: "Mathematics", label: "Matematika" },
        { value: "Programming", label: "Dasturlash" },
    ]

    // Guruhlarni yuklash
    const fetchGroups = useCallback(async () => {
        try {
            setLoading(true)
            if (activeTab === "active") {
                const response = await groupService.getGroups()
                if (response.success) {
                    // Mentor uchun faqat o'ziga biriktirilgan guruhlar
                    if (user?.role === "mentor") {
                        const mentorGroups = response.groups.filter((group) => group.mentor && group.mentor._id === user.id)
                        setGroups(mentorGroups)
                    } else {
                        setGroups(response.groups)
                    }
                }
            } else {
                const response = await groupService.getArchivedGroups()
                if (response.success) {
                    setArchivedGroups(response.groups)
                }
            }
        } catch (error) {
            showNotification("Guruhlarni yuklashda xato", "error")
        } finally {
            setLoading(false)
        }
    }, [activeTab, user, showNotification])

    // Statistikani yuklash
    const fetchStats = useCallback(async () => {
        try {
            const response = await groupService.getGroupStats()
            if (response.success) {
                setStats({
                    total: response.stats.reduce((acc, stat) => acc + stat.count, 0),
                    active: response.stats.reduce((acc, stat) => acc + stat.active, 0),
                    inactive: response.stats.reduce((acc, stat) => acc + stat.inactive, 0),
                    archived: response.archivedCount,
                    totalStudents: response.totalStudents,
                })
            }
        } catch (error) {
            console.error("Statistika yuklashda xato:", error)
        }
    }, [])

    // Filterlangan guruhlar
    const filteredGroups = useMemo(() => {
        const currentGroups = activeTab === "active" ? groups : archivedGroups
        let filtered = currentGroups

        // Level filter
        if (selectedLevel !== "all") {
            filtered = filtered.filter((group) => group.level === selectedLevel)
        }

        // Subject filter
        if (selectedSubject !== "all") {
            filtered = filtered.filter((group) => group.subject === selectedSubject)
        }

        // Search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(
                (group) =>
                    group.name?.toLowerCase().includes(searchLower) ||
                    group.code?.toLowerCase().includes(searchLower) ||
                    group.mentor?.name?.toLowerCase().includes(searchLower) ||
                    group.subject?.toLowerCase().includes(searchLower),
            )
        }

        return filtered
    }, [groups, archivedGroups, activeTab, selectedLevel, selectedSubject, searchTerm])

    useEffect(() => {
        fetchGroups()
        fetchStats()
    }, [fetchGroups, fetchStats])

    // CRUD operatsiyalar
    const handleView = useCallback(
        (group) => {
            console.log("Viewing group:", group)
            // Role asosida to'g'ri yo'lni aniqlash
            const basePath = `/dashboard/${user.role}/groups/${group._id}`
            navigate(basePath)
        },
        [navigate, user.role],
    )

    const handleEdit = useCallback((group) => {
        setSelectedGroup(group)
        setShowEditModal(true)
    }, [])

    const handleArchive = useCallback(
        (group) => {
            setConfirmModal({
                isOpen: true,
                type: "archive",
                title: "Guruhni arxivga yuborish",
                message: `${group.name} nomli guruhni arxivga yuborishni tasdiqlaysizmi? Arxivlangan guruhlar faol bo'lmaydi, lekin ma'lumotlari saqlanib qoladi.`,
                onConfirm: async () => {
                    setConfirmModal((prev) => ({ ...prev, loading: true }))
                    try {
                        const response = await groupService.archiveGroup(group._id)
                        if (response.success) {
                            showNotification(response.message, "success")
                            fetchGroups()
                            fetchStats()
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
        [showNotification, fetchGroups, fetchStats],
    )

    const handleRestore = useCallback(
        (group) => {
            setConfirmModal({
                isOpen: true,
                type: "restore",
                title: "Guruhni qayta tiklash",
                message: `${group.name} nomli guruhni qayta tiklamoqchimisiz? Tiklangandan so'ng guruh yana faol bo'ladi.`,
                onConfirm: async () => {
                    setConfirmModal((prev) => ({ ...prev, loading: true }))
                    try {
                        const response = await groupService.restoreGroup(group._id)
                        if (response.success) {
                            showNotification(response.message, "success")
                            fetchGroups()
                            fetchStats()
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
        [showNotification, fetchGroups, fetchStats],
    )

    const handleDelete = useCallback(
        (group) => {
            setConfirmModal({
                isOpen: true,
                type: "danger",
                title: "Guruhni butunlay o'chirish",
                message: `${group.name} nomli guruhni butunlay o'chirishni tasdiqlaysizmi? Bu amal qaytarib bo'lmaydi va barcha ma'lumotlar yo'qoladi.`,
                onConfirm: async () => {
                    setConfirmModal((prev) => ({ ...prev, loading: true }))
                    try {
                        const response = await groupService.deleteGroup(group._id)
                        if (response.success) {
                            showNotification(response.message, "success")
                            fetchGroups()
                            fetchStats()
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
        [showNotification, fetchGroups, fetchStats],
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

    const getLevelColor = useCallback((level) => {
        const colors = {
            beginner: "bg-blue-50 text-blue-700 border-blue-200",
            elementary: "bg-green-50 text-green-700 border-green-200",
            intermediate: "bg-yellow-50 text-yellow-700 border-yellow-200",
            "upper-intermediate": "bg-orange-50 text-orange-700 border-orange-200",
            advanced: "bg-purple-50 text-purple-700 border-purple-200",
        }
        return colors[level] || "bg-gray-50 text-gray-700 border-gray-200"
    }, [])

    // Permissions
    const canCreateGroups = useMemo(() => ["director", "manager"].includes(user?.role), [user?.role])
    const canEditGroups = useMemo(() => ["director", "manager"].includes(user?.role), [user?.role])
    const canDeleteGroups = useMemo(() => ["director"].includes(user?.role), [user?.role])

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Guruhlar</h1>
                        <p className="text-gray-600 mt-1">Guruhlarni boshqarish va nazorat qilish</p>
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
                        {canCreateGroups && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Yangi Guruh
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Jami Guruhlar" value={stats.total} icon={Users} color="blue" change="+12%" />
                <StatsCard title="Faol Guruhlar" value={stats.active} icon={Users} color="green" change="+8%" />
                <StatsCard
                    title="Jami Talabalar"
                    value={stats.totalStudents}
                    icon={GraduationCap}
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
                            Faol Guruhlar ({stats.total})
                        </button>
                        {(canEditGroups || user?.role === "reception" || user?.role === "accountant") && (
                            <button
                                onClick={() => setActiveTab("archived")}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "archived"
                                    ? "border-gray-900 text-gray-900"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                Arxivlangan Guruhlar ({stats.archived})
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
                                        placeholder="Guruh nomi, kod, mentor..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>
                            {/* Level filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                >
                                    {levels.map((level) => (
                                        <option key={level.value} value={level.value}>
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Subject filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fan</label>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                >
                                    {subjects.map((subject) => (
                                        <option key={subject.value} value={subject.value}>
                                            {subject.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Groups Content */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Guruhlar ({filteredGroups.length})</h2>
                        {searchTerm && <div className="text-sm text-gray-500">"{searchTerm}" bo'yicha qidiruv</div>}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Yuklanmoqda...</p>
                            </div>
                        </div>
                    ) : filteredGroups.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm
                                    ? "Guruh topilmadi"
                                    : activeTab === "active"
                                        ? "Hali guruhlar yo'q"
                                        : "Arxivlangan guruhlar yo'q"}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm
                                    ? "Qidiruv shartlaringizni o'zgartiring"
                                    : activeTab === "active"
                                        ? canCreateGroups
                                            ? "Birinchi guruhni yaratish uchun yuqoridagi tugmani bosing"
                                            : "Hozircha guruhlar mavjud emas"
                                        : "Hali hech qanday guruh arxivlanmagan"}
                            </p>
                            {canCreateGroups && !searchTerm && activeTab === "active" && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Birinchi guruhni yarating
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGroups.map((group) => (
                                <GroupCard
                                    key={group._id}
                                    group={group}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onArchive={() => handleArchive(group)}
                                    onRestore={() => handleRestore(group)}
                                    onDelete={() => handleDelete(group)}
                                    getStatusColor={getStatusColor}
                                    getStatusLabel={getStatusLabel}
                                    getLevelColor={getLevelColor}
                                    canEditGroups={canEditGroups}
                                    canDeleteGroups={canDeleteGroups}
                                    activeTab={activeTab}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateGroupModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false)
                        fetchGroups()
                        fetchStats()
                    }}
                />
            )}

            {showEditModal && selectedGroup && (
                <EditGroupModal
                    isOpen={showEditModal}
                    group={selectedGroup}
                    onClose={() => {
                        setShowEditModal(false)
                        setSelectedGroup(null)
                    }}
                    onSuccess={() => {
                        setShowEditModal(false)
                        setSelectedGroup(null)
                        fetchGroups()
                        fetchStats()
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

const GroupCard = ({
    group,
    onView,
    onEdit,
    onArchive,
    onRestore,
    onDelete,
    getStatusColor,
    getStatusLabel,
    getLevelColor,
    canEditGroups,
    canDeleteGroups,
    activeTab,
}) => {
    const [showActions, setShowActions] = useState(false)

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all duration-200 bg-white">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">{group.name}</h3>
                        <p className="text-sm text-gray-600">
                            {group.code} • {group.subject}
                        </p>
                        {group.classroom && (
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {group.classroom}
                            </div>
                        )}
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
                                    onClick={() => {
                                        onView(group)
                                        setShowActions(false)
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ko'rish
                                </button>
                                {canEditGroups && activeTab === "active" && (
                                    <button
                                        onClick={() => {
                                            onEdit(group)
                                            setShowActions(false)
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Tahrirlash
                                    </button>
                                )}
                                {canEditGroups && activeTab === "active" && (
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
                                {canEditGroups && activeTab === "archived" && (
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
                                {canDeleteGroups && activeTab === "archived" && (
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
                    <span className="text-xs text-gray-500">Mentor:</span>
                    <div className="flex items-center">
                        <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                            <User className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{group.mentor?.name || "Tayinlanmagan"}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Talabalar:</span>
                    <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{group.students?.length || 0} ta</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Level:</span>
                    <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getLevelColor(group.level)}`}
                    >
                        {group.level}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status:</span>
                    <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(group.status)}`}
                    >
                        {getStatusLabel(group.status)}
                    </span>
                </div>
            </div>
            <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
                Yaratilgan: {new Date(group.createdAt).toLocaleDateString("uz-UZ")}
            </div>
        </div>
    )
}

export default GroupManagement
