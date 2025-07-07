"use client"
import { useState, useEffect } from "react"
import { useNotification } from "../../context/NotificationContext"
import { X, Users, User, BookOpen, MapPin, Award, Code, Calendar, CheckCircle2, AlertTriangle } from "lucide-react"
import groupService from "../../service/groupService"
import subjectService from "../../service/subjectService"

const EditGroupModal = ({ isOpen, group, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        mentor: "",
        students: [],
        schedule: "",
        classroom: "",
        level: "beginner",
        subject: "",
        status: "active",
    })
    const [loading, setLoading] = useState(false)
    const [mentors, setMentors] = useState([])
    const [students, setStudents] = useState([])
    const [subjects, setSubjects] = useState([])
    const [loadingData, setLoadingData] = useState(true)
    const [errors, setErrors] = useState({})
    const { showNotification } = useNotification()

    const levels = [
        { value: "beginner", label: "Beginner", description: "Boshlang'ich daraja" },
        { value: "elementary", label: "Elementary", description: "Elementar daraja" },
        { value: "intermediate", label: "Intermediate", description: "O'rta daraja" },
        { value: "upper-intermediate", label: "Upper-Intermediate", description: "Yuqori o'rta daraja" },
        { value: "advanced", label: "Advanced", description: "Ilg'or daraja" },
    ]

    const statuses = [
        { value: "active", label: "Faol", description: "Guruh faol holatda" },
        { value: "inactive", label: "Nofaol", description: "Vaqtincha to'xtatilgan" },
    ]

    const isInactiveGroup = group?.status === "inactive"

    useEffect(() => {
        if (isOpen && group) {
            setFormData({
                name: group.name || "",
                code: group.code || "",
                mentor: group.mentor?._id || "",
                students: group.students?.map((s) => s._id) || [],
                schedule: group.schedule || "",
                classroom: group.classroom || "",
                level: group.level || "beginner",
                subject: group.subject || "",
                status: group.status || "active",
            })
            fetchData()
        }
    }, [isOpen, group])

    const fetchData = async () => {
        try {
            setLoadingData(true)
            const [mentorsResponse, studentsResponse, subjectsResponse] = await Promise.all([
                groupService.getMentors(),
                groupService.getStudents(),
                subjectService.getSubjects(),
            ])
            if (mentorsResponse.success) {
                setMentors(mentorsResponse.users)
            }
            if (studentsResponse.success) {
                setStudents(studentsResponse.users)
            }
            if (subjectsResponse.success) {
                setSubjects(subjectsResponse.subjects.filter((s) => s.status === "active"))
            }
        } catch (error) {
            showNotification("Ma'lumotlarni yuklashda xato", "error")
        } finally {
            setLoadingData(false)
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Guruh nomi majburiy"
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Guruh nomi kamida 2 ta belgidan iborat bo'lishi kerak"
        }

        if (!formData.subject) {
            newErrors.subject = "Fan tanlash majburiy"
        }

        if (!formData.level) {
            newErrors.level = "Level tanlash majburiy"
        }

        if (!formData.status) {
            newErrors.status = "Status tanlash majburiy"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            })
        }
    }

    const handleStudentChange = (studentId) => {
        setFormData((prev) => ({
            ...prev,
            students: prev.students.includes(studentId)
                ? prev.students.filter((id) => id !== studentId)
                : [...prev.students, studentId],
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        try {
            const response = await groupService.updateGroup(group._id, formData)
            if (response.success) {
                showNotification(response.message, "success")
                onSuccess()
                setErrors({})
            }
        } catch (error) {
            const message = error.response?.data?.message || "Guruhni yangilashda xato"
            showNotification(message, "error")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal */}
                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    {/* Header */}
                    <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Guruhni Tahrirlash</h3>
                                <p className="text-sm text-gray-600 mt-1">{group?.name} ma'lumotlarini yangilash</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {loadingData ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Ma'lumotlar yuklanmoqda...</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-white px-6 py-6">
                            <div className="space-y-6">
                                {/* Warning for inactive group */}
                                {isInactiveGroup && (
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-amber-800">Nofaol guruh</h3>
                                                <div className="mt-1 text-sm text-amber-700">
                                                    <p>
                                                        Nofaol guruhlar uchun ba'zi ma'lumotlar cheklangan bo'lishi mumkin. Guruhni faollashtirish
                                                        uchun statusni o'zgartiring.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Guruh nomi */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Guruh nomi <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                                                    }`}
                                                placeholder="Guruh nomini kiriting"
                                            />
                                        </div>
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    {/* Guruh kodi */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Guruh kodi</label>
                                        <div className="relative">
                                            <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="code"
                                                value={formData.code}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                                placeholder="GR-001"
                                            />
                                        </div>
                                    </div>

                                    {/* Xona */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Xona</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="classroom"
                                                value={formData.classroom}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                                placeholder="A-101"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Subject and Mentor */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Fan */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fan <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <select
                                                name="subject"
                                                required
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ${errors.subject ? "border-red-300 bg-red-50" : "border-gray-300"
                                                    }`}
                                            >
                                                <option value="">Fan tanlang</option>
                                                {subjects.map((subject) => (
                                                    <option key={subject._id} value={subject.name}>
                                                        {subject.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                                    </div>

                                    {/* Mentor */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mentor</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <select
                                                name="mentor"
                                                value={formData.mentor}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                            >
                                                <option value="">Mentor tanlang</option>
                                                {mentors.map((mentor) => (
                                                    <option key={mentor._id} value={mentor._id}>
                                                        {mentor.name} - {mentor.email}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Jadval</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <textarea
                                            name="schedule"
                                            value={formData.schedule}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                            placeholder="Dushanba, Chorshanba, Juma 14:00-16:00"
                                        />
                                    </div>
                                </div>

                                {/* Level Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Level <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {levels.map((level) => (
                                            <label
                                                key={level.value}
                                                className={`relative flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 ${formData.level === level.value
                                                    ? "border-gray-900 bg-gray-50 ring-2 ring-gray-900 ring-opacity-20"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="level"
                                                    value={level.value}
                                                    checked={formData.level === level.value}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <Award className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <span className="font-medium text-gray-900">{level.label}</span>
                                                        <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                                                    </div>
                                                </div>
                                                {formData.level === level.value && (
                                                    <div className="absolute top-3 right-3 w-2 h-2 bg-gray-900 rounded-full"></div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level}</p>}
                                </div>

                                {/* Status Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {statuses.map((status) => (
                                            <label
                                                key={status.value}
                                                className={`relative flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 ${formData.status === status.value
                                                    ? "border-gray-900 bg-gray-50 ring-2 ring-gray-900 ring-opacity-20"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value={status.value}
                                                    checked={formData.status === status.value}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div
                                                            className={`w-3 h-3 rounded-full ${status.value === "active" ? "bg-emerald-500" : "bg-amber-500"
                                                                }`}
                                                        />
                                                    </div>
                                                    <div className="ml-3">
                                                        <span className="font-medium text-gray-900">{status.label}</span>
                                                        <p className="text-sm text-gray-600 mt-1">{status.description}</p>
                                                    </div>
                                                </div>
                                                {formData.status === status.value && (
                                                    <div className="absolute top-3 right-3 w-2 h-2 bg-gray-900 rounded-full"></div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                </div>

                                {/* Students */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-medium text-gray-700">Talabalar</label>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {formData.students.length} ta tanlangan
                                        </span>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50">
                                        {students.length === 0 ? (
                                            <div className="p-4 text-center">
                                                <p className="text-sm text-gray-500">Faol talabalar topilmadi</p>
                                            </div>
                                        ) : (
                                            <div className="p-3 space-y-2">
                                                {students.map((student) => (
                                                    <label
                                                        key={student._id}
                                                        className="flex items-center p-2 hover:bg-white rounded-lg cursor-pointer transition-colors"
                                                    >
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.students.includes(student._id)}
                                                                onChange={() => handleStudentChange(student._id)}
                                                                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                                                            />
                                                            {formData.students.includes(student._id) && (
                                                                <CheckCircle2 className="absolute -top-1 -right-1 h-3 w-3 text-emerald-600" />
                                                            )}
                                                        </div>
                                                        <div className="ml-3">
                                                            <span className="text-sm font-medium text-gray-900">{student.name}</span>
                                                            <p className="text-xs text-gray-500">{student.email}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading || loadingData}
                            className="w-full sm:w-auto px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Saqlanmoqda...
                                </>
                            ) : (
                                "O'zgarishlarni saqlash"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditGroupModal
