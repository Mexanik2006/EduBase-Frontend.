"use client"
import { useState, useEffect } from "react"
import { useNotification } from "../../context/NotificationContext"
import { X, Users, BookOpen, Award } from "lucide-react"
import groupService from "../../service/groupService"
import subjectService from "../../service/subjectService"

const CreateGroupModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        level: "beginner",
        subject: "",
    })
    const [loading, setLoading] = useState(false)
    const [subjects, setSubjects] = useState([])
    const [loadingData, setLoadingData] = useState(true)
    const [errors, setErrors] = useState({})
    const { showNotification } = useNotification()

    const levels = [
        { value: "beginner", label: "Beginner" },
        { value: "elementary", label: "Elementary" },
        { value: "intermediate", label: "Intermediate" },
        { value: "upper-intermediate", label: "Upper-Intermediate" },
        { value: "advanced", label: "Advanced" },
    ]

    useEffect(() => {
        if (isOpen) {
            fetchSubjects()
        }
    }, [isOpen])

    const fetchSubjects = async () => {
        try {
            setLoadingData(true)
            const subjectsResponse = await subjectService.getSubjects()
            if (subjectsResponse.success) {
                setSubjects(subjectsResponse.subjects.filter((s) => s.status === "active"))
            }
        } catch (error) {
            showNotification("Fanlarni yuklashda xato", "error")
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        try {
            const response = await groupService.createGroup(formData)
            if (response.success) {
                showNotification(response.message, "success")
                onSuccess()
                // Reset form
                setFormData({
                    name: "",
                    level: "beginner",
                    subject: "",
                })
                setErrors({})
            }
        } catch (error) {
            const message = error.response?.data?.message || "Guruh yaratishda xato"
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
                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    {/* Header */}
                    <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Yangi Guruh Yaratish</h3>
                                <p className="text-sm text-gray-600 mt-1">Yangi o'quv guruhini tizimga qo'shish</p>
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
                                {/* Guruh nomi */}
                                <div>
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

                                {/* Level */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Level <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <select
                                            name="level"
                                            required
                                            value={formData.level}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                        >
                                            {levels.map((level) => (
                                                <option key={level.value} value={level.value}>
                                                    {level.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

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
                                    Yaratilmoqda...
                                </>
                            ) : (
                                "Guruh yaratish"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateGroupModal
