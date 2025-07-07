"use client"
import { useState, useEffect } from "react"
import { useNotification } from "../../context/NotificationContext"
import { X, Calendar, Users } from "lucide-react"
import lessonService from "../../service/lessonService"
import groupService from "../../service/groupService"

const GenerateLessonsModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        groupId: "",
        startDate: "",
        endDate: "",
    })
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingGroups, setLoadingGroups] = useState(true)
    const { showNotification } = useNotification()

    useEffect(() => {
        if (isOpen) {
            fetchGroups()
        }
    }, [isOpen])

    const fetchGroups = async () => {
        try {
            setLoadingGroups(true)
            const response = await groupService.getGroups()
            if (response.success) {
                setGroups(response.groups.filter((g) => g.status === "active"))
            }
        } catch (error) {
            showNotification("Guruhlarni yuklashda xato", "error")
        } finally {
            setLoadingGroups(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.groupId || !formData.startDate || !formData.endDate) {
            showNotification("Barcha maydonlarni to'ldiring", "error")
            return
        }

        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            showNotification("Tugash sanasi boshlanish sanasidan kech bo'lishi kerak", "error")
            return
        }

        try {
            setLoading(true)
            const response = await lessonService.generateLessons(formData)

            if (response.success) {
                showNotification(`${response.lessonsCount} ta dars yaratildi`, "success")
                onSuccess()
                onClose()
                setFormData({ groupId: "", startDate: "", endDate: "" })
            }
        } catch (error) {
            const message = error.response?.data?.message || "Darslarni yaratishda xato"
            showNotification(message, "error")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Darslar Yaratish</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Guruh <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                name="groupId"
                                value={formData.groupId}
                                onChange={handleChange}
                                required
                                disabled={loadingGroups}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Guruh tanlang</option>
                                {groups.map((group) => (
                                    <option key={group._id} value={group._id}>
                                        {group.name} ({group.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Boshlanish sanasi <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tugash sanasi <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-700">
                            Tanlangan guruhning jadvaliga asosan darslar yaratiladi. Bayram kunlari avtomatik belgilanadi.
                        </p>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading || loadingGroups}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Yaratilmoqda..." : "Yaratish"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default GenerateLessonsModal
