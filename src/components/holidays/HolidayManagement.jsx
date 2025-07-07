"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import { Plus, Search, Calendar, Trash2, AlertCircle } from "lucide-react"
import holidayService from "../../service/holidayService"
import CreateHolidayModal from "./CreateHolidayModal"

const HolidayManagement = () => {
    const [holidays, setHolidays] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [showCreateModal, setShowCreateModal] = useState(false)

    const { user } = useAuth()
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

    // Dam olish kunlarini yuklash
    const fetchHolidays = useCallback(async () => {
        try {
            setLoading(true)
            const response = await holidayService.getHolidays({
                month: selectedMonth,
                year: selectedYear,
            })
            if (response.success) {
                setHolidays(response.holidays)
            }
        } catch (error) {
            showNotification("Dam olish kunlarini yuklashda xato", "error")
        } finally {
            setLoading(false)
        }
    }, [selectedMonth, selectedYear, showNotification])

    // Filterlangan dam olish kunlari
    const filteredHolidays = useMemo(() => {
        let filtered = holidays

        // Search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(
                (holiday) =>
                    holiday.name?.toLowerCase().includes(searchLower) || holiday.description?.toLowerCase().includes(searchLower),
            )
        }

        return filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
    }, [holidays, searchTerm])

    useEffect(() => {
        fetchHolidays()
    }, [fetchHolidays])

    // Dam olish kunini o'chirish
    const handleDelete = useCallback(
        async (holidayId) => {
            if (window.confirm("Dam olish kunini o'chirishni tasdiqlaysizmi?")) {
                try {
                    const response = await holidayService.deleteHoliday(holidayId)
                    if (response.success) {
                        showNotification(response.message, "success")
                        fetchHolidays()
                    }
                } catch (error) {
                    showNotification(error.response?.data?.message || "Xato yuz berdi", "error")
                }
            }
        },
        [showNotification, fetchHolidays],
    )

    // Utility functions
    const getTypeColor = useCallback((type) => {
        const colors = {
            national: "bg-red-100 text-red-800",
            religious: "bg-green-100 text-green-800",
            institutional: "bg-blue-100 text-blue-800",
        }
        return colors[type] || "bg-gray-100 text-gray-800"
    }, [])

    const getTypeLabel = useCallback((type) => {
        const labels = {
            national: "Milliy",
            religious: "Diniy",
            institutional: "Muassasa",
        }
        return labels[type] || type
    }, [])

    const formatDate = useCallback((date) => {
        return new Date(date).toLocaleDateString("uz-UZ", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }, [])

    // Permissions
    const canManageHolidays = useMemo(() => ["director", "manager"].includes(user?.role), [user?.role])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dam olish kunlari</h1>
                    <p className="text-gray-600">Dam olish kunlarini boshqarish va nazorat qilish</p>
                </div>
                {canManageHolidays && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Dam olish kuni qo'shish
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Jami dam olish kunlari</p>
                            <p className="text-2xl font-bold text-gray-900">{holidays.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Milliy bayramlar</p>
                            <p className="text-2xl font-bold text-gray-900">{holidays.filter((h) => h.type === "national").length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Muassasa bayramlari</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {holidays.filter((h) => h.type === "institutional").length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Dam olish kuni qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Month filter */}
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number.parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                    {/* Year filter */}
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number.parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Holidays Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dam olish kuni
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sana
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Turi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Yaratuvchi
                                    </th>
                                    {canManageHolidays && (
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amallar
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredHolidays.map((holiday) => (
                                    <tr key={holiday._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <Calendar className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{holiday.name}</div>
                                                    {holiday.description && <div className="text-sm text-gray-500">{holiday.description}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(holiday.date)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(holiday.type)}`}
                                            >
                                                {getTypeLabel(holiday.type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{holiday.createdBy?.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(holiday.createdAt).toLocaleDateString("uz-UZ")}
                                            </div>
                                        </td>
                                        {canManageHolidays && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDelete(holiday._id)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    title="O'chirish"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredHolidays.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Dam olish kunlari topilmadi</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {canManageHolidays
                                        ? "Birinchi dam olish kunini qo'shish uchun yuqoridagi tugmani bosing"
                                        : "Hozircha dam olish kunlari mavjud emas"}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Holiday Modal */}
            {showCreateModal && (
                <CreateHolidayModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false)
                        fetchHolidays()
                    }}
                />
            )}
        </div>
    )
}

export default HolidayManagement
