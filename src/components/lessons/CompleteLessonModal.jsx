"use client"
import { useState } from "react"
import { useNotification } from "../../context/NotificationContext"
import { X, CheckCircle, BookOpen, FileText } from "lucide-react"
import lessonService from "../../service/lessonService"

const CompleteLessonModal = ({ isOpen, lesson, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        topic: lesson?.topic || "",
        notes: lesson?.notes || "",
    })
    const [loading, setLoading] = useState(false)
    const { showNotification } = useNotification()

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
            const response = await lessonService.completeLesson(lesson._id, formData)
            if (response.success) {
                showNotification(response.message, "success")
                onSuccess()
            }
        } catch (error) {
            const message = error.response?.data?.message || "Darsni yakunlashda xato"
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
                            <h3 className="text-lg font-medium text-gray-900">Darsni yakunlash</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                                <span className="font-medium text-gray-900">{lesson?.topic || `${lesson?.group?.name} darsi`}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                {new Date(lesson?.date).toLocaleDateString("uz-UZ")} • {lesson?.startTime} - {lesson?.endTime}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Mavzu */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dars mavzusi</label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="topic"
                                        value={formData.topic}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Dars mavzusini kiriting"
                                    />
                                </div>
                            </div>

                            {/* Izohlar */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dars haqida izohlar</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Dars jarayoni, talabalar faolligi, qo'shimcha ma'lumotlar..."
                                    />
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800">
                                    <strong>Diqqat:</strong> Darsni yakunlagandan keyin davomat va baholarni o'zgartirib bo'lmaydi.
                                </p>
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
                            {loading ? "Yakunlanmoqda..." : "Darsni yakunlash"}
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

export default CompleteLessonModal
