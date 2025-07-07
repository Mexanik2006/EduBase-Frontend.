"use client"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import {
    ArrowLeft,
    Calendar,
    Save,
    Clock,
    Users,
    BookOpen,
    CheckCircle,
    XCircle,
    AlertCircle,
    User,
    GraduationCap,
    MapPin,
    CalendarDays,
    Trophy,
    Edit3,
    X,
} from "lucide-react"
import scheduleService from "../../service/scheduleService"
import groupService from "../../service/groupService"

const ScheduleDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { showNotification } = useNotification()

    const [schedule, setSchedule] = useState(null)
    const [group, setGroup] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState("lessons")

    useEffect(() => {
        fetchScheduleDetails()
    }, [id])

    const fetchScheduleDetails = async () => {
        try {
            setLoading(true)
            const [scheduleResponse, groupResponse] = await Promise.all([
                scheduleService.getSchedule(id),
                // Guruhni topish
                groupService
                    .getGroups()
                    .then((res) => res.groups.find((g) => g.schedule && g.schedule._id === id)),
            ])

            if (scheduleResponse.success) {
                setSchedule(scheduleResponse.schedule)
            }
            if (groupResponse) {
                setGroup(groupResponse)
            }
        } catch (error) {
            showNotification("Ma'lumotlarni yuklashda xato", "error")
            navigate("/dashboard/schedules")
        } finally {
            setLoading(false)
        }
    }

    const handleSaveLessonData = async (lessonId, data) => {
        try {
            setSaving(true)
            const response = await scheduleService.saveLessonData(id, lessonId, data)
            if (response.success) {
                showNotification("Ma'lumotlar saqlandi", "success")
                fetchScheduleDetails()
            }
        } catch (error) {
            showNotification("Saqlashda xato", "error")
        } finally {
            setSaving(false)
        }
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("uz-UZ", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatShortDate = (date) => {
        return new Date(date).toLocaleDateString("uz-UZ")
    }

    const getWeekdaySchedule = () => {
        if (!schedule?.weekdays) return []
        return Object.entries(schedule.weekdays)
            .filter(([_, dayData]) => dayData.enabled)
            .map(([day, dayData]) => ({
                day: getDayName(day),
                time: `${dayData.startTime} - ${dayData.endTime}`,
            }))
    }

    const getDayName = (day) => {
        const dayNames = {
            monday: "Dushanba",
            tuesday: "Seshanba",
            wednesday: "Chorshanba",
            thursday: "Payshanba",
            friday: "Juma",
            saturday: "Shanba",
            sunday: "Yakshanba",
        }
        return dayNames[day] || day
    }

    const getScheduleStats = () => {
        if (!schedule?.lessons) return { total: 0, completed: 0, upcoming: 0, holidays: 0 }

        const total = schedule.lessons.length
        const completed = schedule.lessons.filter((l) => l.status === "completed").length
        const holidays = schedule.lessons.filter((l) => l.status === "holiday").length
        const upcoming = total - completed - holidays

        return { total, completed, upcoming, holidays }
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

    if (!schedule) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Jadval topilmadi</h3>
                    <p className="text-gray-600 mb-4">Ushbu jadval mavjud emas yoki o'chirilgan</p>
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

    const stats = getScheduleStats()
    const weekdaySchedule = getWeekdaySchedule()

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{schedule.name}</h1>
                            <p className="text-gray-600 mt-1">{group ? `${group.name} (${group.code})` : "Guruh biriktirilmagan"}</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatsCard
                            title="Jami Darslar"
                            value={stats.total}
                            icon={BookOpen}
                            color="blue"
                            description="Umumiy darslar soni"
                        />
                        <StatsCard
                            title="Yakunlangan"
                            value={stats.completed}
                            icon={CheckCircle}
                            color="green"
                            description="O'tilgan darslar"
                        />
                        <StatsCard
                            title="Kutilayotgan"
                            value={stats.upcoming}
                            icon={Clock}
                            color="orange"
                            description="Kelgusi darslar"
                        />
                        <StatsCard
                            title="Bayramlar"
                            value={stats.holidays}
                            icon={CalendarDays}
                            color="purple"
                            description="Dam olish kunlari"
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Schedule Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Schedule Information */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                                Jadval Ma'lumotlari
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Muddat</label>
                                    <div className="flex items-center text-sm text-gray-900">
                                        <CalendarDays className="h-4 w-4 text-gray-400 mr-2" />
                                        <span>
                                            {formatShortDate(schedule.startDate)} - {formatShortDate(schedule.endDate)}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${schedule.status === "active"
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : "bg-amber-50 text-amber-700 border border-amber-200"
                                            }`}
                                    >
                                        {schedule.status === "active" ? "Faol" : "Nofaol"}
                                    </span>
                                </div>
                                {schedule.createdBy && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Yaratuvchi</label>
                                        <div className="flex items-center text-sm text-gray-900">
                                            <User className="h-4 w-4 text-gray-400 mr-2" />
                                            <span>{schedule.createdBy.name}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Weekly Schedule */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-gray-600" />
                                Haftalik Jadval
                            </h2>
                            <div className="space-y-3">
                                {weekdaySchedule.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-900">{item.day}</span>
                                        <span className="text-sm text-gray-600">{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Group Information */}
                        {group && (
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Users className="h-5 w-5 mr-2 text-gray-600" />
                                    Guruh Ma'lumotlari
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Guruh nomi</label>
                                        <div className="flex items-center text-sm text-gray-900">
                                            <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                                            <span>
                                                {group.name} ({group.code})
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Talabalar soni</label>
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Users className="h-4 w-4 text-gray-400 mr-2" />
                                            <span>{group.students?.length || 0} ta</span>
                                        </div>
                                    </div>
                                    {group.mentor && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mentor</label>
                                            <div className="flex items-center text-sm text-gray-900">
                                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                                <span>{group.mentor.name}</span>
                                            </div>
                                        </div>
                                    )}
                                    {group.classroom && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Xona</label>
                                            <div className="flex items-center text-sm text-gray-900">
                                                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                                <span>{group.classroom}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Holidays & Exams */}
                        {(schedule.holidays?.length > 0 || schedule.exams?.length > 0) && (
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Trophy className="h-5 w-5 mr-2 text-gray-600" />
                                    Maxsus Kunlar
                                </h2>
                                <div className="space-y-4">
                                    {schedule.holidays?.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Bayramlar</label>
                                            <div className="space-y-2">
                                                {schedule.holidays.map((holiday, index) => (
                                                    <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-purple-900">{holiday.name}</span>
                                                            <span className="text-xs text-purple-600">{formatShortDate(holiday.date)}</span>
                                                        </div>
                                                        {holiday.description && (
                                                            <p className="text-xs text-purple-700 mt-1">{holiday.description}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {schedule.exams?.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Imtihonlar</label>
                                            <div className="space-y-2">
                                                {schedule.exams.map((exam, index) => (
                                                    <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-orange-900">{exam.name}</span>
                                                            <span className="text-xs text-orange-600">{formatShortDate(exam.date)}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="text-xs text-orange-700 capitalize">{exam.type}</span>
                                                            <span className="text-xs text-orange-600">
                                                                {exam.startTime} - {exam.endTime}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Lessons */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            {/* Tabs */}
                            <div className="border-b border-gray-200">
                                <nav className="flex px-6">
                                    <button
                                        onClick={() => setActiveTab("lessons")}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm mr-8 transition-colors ${activeTab === "lessons"
                                            ? "border-gray-900 text-gray-900"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                            }`}
                                    >
                                        <BookOpen className="h-4 w-4 mr-2 inline" />
                                        Darslar va Davomat
                                    </button>
                                </nav>
                            </div>

                            {/* Lessons Content */}
                            <div className="p-6">
                                {group && group.students ? (
                                    <div className="space-y-4">
                                        {schedule.lessons.map((lesson) => (
                                            <LessonCard
                                                key={lesson._id}
                                                lesson={lesson}
                                                students={group.students}
                                                onSave={(data) => handleSaveLessonData(lesson._id, data)}
                                                saving={saving}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Guruh biriktirilmagan</h3>
                                        <p className="text-gray-600">Ushbu jadval uchun guruh tanlanmagan</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, description }) => {
    const colorClasses = {
        blue: "bg-blue-50 border-blue-200 text-blue-600",
        green: "bg-green-50 border-green-200 text-green-600",
        orange: "bg-orange-50 border-orange-200 text-orange-600",
        purple: "bg-purple-50 border-purple-200 text-purple-600",
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

// Lesson Card Component
const LessonCard = ({ lesson, students, onSave, saving }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [attendance, setAttendance] = useState({})
    const [grades, setGrades] = useState({})
    const [topic, setTopic] = useState(lesson.topic || "")
    const [notes, setNotes] = useState(lesson.notes || "")

    useEffect(() => {
        // Initialize attendance and grades
        const attendanceMap = {}
        const gradesMap = {}
        students.forEach((student) => {
            const existingAttendance = lesson.attendance?.find((a) => a.student._id === student._id)
            const existingGrade = lesson.grades?.find((g) => g.student._id === student._id)
            attendanceMap[student._id] = existingAttendance?.status || "present"
            gradesMap[student._id] = existingGrade?.score || ""
        })
        setAttendance(attendanceMap)
        setGrades(gradesMap)
    }, [lesson, students])

    const handleAttendanceChange = (studentId, status) => {
        setAttendance((prev) => ({ ...prev, [studentId]: status }))
    }

    const handleGradeChange = (studentId, score) => {
        setGrades((prev) => ({ ...prev, [studentId]: score }))
    }

    const handleSave = () => {
        const attendanceData = students.map((student) => ({
            student: student._id,
            status: attendance[student._id] || "present",
            notes: "",
        }))

        const gradesData = students
            .filter((student) => grades[student._id] && grades[student._id] !== "")
            .map((student) => ({
                student: student._id,
                score: Number(grades[student._id]),
                type: lesson.status === "exam" ? "exam" : "classwork",
                notes: "",
            }))

        onSave({
            attendance: attendanceData,
            grades: gradesData,
            topic,
            notes,
            status: "completed",
        })
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("uz-UZ", {
            weekday: "short",
            month: "short",
            day: "numeric",
        })
    }

    const getStatusColor = (status) => {
        const colors = {
            scheduled: "bg-blue-50 text-blue-700 border-blue-200",
            completed: "bg-green-50 text-green-700 border-green-200",
            holiday: "bg-purple-50 text-purple-700 border-purple-200",
            exam: "bg-orange-50 text-orange-700 border-orange-200",
        }
        return colors[status] || "bg-gray-50 text-gray-700 border-gray-200"
    }

    const getStatusLabel = (status) => {
        const labels = {
            scheduled: "Rejalashtirilgan",
            completed: "Yakunlangan",
            holiday: "Bayram",
            exam: "Imtihon",
        }
        return labels[status] || status
    }

    const getAttendanceIcon = (status) => {
        switch (status) {
            case "present":
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case "absent":
                return <XCircle className="h-4 w-4 text-red-600" />
            case "late":
                return <AlertCircle className="h-4 w-4 text-yellow-600" />
            case "excused":
                return <Clock className="h-4 w-4 text-blue-600" />
            default:
                return <CheckCircle className="h-4 w-4 text-green-600" />
        }
    }

    const getAttendanceColor = (status) => {
        switch (status) {
            case "present":
                return "bg-green-50 border-green-200 text-green-700"
            case "absent":
                return "bg-red-50 border-red-200 text-red-700"
            case "late":
                return "bg-yellow-50 border-yellow-200 text-yellow-700"
            case "excused":
                return "bg-blue-50 border-blue-200 text-blue-700"
            default:
                return "bg-green-50 border-green-200 text-green-700"
        }
    }

    // Holiday lesson card
    if (lesson.status === "holiday") {
        return (
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <CalendarDays className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-purple-900">{lesson.topic || "Bayram kuni"}</h3>
                            <p className="text-sm text-purple-700">
                                {formatDate(lesson.date)} • {lesson.startTime} - {lesson.endTime}
                            </p>
                        </div>
                    </div>
                    <span
                        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(lesson.status)}`}
                    >
                        {getStatusLabel(lesson.status)}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Lesson Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                                    placeholder="Dars mavzusi"
                                />
                                <Edit3 className="h-4 w-4 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600">
                                {formatDate(lesson.date)} • {lesson.startTime} - {lesson.endTime}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span
                            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(lesson.status)}`}
                        >
                            {getStatusLabel(lesson.status)}
                        </span>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {isExpanded ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="p-4">
                    {/* Notes */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Izohlar</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Dars haqida qo'shimcha ma'lumot..."
                        />
                    </div>

                    {/* Students Grid */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Talabalar davomat va baholari</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {students.map((student) => (
                                <div key={student._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <span className="font-medium text-gray-900">{student.name}</span>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Attendance */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Davomat</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { value: "present", label: "Kelgan", color: "green" },
                                                    { value: "absent", label: "Kelmagan", color: "red" },
                                                    { value: "late", label: "Kech", color: "yellow" },
                                                    { value: "excused", label: "Uzrli", color: "blue" },
                                                ].map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => handleAttendanceChange(student._id, option.value)}
                                                        className={`p-2 text-xs font-medium rounded-lg border transition-colors ${attendance[student._id] === option.value
                                                            ? getAttendanceColor(option.value)
                                                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-center space-x-1">
                                                            {attendance[student._id] === option.value && getAttendanceIcon(option.value)}
                                                            <span>{option.label}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Grade */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Baho</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={grades[student._id] || ""}
                                                onChange={(e) => handleGradeChange(student._id, e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="0-100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Saqlanmoqda...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Ma'lumotlarni saqlash
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ScheduleDetails
