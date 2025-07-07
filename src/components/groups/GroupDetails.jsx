"use client"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import {
    ArrowLeft,
    User,
    BookOpen,
    MapPin,
    Calendar,
    GraduationCap,
    UserPlus,
    Plus,
    Edit3,
    Users,
    Clock,
    CheckCircle,
    X,
    Search,
    Mail,
    Phone,
    CalendarDays,
    Target,
    TrendingUp,
} from "lucide-react"
import groupService from "../../service/groupService"
import scheduleService from "../../service/scheduleService"

const GroupDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { showNotification } = useNotification()

    const [group, setGroup] = useState(null)
    const [schedules, setSchedules] = useState([])
    const [mentors, setMentors] = useState([])
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [showMentorModal, setShowMentorModal] = useState(false)
    const [showStudentModal, setShowStudentModal] = useState(false)
    const [showClassroomModal, setShowClassroomModal] = useState(false)
    const [showScheduleModal, setShowScheduleModal] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        fetchGroupDetails()
    }, [id])

    const fetchGroupDetails = async () => {
        try {
            setLoading(true)
            const [groupResponse, schedulesResponse, mentorsResponse, studentsResponse] = await Promise.all([
                groupService.getGroup(id),
                scheduleService.getSchedules(),
                groupService.getMentors(),
                groupService.getStudents(),
            ])

            if (groupResponse.success) {
                setGroup(groupResponse.group)
            }
            if (schedulesResponse.success) {
                setSchedules(schedulesResponse.schedules)
            }
            if (mentorsResponse.success) {
                setMentors(mentorsResponse.users)
            }
            if (studentsResponse.success) {
                setStudents(studentsResponse.users)
            }
        } catch (error) {
            showNotification("Ma'lumotlarni yuklashda xato", "error")
            navigate("/dashboard/director/groups")
        } finally {
            setLoading(false)
        }
    }

    const handleAssignMentor = async (mentorId) => {
        try {
            const response = await groupService.updateGroup(id, { mentor: mentorId })
            if (response.success) {
                showNotification("Mentor muvaffaqiyatli biriktirildi", "success")
                setShowMentorModal(false)
                fetchGroupDetails()
            }
        } catch (error) {
            showNotification("Mentor biriktirishda xato", "error")
        }
    }

    const handleAssignStudents = async (studentIds) => {
        try {
            const response = await groupService.updateGroup(id, { students: studentIds })
            if (response.success) {
                showNotification("Talabalar muvaffaqiyatli biriktirildi", "success")
                setShowStudentModal(false)
                fetchGroupDetails()
            }
        } catch (error) {
            showNotification("Talabalarni biriktirishda xato", "error")
        }
    }

    const handleUpdateClassroom = async (classroom) => {
        try {
            const response = await groupService.updateGroup(id, { classroom })
            if (response.success) {
                showNotification("Xona muvaffaqiyatli yangilandi", "success")
                setShowClassroomModal(false)
                fetchGroupDetails()
            }
        } catch (error) {
            showNotification("Xonani yangilashda xato", "error")
        }
    }

    const getGroupStats = () => {
        if (!group) return { totalStudents: 0, activeStudents: 0, completionRate: 0, averageGrade: 0 }

        const totalStudents = group.students?.length || 0
        const activeStudents = group.students?.filter((s) => s.status === "active").length || 0
        const completionRate = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0
        const averageGrade = 85 // Mock data

        return { totalStudents, activeStudents, completionRate, averageGrade }
    }

    const getLevelColor = (level) => {
        const colors = {
            beginner: "bg-blue-50 text-blue-700 border-blue-200",
            elementary: "bg-emerald-50 text-emerald-700 border-emerald-200",
            intermediate: "bg-amber-50 text-amber-700 border-amber-200",
            "upper-intermediate": "bg-orange-50 text-orange-700 border-orange-200",
            advanced: "bg-purple-50 text-purple-700 border-purple-200",
        }
        return colors[level] || "bg-gray-50 text-gray-700 border-gray-200"
    }

    const getStatusColor = (status) => {
        return status === "active"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-amber-50 text-amber-700 border-amber-200"
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    if (!group) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Guruh topilmadi</h3>
                    <p className="text-gray-600 mb-4">Ushbu guruh mavjud emas yoki o'chirilgan</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Orqaga qaytish
                    </button>
                </div>
            </div>
        )
    }

    const canEdit = ["director", "manager"].includes(user?.role)
    const stats = getGroupStats()

    const tabs = [
        { id: "overview", label: "Umumiy", icon: BookOpen },
        { id: "students", label: "Talabalar", icon: GraduationCap },
        { id: "schedule", label: "Jadval", icon: Calendar },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div className="flex-1">
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <Users className="h-8 w-8 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <span className="text-gray-600">{group.code}</span>
                                        <span
                                            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getLevelColor(group.level)}`}
                                        >
                                            {group.level}
                                        </span>
                                        <span
                                            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(group.status)}`}
                                        >
                                            {group.status === "active" ? "Faol" : "Nofaol"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {canEdit && (
                            <button className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                                <Edit3 className="h-4 w-4 mr-2" />
                                Tahrirlash
                            </button>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            title="Jami Talabalar"
                            value={stats.totalStudents}
                            icon={Users}
                            color="blue"
                            description="Guruhga biriktirilgan"
                        />
                        <StatsCard
                            title="Faol Talabalar"
                            value={stats.activeStudents}
                            icon={CheckCircle}
                            color="green"
                            description="Hozirda o'qiyotgan"
                        />
                        <StatsCard
                            title="Tugatish foizi"
                            value={`${stats.completionRate}%`}
                            icon={Target}
                            color="purple"
                            description="O'rtacha ko'rsatkich"
                        />
                        <StatsCard
                            title="O'rtacha baho"
                            value={stats.averageGrade}
                            icon={TrendingUp}
                            color="orange"
                            description="Umumiy natija"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex px-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center py-4 px-1 mr-8 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? "border-gray-900 text-gray-900"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <tab.icon className="h-4 w-4 mr-2" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === "overview" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Group Information */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <BookOpen className="h-5 w-5 mr-2 text-gray-600" />
                                            Guruh Ma'lumotlari
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Fan</label>
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span>{group.subject}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Yaratilgan</label>
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <CalendarDays className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span>{new Date(group.createdAt).toLocaleDateString("uz-UZ")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mentor Section */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                                <User className="h-5 w-5 mr-2 text-gray-600" />
                                                Mentor
                                            </h2>
                                            {canEdit && !group.mentor && (
                                                <button
                                                    onClick={() => setShowMentorModal(true)}
                                                    className="flex items-center px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                                >
                                                    <UserPlus className="h-4 w-4 mr-1" />
                                                    Biriktirish
                                                </button>
                                            )}
                                        </div>
                                        {group.mentor ? (
                                            <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg">
                                                <div className="h-12 w-12 bg-emerald-50 rounded-full flex items-center justify-center">
                                                    <User className="h-6 w-6 text-emerald-600" />
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h3 className="font-medium text-gray-900">{group.mentor.name}</h3>
                                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                                        <Mail className="h-3 w-3 mr-1" />
                                                        <span>{group.mentor.email}</span>
                                                    </div>
                                                </div>
                                                {canEdit && (
                                                    <button
                                                        onClick={() => setShowMentorModal(true)}
                                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <User className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 text-sm">Mentor biriktirilmagan</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Classroom Section */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                                <MapPin className="h-5 w-5 mr-2 text-gray-600" />
                                                Xona
                                            </h2>
                                            {canEdit && (
                                                <button
                                                    onClick={() => setShowClassroomModal(true)}
                                                    className="flex items-center px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                                >
                                                    <Edit3 className="h-4 w-4 mr-1" />
                                                    {group.classroom ? "O'zgartirish" : "Biriktirish"}
                                                </button>
                                            )}
                                        </div>
                                        {group.classroom ? (
                                            <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg">
                                                <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                                                    <MapPin className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="font-medium text-gray-900">Xona {group.classroom}</h3>
                                                    <p className="text-sm text-gray-600">Dars xonasi</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <MapPin className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 text-sm">Xona biriktirilmagan</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Schedule Section */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                                <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                                                Jadval
                                            </h2>
                                            {canEdit && (
                                                <button
                                                    onClick={() => setShowScheduleModal(true)}
                                                    className="flex items-center px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                                >
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    {group.schedule ? "O'zgartirish" : "Biriktirish"}
                                                </button>
                                            )}
                                        </div>
                                        {group.schedule ? (
                                            <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
                                                        <Clock className="h-6 w-6 text-purple-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="font-medium text-gray-900">Dars jadvali</h3>
                                                        <p className="text-sm text-gray-600">{group.schedule}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Calendar className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 text-sm">Jadval biriktirilmagan</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "students" && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Talabalar ({group.students?.length || 0})</h2>
                                    {canEdit && (
                                        <button
                                            onClick={() => setShowStudentModal(true)}
                                            className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Talabalar biriktirish
                                        </button>
                                    )}
                                </div>

                                {group.students?.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {group.students.map((student) => (
                                            <StudentCard key={student._id} student={student} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <GraduationCap className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Talabalar yo'q</h3>
                                        <p className="text-gray-600 mb-4">Ushbu guruhga hali talabalar biriktirilmagan</p>
                                        {canEdit && (
                                            <button
                                                onClick={() => setShowStudentModal(true)}
                                                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                            >
                                                Birinchi talabani biriktiring
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "schedule" && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Dars Jadvali</h2>
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Jadval ma'lumotlari</h3>
                                    <p className="text-gray-600">Bu bo'lim keyinroq ishlab chiqiladi</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modals */}
                {showMentorModal && (
                    <MentorModal
                        mentors={mentors}
                        currentMentor={group.mentor?._id}
                        onClose={() => setShowMentorModal(false)}
                        onAssign={handleAssignMentor}
                    />
                )}
                {showStudentModal && (
                    <StudentModal
                        students={students}
                        currentStudents={group.students?.map((s) => s._id) || []}
                        onClose={() => setShowStudentModal(false)}
                        onAssign={handleAssignStudents}
                    />
                )}
                {showClassroomModal && (
                    <ClassroomModal
                        currentClassroom={group.classroom}
                        onClose={() => setShowClassroomModal(false)}
                        onUpdate={handleUpdateClassroom}
                    />
                )}
                {showScheduleModal && (
                    <ScheduleModal
                        schedules={schedules}
                        onClose={() => setShowScheduleModal(false)}
                        onAssign={(scheduleId) => {
                            const schedule = schedules.find((s) => s._id === scheduleId)
                            if (schedule) {
                                const scheduleText = Object.entries(schedule.weekdays)
                                    .filter(([_, dayData]) => dayData.enabled)
                                    .map(([day, dayData]) => {
                                        const dayNames = {
                                            monday: "Du",
                                            tuesday: "Se",
                                            wednesday: "Ch",
                                            thursday: "Pa",
                                            friday: "Ju",
                                            saturday: "Sh",
                                            sunday: "Ya",
                                        }
                                        return `${dayNames[day]} ${dayData.startTime}-${dayData.endTime}`
                                    })
                                    .join(", ")
                                groupService
                                    .updateGroup(id, { schedule: scheduleText })
                                    .then(() => {
                                        showNotification("Jadval muvaffaqiyatli biriktirildi", "success")
                                        setShowScheduleModal(false)
                                        fetchGroupDetails()
                                    })
                                    .catch(() => showNotification("Jadval biriktirishda xato", "error"))
                            }
                        }}
                    />
                )}
            </div>
        </div>
    )
}

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, description }) => {
    const colorClasses = {
        blue: "bg-blue-50 border-blue-200 text-blue-600",
        green: "bg-green-50 border-green-200 text-green-600",
        purple: "bg-purple-50 border-purple-200 text-purple-600",
        orange: "bg-orange-50 border-orange-200 text-orange-600",
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`${colorClasses[color]} p-2 rounded-lg border`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
                <p className="text-2xl font-semibold text-gray-900 mb-1">{value}</p>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
        </div>
    )
}

// Student Card Component
const StudentCard = ({ student }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{student.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        <span>{student.email}</span>
                    </div>
                    {student.phone && (
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            <span>{student.phone}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
                <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${student.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                >
                    {student.status === "active" ? "Faol" : "Nofaol"}
                </span>
            </div>
        </div>
    )
}

// Modal Components
const MentorModal = ({ mentors, currentMentor, onClose, onAssign }) => {
    const [selectedMentor, setSelectedMentor] = useState(currentMentor || "")
    const [searchTerm, setSearchTerm] = useState("")

    const filteredMentors = mentors.filter(
        (mentor) =>
            mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mentor.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>
                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Mentor tanlang</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Mentor qidirish..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {filteredMentors.map((mentor) => (
                                <label
                                    key={mentor._id}
                                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedMentor === mentor._id
                                        ? "border-gray-900 bg-gray-50 ring-2 ring-gray-900 ring-opacity-20"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="mentor"
                                        value={mentor._id}
                                        checked={selectedMentor === mentor._id}
                                        onChange={(e) => setSelectedMentor(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center mr-3">
                                        <User className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{mentor.name}</div>
                                        <div className="text-sm text-gray-600">{mentor.email}</div>
                                    </div>
                                    {selectedMentor === mentor._id && <CheckCircle className="h-5 w-5 text-gray-900 ml-2" />}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            onClick={() => selectedMentor && onAssign(selectedMentor)}
                            disabled={!selectedMentor}
                            className="w-full sm:w-auto px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Biriktirish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const StudentModal = ({ students, currentStudents, onClose, onAssign }) => {
    const [selectedStudents, setSelectedStudents] = useState(currentStudents)
    const [searchTerm, setSearchTerm] = useState("")

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleStudentChange = (studentId) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
        )
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>
                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Talabalar tanlang</h3>
                                <p className="text-sm text-gray-600 mt-1">{selectedStudents.length} ta talaba tanlangan</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Talaba qidirish..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {filteredStudents.map((student) => (
                                <label
                                    key={student._id}
                                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedStudents.includes(student._id)
                                        ? "border-gray-900 bg-gray-50 ring-2 ring-gray-900 ring-opacity-20"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.includes(student._id)}
                                        onChange={() => handleStudentChange(student._id)}
                                        className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded mr-3"
                                    />
                                    <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                                        <GraduationCap className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{student.name}</div>
                                        <div className="text-sm text-gray-600">{student.email}</div>
                                    </div>
                                    {selectedStudents.includes(student._id) && <CheckCircle className="h-5 w-5 text-gray-900 ml-2" />}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            onClick={() => onAssign(selectedStudents)}
                            className="w-full sm:w-auto px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Biriktirish ({selectedStudents.length})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ClassroomModal = ({ currentClassroom, onClose, onUpdate }) => {
    const [classroom, setClassroom] = useState(currentClassroom || "")

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>
                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Xona raqami</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={classroom}
                                onChange={(e) => setClassroom(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                placeholder="Xona raqamini kiriting (masalan: A-101)"
                            />
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            onClick={() => onUpdate(classroom)}
                            className="w-full sm:w-auto px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Saqlash
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ScheduleModal = ({ schedules, onClose, onAssign }) => {
    const [selectedSchedule, setSelectedSchedule] = useState("")

    const formatWeekdays = (weekdays) => {
        const dayNames = {
            monday: "Du",
            tuesday: "Se",
            wednesday: "Ch",
            thursday: "Pa",
            friday: "Ju",
            saturday: "Sh",
            sunday: "Ya",
        }
        return Object.entries(weekdays)
            .filter(([_, dayData]) => dayData.enabled)
            .map(([day, dayData]) => `${dayNames[day]} ${dayData.startTime}-${dayData.endTime}`)
            .join(", ")
    }

    const activeSchedules = schedules.filter((s) => s.status === "active")

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>
                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Jadval tanlang</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {activeSchedules.map((schedule) => (
                                <label
                                    key={schedule._id}
                                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${selectedSchedule === schedule._id
                                        ? "border-gray-900 bg-gray-50 ring-2 ring-gray-900 ring-opacity-20"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="schedule"
                                        value={schedule._id}
                                        checked={selectedSchedule === schedule._id}
                                        onChange={(e) => setSelectedSchedule(e.target.value)}
                                        className="mt-1 h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                                    />
                                    <div className="ml-3 flex-1">
                                        <div className="font-medium text-gray-900">{schedule.name}</div>
                                        <div className="text-sm text-gray-600 mt-1">{formatWeekdays(schedule.weekdays)}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(schedule.startDate).toLocaleDateString("uz-UZ")} -{" "}
                                            {new Date(schedule.endDate).toLocaleDateString("uz-UZ")}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            onClick={() => selectedSchedule && onAssign(selectedSchedule)}
                            disabled={!selectedSchedule}
                            className="w-full sm:w-auto px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Biriktirish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupDetails
