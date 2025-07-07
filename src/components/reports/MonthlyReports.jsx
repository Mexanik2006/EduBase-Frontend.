"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import { Plus, Search, BarChart3, Users, TrendingUp, Award, FileText } from "lucide-react"
import reportService from "../../service/reportService"
import groupService from "../../service/groupService"
import GenerateReportsModal from "./GenerateReportsModal"

const MonthlyReports = () => {
    const [reports, setReports] = useState([])
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedGroup, setSelectedGroup] = useState("all")
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [searchTerm, setSearchTerm] = useState("")
    const [showGenerateModal, setShowGenerateModal] = useState(false)

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

    // Ma'lumotlarni yuklash
    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const [reportsResponse, groupsResponse] = await Promise.all([
                reportService.getMonthlyReports({
                    groupId: selectedGroup !== "all" ? selectedGroup : undefined,
                    month: selectedMonth,
                    year: selectedYear,
                }),
                groupService.getGroups(),
            ])

            if (reportsResponse.success) {
                setReports(reportsResponse.reports)
            }
            if (groupsResponse.success) {
                setGroups(groupsResponse.groups)
            }
        } catch (error) {
            showNotification("Ma'lumotlarni yuklashda xato", "error")
        } finally {
            setLoading(false)
        }
    }, [selectedGroup, selectedMonth, selectedYear, showNotification])

    // Filterlangan hisobotlar
    const filteredReports = useMemo(() => {
        let filtered = reports

        // Search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(
                (report) =>
                    report.student?.name?.toLowerCase().includes(searchLower) ||
                    report.student?.email?.toLowerCase().includes(searchLower) ||
                    report.group?.name?.toLowerCase().includes(searchLower),
            )
        }

        return filtered.sort((a, b) => b.averageGrade - a.averageGrade)
    }, [reports, searchTerm])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Utility functions
    const getRecommendationColor = useCallback((recommendation) => {
        const colors = {
            excellent: "bg-green-100 text-green-800",
            good: "bg-blue-100 text-blue-800",
            satisfactory: "bg-yellow-100 text-yellow-800",
            needs_improvement: "bg-orange-100 text-orange-800",
            critical: "bg-red-100 text-red-800",
        }
        return colors[recommendation] || "bg-gray-100 text-gray-800"
    }, [])

    const getRecommendationLabel = useCallback((recommendation) => {
        const labels = {
            excellent: "A'lo",
            good: "Yaxshi",
            satisfactory: "Qoniqarli",
            needs_improvement: "Yaxshilash kerak",
            critical: "Jiddiy",
        }
        return labels[recommendation] || recommendation
    }, [])

    const getGradeColor = useCallback((grade) => {
        if (grade >= 90) return "text-green-600"
        if (grade >= 80) return "text-blue-600"
        if (grade >= 70) return "text-yellow-600"
        if (grade >= 60) return "text-orange-600"
        return "text-red-600"
    }, [])

    const getAttendanceColor = useCallback((percentage) => {
        if (percentage >= 95) return "text-green-600"
        if (percentage >= 85) return "text-blue-600"
        if (percentage >= 75) return "text-yellow-600"
        if (percentage >= 65) return "text-orange-600"
        return "text-red-600"
    }, [])

    // Permissions
    const canGenerateReports = useMemo(() => ["director", "manager"].includes(user?.role), [user?.role])

    // Statistika
    const stats = useMemo(() => {
        const total = reports.length
        const excellent = reports.filter((r) => r.recommendation === "excellent").length
        const good = reports.filter((r) => r.recommendation === "good").length
        const critical = reports.filter((r) => r.recommendation === "critical").length
        const averageGrade = total > 0 ? reports.reduce((sum, r) => sum + r.averageGrade, 0) / total : 0
        const averageAttendance = total > 0 ? reports.reduce((sum, r) => sum + r.attendancePercentage, 0) / total : 0

        return { total, excellent, good, critical, averageGrade, averageAttendance }
    }, [reports])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Oylik Hisobotlar</h1>
                    <p className="text-gray-600">Talabalar uchun oylik baho va davomat hisobotlari</p>
                </div>
                {canGenerateReports && (
                    <button
                        onClick={() => setShowGenerateModal(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Hisobotlar Yaratish
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Jami</p>
                            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Award className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">A'lo</p>
                            <p className="text-xl font-bold text-gray-900">{stats.excellent}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Yaxshi</p>
                            <p className="text-xl font-bold text-gray-900">{stats.good}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">O'rtacha baho</p>
                            <p className="text-xl font-bold text-gray-900">{stats.averageGrade.toFixed(1)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">O'rtacha davomat</p>
                            <p className="text-xl font-bold text-gray-900">{stats.averageAttendance.toFixed(1)}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Talaba qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Group filter */}
                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Barcha guruhlar</option>
                        {groups.map((group) => (
                            <option key={group._id} value={group._id}>
                                {group.name} ({group.code})
                            </option>
                        ))}
                    </select>
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

            {/* Reports Table */}
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
                                        Talaba
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Guruh
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        O'rtacha baho
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Davomat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Darslar
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tavsiya
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredReports.map((report) => (
                                    <tr key={report._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{report.student?.name}</div>
                                                    <div className="text-sm text-gray-500">{report.student?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{report.group?.name}</div>
                                            <div className="text-sm text-gray-500">{report.group?.code}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-lg font-bold ${getGradeColor(report.averageGrade)}`}>
                                                {report.averageGrade.toFixed(1)}
                                            </div>
                                            <div className="text-xs text-gray-500">{report.totalGrades} ta baho</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-lg font-bold ${getAttendanceColor(report.attendancePercentage)}`}>
                                                {report.attendancePercentage.toFixed(1)}%
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {report.presentCount}/{report.totalLessons} dars
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <div>Kelgan: {report.presentCount}</div>
                                                <div>Kelmagan: {report.absentCount}</div>
                                                <div>Kech: {report.lateCount}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRecommendationColor(report.recommendation)}`}
                                            >
                                                {getRecommendationLabel(report.recommendation)}
                                            </span>
                                            {report.recommendationText && (
                                                <div className="text-xs text-gray-500 mt-1">{report.recommendationText}</div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredReports.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Hisobotlar topilmadi</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {canGenerateReports
                                        ? "Hisobotlar yaratish uchun yuqoridagi tugmani bosing"
                                        : "Hozircha hisobotlar mavjud emas"}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Generate Reports Modal */}
            {showGenerateModal && (
                <GenerateReportsModal
                    isOpen={showGenerateModal}
                    groups={groups}
                    onClose={() => setShowGenerateModal(false)}
                    onSuccess={() => {
                        setShowGenerateModal(false)
                        fetchData()
                    }}
                />
            )}
        </div>
    )
}

export default MonthlyReports
