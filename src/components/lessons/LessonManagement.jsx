"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import {
    Search,
    Users,
    Calendar,
    BookOpen,
    Filter,
    Download,
    GraduationCap,
    User,
    MapPin,
    ExternalLink,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import groupService from "../../service/groupService"
import scheduleService from "../../service/scheduleService"

const LessonManagement = () => {
    const [groups, setGroups] = useState([])
    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedLevel, setSelectedLevel] = useState("all")
    const [selectedSubject, setSelectedSubject] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [stats, setStats] = useState({
        totalGroups: 0,
        activeGroups: 0,
        totalStudents: 0,
        scheduledGroups: 0,
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

    // Ma'lumotlarni yuklash
    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            console.log("Ma'lumotlarni yuklash boshlandi...")

            const [groupsResponse, schedulesResponse] = await Promise.all([
                groupService.getGroups(),
                scheduleService.getSchedules(),
            ])

            console.log("Groups response:", groupsResponse)
            console.log("Schedules response:", schedulesResponse)

            let allGroups = []
            let allSchedules = []

            if (groupsResponse.success) {
                allGroups = groupsResponse.groups || []
                // Mentor uchun faqat o'ziga biriktirilgan guruhlar
                if (user?.role === "mentor") {
                    allGroups = allGroups.filter((group) => group.mentor && group.mentor._id === user.id)
                }
                setGroups(allGroups)
                console.log("Guruhlar yuklandi:", allGroups.length)
            }

            if (schedulesResponse.success) {
                allSchedules = schedulesResponse.schedules || []
                setSchedules(allSchedules)
                console.log("Jadvallar yuklandi:", allSchedules.length)
            }

            // Jadval biriktirilgan guruhlarni aniqlash
            const groupsWithSchedules = allGroups.filter((group) =>
                allSchedules.some(
                    (schedule) => schedule.group && schedule.group._id === group._id && schedule.status === "active",
                ),
            )

            // Statistika hisoblash
            const newStats = {
                totalGroups: groupsWithSchedules.length,
                activeGroups: groupsWithSchedules.filter((g) => g.status === "active").length,
                totalStudents: groupsWithSchedules.reduce((acc, group) => acc + (group.students?.length || 0), 0),
                scheduledGroups: groupsWithSchedules.length,
            }

            setStats(newStats)
            console.log("Statistika:", newStats)
        } catch (error) {
            console.error("Ma'lumotlarni yuklashda xato:", error)
            showNotification("Ma'lumotlarni yuklashda xato: " + error.message, "error")
            setGroups([])
            setSchedules([])
            setStats({
                totalGroups: 0,
                activeGroups: 0,
                totalStudents: 0,
                scheduledGroups: 0,
            })
        } finally {
            setLoading(false)
        }
    }, [showNotification, user])

    // Jadval biriktirilgan guruhlar
    const groupsWithSchedules = useMemo(() => {
        return groups.filter((group) =>
            schedules.some((schedule) => schedule.group && schedule.group._id === group._id && schedule.status === "active"),
        )
    }, [groups, schedules])

    // Filterlangan guruhlar
    const filteredGroups = useMemo(() => {
        let filtered = groupsWithSchedules

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
    }, [groupsWithSchedules, selectedLevel, selectedSubject, searchTerm])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Darsga kirish
    const handleEnterLesson = useCallback(
        (group) => {
            console.log("Darsga kirish:", group)
            // Role asosida to'g'ri yo'lni aniqlash
            const basePath = `/dashboard/${user.role}/groups/${group._id}`
            navigate(basePath)
        },
        [navigate, user.role],
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

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Darslar</h1>
                        <p className="text-gray-600 mt-1">Jadval biriktirilgan guruhlar va darslar</p>
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
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Jami Guruhlar" value={stats.totalGroups} icon={Users} color="blue" change="+12%" />
                <StatsCard title="Faol Guruhlar" value={stats.activeGroups} icon={Users} color="green" change="+8%" />
                <StatsCard
                    title="Jami Talabalar"
                    value={stats.totalStudents}
                    icon={GraduationCap}
                    color="purple"
                    change="+15%"
                />
                <StatsCard
                    title="Jadval Biriktirilgan"
                    value={stats.scheduledGroups}
                    icon={Calendar}
                    color="orange"
                    change="+5%"
                />
            </div>

            {/* Main Content */}
            <div className="bg-white border border-gray-200 rounded-xl">
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
                        <h2 className="text-lg font-semibold text-gray-900">
                            Jadval Biriktirilgan Guruhlar ({filteredGroups.length})
                        </h2>
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
                                <BookOpen className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm || selectedLevel !== "all" || selectedSubject !== "all"
                                    ? "Guruh topilmadi"
                                    : "Jadval biriktirilgan guruhlar yo'q"}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm || selectedLevel !== "all" || selectedSubject !== "all"
                                    ? "Qidiruv shartlaringizni o'zgartiring"
                                    : "Hozircha jadval biriktirilgan guruhlar mavjud emas"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGroups.map((group) => (
                                <GroupLessonCard
                                    key={group._id}
                                    group={group}
                                    onEnterLesson={handleEnterLesson}
                                    getStatusColor={getStatusColor}
                                    getStatusLabel={getStatusLabel}
                                    getLevelColor={getLevelColor}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
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

const GroupLessonCard = ({ group, onEnterLesson, getStatusColor, getStatusLabel, getLevelColor }) => {
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
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onEnterLesson(group)}
                        className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        title="Darsga kirish"
                    >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Darsga kirish
                    </button>
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

            <div className="text-xs text-gray-500 border-t border-gray-100 pt-3 flex items-center justify-between">
                <span>Yaratilgan: {new Date(group.createdAt).toLocaleDateString("uz-UZ")}</span>
                <div className="flex items-center text-green-600">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Jadval biriktirilgan</span>
                </div>
            </div>
        </div>
    )
}

export default LessonManagement
