"use client"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import { ArrowLeft, Save, Calendar, Users, Award, BookOpen } from "lucide-react"
import lessonService from "../../service/lessonService"

const LessonDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { showNotification } = useNotification()

    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [attendance, setAttendance] = useState([])
    const [grades, setGrades] = useState([])
    const [topic, setTopic] = useState("")
    const [notes, setNotes] = useState("")

    useEffect(() => {
        if (id) {
            fetchLesson()
        }
    }, [id])

    const fetchLesson = async () => {
        try {
            setLoading(true)
            const response = await lessonService.getLesson(id)
            if (response.success) {
                const lessonData = response.lesson
                setLesson(lessonData)
                setTopic(lessonData.topic || "")
                setNotes(lessonData.notes || "")

                // Davomat ma'lumotlarini tayyorlash
                const attendanceData = lessonData.group.students.map((student) => {
                    const existing = lessonData.attendance.find((a) => a.student._id === student._id)
                    return {
                        student: student._id,
                        status: existing?.status || "present",
                        notes: existing?.notes || "",
                    }
                })
                setAttendance(attendanceData)

                // Baho ma'lumotlarini tayyorlash
                const gradesData = lessonData.group.students.map((student) => {
                    const existing = lessonData.grades.find((g) => g.student._id === student._id)
                    return {
                        student: student._id,
                        score: existing?.score || "",
                        type: existing?.type || "classwork",
                        notes: existing?.notes || "",
                    }
                })
                setGrades(gradesData)
            }
        } catch (error) {
            showNotification("Dars ma'lumotlarini yuklashda xato", "error")
            navigate(-1)
        } finally {
            setLoading(false)
        }
    }

    const handleAttendanceChange = (studentId, field, value) => {
        setAttendance((prev) => prev.map((item) => (item.student === studentId ? { ...item, [field]: value } : item)))
    }

    const handleGradeChange = (studentId, field, value) => {
        setGrades((prev) => prev.map((item) => (item.student === studentId ? { ...item, [field]: value } : item)))
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            const response = await lessonService.saveAttendanceAndGrades(id, {
                attendance,
                grades: grades.filter((g) => g.score !== ""), // Faqat baho berilganlarni saqlash
                topic,
                notes,
                status: "completed",
            })

            if (response.success) {
                showNotification("Ma'lumotlar saqlandi", "success")
                fetchLesson()
            }
        } catch (error) {
            showNotification("Saqlashda xato", "error")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!lesson) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">Dars topilmadi</h3>
            </div>
        )
    }

    const canEdit = ["director", "manager", "mentor"].includes(user?.role)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{lesson.topic || `${lesson.group.name} darsi`}</h1>
                        <p className="text-gray-600">
                            {new Date(lesson.date).toLocaleDateString("uz-UZ")} • {lesson.startTime} - {lesson.endTime}
                        </p>
                    </div>
                </div>
                {canEdit && (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save className="h-5 w-5 mr-2" />
                        {saving ? "Saqlanmoqda..." : "Saqlash"}
                    </button>
                )}
            </div>

            {/* Dars ma'lumotlari */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dars mavzusi</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                disabled={!canEdit}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                placeholder="Dars mavzusini kiriting"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Izohlar</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            disabled={!canEdit}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            placeholder="Dars haqida izohlar"
                        />
                    </div>
                </div>
            </div>

            {/* Bayram yoki Imtihon xabari */}
            {lesson.isHoliday && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="font-medium text-purple-900">Dam olish kuni: {lesson.holidayReason}</span>
                    </div>
                </div>
            )}

            {lesson.isExam && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <Award className="h-5 w-5 text-orange-600 mr-2" />
                        <span className="font-medium text-orange-900">Imtihon: {lesson.examType}</span>
                    </div>
                </div>
            )}

            {/* Talabalar jadvali */}
            {!lesson.isHoliday && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Talabalar ({lesson.group.students.length} ta)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Talaba
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Davomat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Baho
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Baho turi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Izoh
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {lesson.group.students.map((student, index) => {
                                    const attendanceItem = attendance.find((a) => a.student === student._id)
                                    const gradeItem = grades.find((g) => g.student === student._id)

                                    return (
                                        <tr key={student._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Users className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                        <div className="text-sm text-gray-500">{student.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={attendanceItem?.status || "present"}
                                                    onChange={(e) => handleAttendanceChange(student._id, "status", e.target.value)}
                                                    disabled={!canEdit}
                                                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                                >
                                                    <option value="present">Kelgan</option>
                                                    <option value="absent">Kelmagan</option>
                                                    <option value="late">Kech kelgan</option>
                                                    <option value="excused">Uzrli</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={gradeItem?.score || ""}
                                                    onChange={(e) => handleGradeChange(student._id, "score", e.target.value)}
                                                    disabled={!canEdit}
                                                    className="w-20 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                                    placeholder="0-100"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={gradeItem?.type || "classwork"}
                                                    onChange={(e) => handleGradeChange(student._id, "type", e.target.value)}
                                                    disabled={!canEdit}
                                                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                                >
                                                    <option value="classwork">Sinf ishi</option>
                                                    <option value="homework">Uy vazifasi</option>
                                                    <option value="exam">Imtihon</option>
                                                    <option value="participation">Faollik</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="text"
                                                    value={gradeItem?.notes || ""}
                                                    onChange={(e) => handleGradeChange(student._id, "notes", e.target.value)}
                                                    disabled={!canEdit}
                                                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                                    placeholder="Izoh..."
                                                />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LessonDetails
