"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import { BookOpen, Users, Calendar, Clock, ArrowRight, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import groupService from "../../service/groupService"

const LessonsPage = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { showNotification } = useNotification()

    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchGroups()
    }, [])

    const fetchGroups = async () => {
        try {
            setLoading(true)
            const response = await groupService.getGroups({ status: "active" })
            if (response.success) {
                // Faqat jadval biriktirilgan guruhlarni ko'rsatish
                const groupsWithSchedule = response.groups.filter((group) => group.schedule)
                setGroups(groupsWithSchedule)
            }
        } catch (error) {
            showNotification("Guruhlarni yuklashda xato", "error")
        } finally {
            setLoading(false)
        }
    }

    const handleGoToLesson = (group) => {
        if (!group.schedule) {
            showNotification("Bu guruhga jadval biriktirilmagan", "error")
            return
        }
        navigate(`/dashboard/lessons/${group._id}`)
    }

    const getScheduleStatus = (schedule) => {
        if (!schedule) return { status: "no-schedule", label: "Jadval yo'q", color: "text-gray-500" }

        const now = new Date()
        const startDate = new Date(schedule.startDate)
        const endDate = new Date(schedule.endDate)

        if (now < startDate) {
            return { status: "upcoming", label: "Boshlanmagan", color: "text-blue-600" }
        } else if (now > endDate) {
            return { status: "completed", label: "Tugagan", color: "text-gray-600" }
        } else {
            return { status: "active", label: "Faol", color: "text-green-600" }
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "active":
                return <CheckCircle className="h-4 w-4" />
            case "upcoming":
                return <Clock className="h-4 w-4" />
            case "completed":
                return <XCircle className="h-4 w-4" />
            default:
                return <AlertCircle className="h-4 w-4" />
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Darslar</h1>
                    <p className="text-gray-600">Guruhlar va ularning darslari</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Jami Guruhlar</p>
                            <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Faol Jadvallar</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {groups.filter((g) => getScheduleStatus(g.schedule).status === "active").length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Boshlanmagan</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {groups.filter((g) => getScheduleStatus(g.schedule).status === "upcoming").length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <XCircle className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tugagan</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {groups.filter((g) => getScheduleStatus(g.schedule).status === "completed").length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Groups List */}
            {groups.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Jadval biriktirilgan guruh yo'q</h3>
                    <p className="mt-1 text-sm text-gray-500">Darslarni boshlash uchun avval guruhlarga jadval biriktiring.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => navigate("/dashboard/groups")}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Guruhlarga o'tish
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Guruhlar ro'yxati</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {groups.map((group) => {
                            const scheduleStatus = getScheduleStatus(group.schedule)
                            return (
                                <div key={group._id} className="p-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <Users className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                                                <div className="flex items-center space-x-4 mt-1">
                                                    <span className="text-sm text-gray-500">Kod: {group.code}</span>
                                                    <span className="text-sm text-gray-500">Talabalar: {group.students?.length || 0} ta</span>
                                                    {group.mentor && <span className="text-sm text-gray-500">Mentor: {group.mentor.name}</span>}
                                                </div>
                                                {group.schedule && (
                                                    <div className="flex items-center space-x-4 mt-2">
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">{group.schedule.name}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <span className={`text-sm ${scheduleStatus.color}`}>
                                                                {getStatusIcon(scheduleStatus.status)}
                                                            </span>
                                                            <span className={`text-sm ${scheduleStatus.color}`}>{scheduleStatus.label}</span>
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(group.schedule.startDate).toLocaleDateString("uz-UZ")} -
                                                            {new Date(group.schedule.endDate).toLocaleDateString("uz-UZ")}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {scheduleStatus.status === "active" && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Darslar davom etmoqda
                                                </span>
                                            )}
                                            <button
                                                onClick={() => handleGoToLesson(group)}
                                                disabled={!group.schedule}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Darsga o'tish
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default LessonsPage
