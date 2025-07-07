"use client"
import { useState } from "react"
import { useNotification } from "../../context/NotificationContext"
import { X, FileText, Calendar, Users } from 'lucide-react'
import reportService from "../../service/reportService"

const GenerateReportsModal = ({ isOpen, groups, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        groupId: "all",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    })
    const [loading, setLoading] = useState(false)
    const { showNotification } = useNotification()

    const months = [
        { value: 1, label: "Yanvar" },
        { value: 2, label: "Fevral" },
        { value: 3, label: "Mart" },
        { value: 4, label: "Aprel" },
        { value: 5, label: "May" },
        { value: 6, label: "Iyun" },
        { value: 7, label: "Iyul" },
        { value: 8, label: "Avgust" },
        { value: 9, label: "Sentabr" },
        { value: 10, label: "Oktabr" },
        { value: 11, label: "Noyabr" },
        { value: 12, label: "Dekabr" },
    ]

    const years = Array.from({ length: 5 }, (_, i) => 2024 + i)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "month" || name === "year" ? Number.parseInt(value) : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await reportService.generateMonthlyReports({
                groupId: formData.groupId !== "all" ? formData.groupId : undefined,
                month: formData.month,
                year: formData.year,
            })
            if (response.success) {
                showNotification(response.message, "success")
                onSuccess()
            }
        } catch (error) {
            const message = error.response?.data?.message || "Hisobotlar yaratishda xato"
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
                            <h3 className="text-lg font-medium text-gray-900">Oylik Hisobotlar Yaratish</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center">
                                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                                <span className="font-medium text-blue-900">Hisobotlar yaratish</span>
                            </div>
                            <p className="text-sm text-blue-700 mt-1">
                                Tanlangan oy va guruh uchun barcha talabalar uchun oylik hisobotlar yaratiladi
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Guruh tanlash */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Guruh <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <select
                                        name="groupId"
                                        required
                                        value={formData.groupId}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">Barcha guruhlar</option>
                                        {groups.map((group) => (
                                            <option key={group._id} value={group._id}>
                                                {group.name} ({group.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Oy */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Oy <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <select
                                            name="month"
                                            required
                                            value={formData.month}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {months.map((month) => (
                                                <option key={month.value} value={month.value}>
                                                    {month.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Yil */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Yil <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="year"
                                        required
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {years.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800">
                                    <strong>Eslatma:</strong> Hisobotlar yaratish jarayoni biroz vaqt olishi mumkin. Jarayon tugaguncha
                                    kutib turing.
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
                            {loading ? "Yaratilmoqda..." : "Hisobotlar Yaratish"}
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

export default GenerateReportsModal
