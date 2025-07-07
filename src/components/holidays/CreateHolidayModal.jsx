"use client"
import { useState } from "react"
import { useNotification } from "../../context/NotificationContext"
import { X, Calendar, FileText } from "lucide-react"
import holidayService from "../../service/holidayService"

const CreateHolidayModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        type: "institutional",
        description: "",
    })
    const [loading, setLoading] = useState(false)
    const { showNotification } = useNotification()

    const types = [
        { value: "national", label: "Milliy bayram" },
        { value: "religious", label: "Diniy bayram" },
        { value: "institutional", label: "Muassasa bayrami" },
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
            const response = await holidayService.createHoliday(formData)
            if (response.success) {
                showNotification(response.message, "success")
                onSuccess()
                // Reset form
                setFormData({
                    name: "",
                    date: "",
                    type: "institutional",
                    description: "",
                })
            }
        } catch (error) {
            const message = error.response?.data?.message || "Dam olish kuni yaratishda xato"
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
                            <h3 className="text-lg font-medium text-gray-900">Dam olish kuni qo'shish</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Nomi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dam olish kuni nomi <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Masalan: Yangi yil bayrami"
                                    />
                                </div>
                            </div>

                            {/* Sana */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sana <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Turi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Turi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="type"
                                    required
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {types.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tavsif */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tavsif</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Dam olish kuni haqida qo'shimcha ma'lumot"
                                    />
                                </div>
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
                            {loading ? "Qo'shilmoqda..." : "Qo'shish"}
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

export default CreateHolidayModal
