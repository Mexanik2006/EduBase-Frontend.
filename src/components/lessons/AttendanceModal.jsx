"use client"
import { useState, useEffect } from "react"
import { useNotification } from "../../context/NotificationContext"
import { X, UserCheck, Users } from "lucide-react"
import lessonService from "../../service/lessonService"

const AttendanceModal = ({ isOpen, lesson, onClose, onSuccess }) => {
    const [attendanceData, setAttendanceData] = useState([])
    const [loading, setLoading] = useState(false)
    const { showNotification } = useNotification()

    const attendanceStatuses = [
        { value: "present", label: "Kelgan", color: "bg-green-100 text-green-800" },
        { value: "absent", label: "Kelmagan", color: "bg-red-100 text-red-800" },
        { value: "late", label: "Kech kelgan", color: "bg-yellow-100 text-yellow-800" },
        { value: "excused", label: "Uzrli", color: "bg-blue-100 text-blue-800" },
    ]

    useEffect(() => {
        if (isOpen && lesson) {
            // Mavjud davomat ma'lumotlarini yuklash
            const existingAttendance = lesson.attendance || []
            const students = lesson.group?.students || []

            const initialData = students.map((student) => {
                const existing = existingAttendance.find((a) => a.student._id === student._id)
                return {
                    studentId: student._id,
                    studentName: student.name,
                    studentEmail: student.email,
                    status: existing?.status || "present",
                    notes: existing?.notes || "",
                }
            })

            setAttendanceData(initialData)
        }
    }, [isOpen, lesson])

    const handleStatusChange = (studentId, status) => {
        setAttendanceData((prev) => prev.map((item) => (item.studentId === studentId ? { ...item, status } : item)))
    }

    const handleNotesChange = (studentId, notes) => {
        setAttendanceData((prev) => prev.map((item) => (item.studentId === studentId ? { ...item, notes } : item)))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await lessonService.markAttendance(lesson._id, attendanceData)
            if (response.success) {
                showNotification(response.message, "success")
                onSuccess()
            }
        } catch (error) {
            const message = error.response?.data?.message || "Davomat qo'yishda xato"
            showNotification(message, "error")
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status) => {
        const statusObj = attendanceStatuses.find((s) => s.value === status)
        return statusObj?.color || "bg-gray-100 text-gray-800"
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Davomat qo'yish</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <UserCheck className="h-5 w-5 text-blue-600 mr-2" />
                                <span className="font-medium text-gray-900">{lesson.topic || `${lesson.group?.name} darsi`}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                {new Date(lesson.date).toLocaleDateString("uz-UZ")} • {lesson.startTime} - {lesson.endTime}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="max-h-96 overflow-y-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Talaba
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Izoh
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {attendanceData.map((item) => (
                                            <tr key={item.studentId}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <Users className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-medium text-gray-900">{item.studentName}</div>
                                                            <div className="text-xs text-gray-500">{item.studentEmail}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-2">
                                                        {attendanceStatuses.map((status) => (
                                                            <button
                                                                key={status.value}
                                                                type="button"
                                                                onClick={() => handleStatusChange(item.studentId, status.value)}
                                                                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${item.status === status.value
                                                                    ? status.color
                                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                                    }`}
                                                            >
                                                                {status.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="text"
                                                        value={item.notes}
                                                        onChange={(e) => handleNotesChange(item.studentId, e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Izoh..."
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </form>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                            {loading ? "Saqlanmoqda..." : "Saqlash"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Bekor qilish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttendanceModal
