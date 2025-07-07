"use client"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import { ArrowLeft, Calendar, Save, Users, BookOpen, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import groupService from "../../service/groupService"
import scheduleService from "../../service/scheduleService"

const GroupLessons = () => {
    const { groupId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { showNotification } = useNotification()

    const [group, setGroup] = useState(null)
    const [schedule, setSchedule] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchGroupAndSchedule()
    }, [groupId])

    const fetchGroupAndSchedule = async () => {
        try {
            setLoading(true)
            const groupResponse = await groupService.getGroup(groupId)

            if (groupResponse.success) {
                setGroup(groupResponse.group)

                if (groupResponse.group.schedule) {
                    const scheduleResponse = await scheduleService.getSchedule(groupResponse.group.schedule._id)
                    if (scheduleResponse.success) {
                        setSchedule(scheduleResponse.schedule)
                    }
                }
            }
        } catch (error) {
            showNotification("Ma'lumotlarni yuklashda xato", "error")
            navigate("/dashboard/lessons")
        } finally {
            setLoading(false)
        }
    }

    const handleSaveLessonData = async (lessonId, data) => {
        try {
            setSaving(true)
            const response = await scheduleService.saveLessonData(schedule._id, lessonId, data)
            if (response.success) {
                showNotification("Ma'lumotlar saqlandi", "success")
                fetchGroupAndSchedule()
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

    const getStatusColor = (status) => {
        const colors = {
            scheduled: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
            holiday: "bg-purple-100 text-purple-800",
            exam: "bg-orange-100 text-orange-800",
        }
        return colors[status] || "bg-gray-100 text-gray-800"
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

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-4 w-4" />
            case "scheduled":
                return <Clock className="h-4 w-4" />
            case "holiday":
                return <Calendar className="h-4 w-4" />
            case "exam":
                return <AlertCircle className="h-4 w-4" />
            default:
                return <XCircle className="h-4 w-4" />
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!group || !schedule) {
        return (
            <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Guruh yoki jadval topilmadi</h3>
                <p className="mt-1 text-sm text-gray-500">Bu guruhga jadval biriktirilmagan yoki guruh mavjud emas.</p>
                <div className="mt-6">
                    <button
                        onClick={() => navigate("/dashboard/lessons")}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Orqaga qaytish
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate("/dashboard/lessons")}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{group.name} - Darslar</h1>
                        <p className="text-gray-600">
                            {schedule.name} • {group.students?.length || 0} ta talaba
                        </p>
                    </div>
                </div>
            </div>

            {/* Group Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">Guruh kodi</p>
                            <p className="text-lg font-semibold text-gray-900">{group.code}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">Jadval muddati</p>
                            <p className="text-sm text-gray-900">
                                {new Date(schedule.startDate).toLocaleDateString("uz-UZ")} -
                                {new Date(schedule.endDate).toLocaleDateString("uz-UZ")}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">Jami darslar</p>
                            <p className="text-lg font-semibold text-gray-900">{schedule.lessons?.length || 0} ta</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lessons Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Darslar va Davomat</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sana</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaqt</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mavzu
                                </th>
                                {group.students?.map((student) => (
                                    <th
                                        key={student._id}
                                        className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {student.name}
                                    </th>
                                ))}
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amallar
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {schedule.lessons?.map((lesson) => (
                                <LessonRow
                                    key={lesson._id}
                                    lesson={lesson}
                                    students={group.students || []}
                                    onSave={(data) => handleSaveLessonData(lesson._id, data)}
                                    saving={saving}
                                    formatDate={formatDate}
                                    getStatusColor={getStatusColor}
                                    getStatusLabel={getStatusLabel}
                                    getStatusIcon={getStatusIcon}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

// Lesson Row Component
const LessonRow = ({ lesson, students, onSave, saving, formatDate, getStatusColor, getStatusLabel, getStatusIcon }) => {
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

    // Bayram yoki dam olish kuni bo'lsa, input ko'rsatmaslik
    if (lesson.status === "holiday") {
        return (
            <tr className="bg-purple-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(lesson.date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lesson.startTime} - {lesson.endTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lesson.status)}`}
                    >
                        {getStatusIcon(lesson.status)}
                        <span className="ml-1">{getStatusLabel(lesson.status)}</span>
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Bayram - {lesson.topic}</td>
                {students.map((student) => (
                    <td key={student._id} className="px-3 py-4 text-center">
                        <span className="text-purple-600 text-sm">Bayram</span>
                    </td>
                ))}
                <td className="px-6 py-4 text-center">
                    <span className="text-purple-600 text-sm">Dam olish</span>
                </td>
            </tr>
        )
    }

    return (
        <tr className={lesson.status === "completed" ? "bg-green-50" : ""}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(lesson.date)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lesson.startTime} - {lesson.endTime}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lesson.status)}`}
                >
                    {getStatusIcon(lesson.status)}
                    <span className="ml-1">{getStatusLabel(lesson.status)}</span>
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dars mavzusi"
                />
            </td>
            {students.map((student) => (
                <td key={student._id} className="px-3 py-4 text-center">
                    <div className="space-y-2">
                        {/* Davomat */}
                        <select
                            value={attendance[student._id] || "present"}
                            onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="present">Kelgan</option>
                            <option value="absent">Kelmagan</option>
                            <option value="late">Kech</option>
                            <option value="excused">Uzrli</option>
                        </select>
                        {/* Baho */}
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={grades[student._id] || ""}
                            onChange={(e) => handleGradeChange(student._id, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Baho"
                        />
                    </div>
                </td>
            ))}
            <td className="px-6 py-4 text-center">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                    ) : (
                        <Save className="h-4 w-4 mr-1" />
                    )}
                    Saqlash
                </button>
            </td>
        </tr>
    )
}

export default GroupLessons
