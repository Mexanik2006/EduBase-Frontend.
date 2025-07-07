"use client"
import { useState } from "react"
import { useNotification } from "../../context/NotificationContext"
import { X, Award, Users } from "lucide-react"
import lessonService from "../../service/lessonService"

const GradeModal = ({ isOpen, lesson, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        studentId: "",
        type: "classwork",
        score: "",
        maxScore: "100",
        notes: "",
    })
    const [loading, setLoading] = useState(false)
    const { showNotification } = useNotification()

    const gradeTypes = [
        { value: "homework", label: "Uy vazifasi" },
        { value: "classwork", label: "Sinf ishi" },
        { value: "quiz", label: "Test" },
        { value: "exam", label: "Imtihon" },
        { value: "participation", label: "Faollik" },
    ]

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await lessonService.giveGrade(lesson._id, {
                studentId: formData.studentId,
                type: formData.type,
                score: Number.parseFloat(formData.score),
                maxScore: Number.parseFloat(formData.maxScore),
                notes: formData.notes,
            })
            if (response.success) {
                showNotification(response.message, "success")
                onSuccess()
                // Reset form
                setFormData({
                    studentId: "",
                    type: "classwork",
                    score: "",
                    maxScore: "100",
                    notes: "",
                })
            }
        } catch (error) {
            const message = error.response?.data?.message || "Baho qo'yishda xato"
            showNotification(message, "error")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Baho qo'yish</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <Award className="h-5 w-5 text-green-600 mr-2" />
                                <span className="font-medium text-gray-900">{lesson.topic || `${lesson.group?.name} darsi`}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                {new Date(lesson.date).toLocaleDateString("uz-UZ")} • {lesson.startTime} - {lesson.endTime}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Talaba tanlash */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Talaba <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <select
                                        name="studentId"
                                        required
                                        value={formData.studentId}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Talaba tanlang</option>
                                        {lesson.group?.students?.map((student) => (
                                            <option key={student._id} value={student._id}>
                                                {student.name} - {student.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Baho turi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Baho turi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="type"
                                    required
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {gradeTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Ball */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ball <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="score"
                                        required
                                        min="0"
                                        max={formData.maxScore}
                                        step="0.1"
                                        value={formData.score}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0"
                                    />
                                </div>

                                {/* Maksimal ball */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maksimal ball <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="maxScore"
                                        required
                                        min="1"
                                        step="0.1"
                                        value={formData.maxScore}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Izoh */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Izoh</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Qo'shimcha izohlar..."
                                />
                            </div>
                        </form>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading || !formData.studentId || !formData.score}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                            {loading ? "Saqlanmoqda..." : "Baho qo'yish"}
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

export default GradeModal
