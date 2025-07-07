"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import { Plus, Search, Calendar, Archive, Trash2, Edit, Clock, Filter, Download, Eye, RotateCcw } from 'lucide-react'
import CreateScheduleModal from "./CreateScheduleModal"
import EditScheduleModal from "./EditScheduleModal"
import scheduleService from "../../service/scheduleService"
import groupService from "../../service/groupService"
import ConfirmationModal from "../common/ConfirmationModal"

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([])
  const [archivedSchedules, setArchivedSchedules] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [activeTab, setActiveTab] = useState("active")
  const [showFilters, setShowFilters] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    archived: 0,
    todayLessons: 0,
  })
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "warning",
    title: "",
    message: "",
    onConfirm: null,
    loading: false,
  })

  const { user } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  // Calculate stats
  const calculateStats = useCallback((activeSchedules, archivedSchedules) => {
    const today = new Date()
    const weekdayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const todayWeekday = weekdayNames[today.getDay()]

    const todayLessonsCount = activeSchedules.filter(
      (s) => s.status === "active" && s.weekdays?.[todayWeekday]?.enabled,
    ).length

    return {
      total: activeSchedules.length,
      active: activeSchedules.filter((s) => s.status === "active").length,
      inactive: activeSchedules.filter((s) => s.status === "inactive").length,
      archived: archivedSchedules.length,
      todayLessons: todayLessonsCount,
    }
  }, [])

  // Jadvallar va guruhlarni yuklash
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      console.log("Ma'lumotlarni yuklash boshlandi...")

      // Faol va arxivlangan jadvallarni alohida yuklash
      const [activeResponse, archivedResponse, groupsResponse] = await Promise.all([
        scheduleService.getSchedules().catch(() => ({ success: false, schedules: [] })),
        scheduleService.getSchedules({ status: 'archived' }).catch(() => ({ success: false, schedules: [] })),
        groupService.getGroups().catch(() => ({ success: false, groups: [] })),
      ])

      console.log("Active schedules response:", activeResponse)
      console.log("Archived schedules response:", archivedResponse)
      console.log("Groups response:", groupsResponse)

      // Faol jadvallar
      if (activeResponse.success) {
        const activeSchedules = activeResponse.schedules?.filter(s => s.status !== 'archived') || []
        setSchedules(activeSchedules)
        console.log("Faol jadvallar yuklandi:", activeSchedules.length)
      } else {
        setSchedules([])
      }

      // Arxivlangan jadvallar
      if (archivedResponse.success) {
        const archivedSchedules = archivedResponse.schedules?.filter(s => s.status === 'archived') || []
        setArchivedSchedules(archivedSchedules)
        console.log("Arxivlangan jadvallar yuklandi:", archivedSchedules.length)
      } else {
        // Agar alohida API bo'lmasa, faol jadvallar ichidan arxivlanganlarni olish
        if (activeResponse.success) {
          const archivedFromActive = activeResponse.schedules?.filter(s => s.status === 'archived') || []
          setArchivedSchedules(archivedFromActive)
          console.log("Faol jadvallar ichidan arxivlanganlar:", archivedFromActive.length)
        } else {
          setArchivedSchedules([])
        }
      }

      // Guruhlar
      if (groupsResponse.success) {
        if (user?.role === "mentor") {
          const mentorGroups = groupsResponse.groups.filter((group) => group.mentor && group.mentor._id === user.id)
          setGroups(mentorGroups)
        } else {
          setGroups(groupsResponse.groups || [])
        }
      } else {
        setGroups([])
      }

      // Stats hisoblash
      const activeSchedules = schedules
      const newStats = calculateStats(activeSchedules, archivedSchedules)
      setStats(newStats)
      console.log("Statistika hisoblandi:", newStats)
    } catch (error) {
      console.error("Umumiy xato:", error)
      showNotification("Ma'lumotlarni yuklashda xato: " + error.message, "error")
      setSchedules([])
      setArchivedSchedules([])
      setGroups([])
      setStats({ total: 0, active: 0, inactive: 0, archived: 0, todayLessons: 0 })
    } finally {
      setLoading(false)
    }
  }, [showNotification, calculateStats, user])

  // Filterlangan jadvallar
  const filteredSchedules = useMemo(() => {
    const currentSchedules = activeTab === "active" ? schedules : archivedSchedules
    let filtered = currentSchedules

    // Group filter
    if (selectedGroup !== "all") {
      filtered = filtered.filter((schedule) => schedule.group?._id === selectedGroup)
    }

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(
        (schedule) =>
          schedule.name?.toLowerCase().includes(searchLower) ||
          schedule.group?.name?.toLowerCase().includes(searchLower) ||
          schedule.group?.code?.toLowerCase().includes(searchLower) ||
          schedule.classroom?.toLowerCase().includes(searchLower),
      )
    }

    return filtered
  }, [schedules, archivedSchedules, activeTab, selectedGroup, searchTerm])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // CRUD operatsiyalar
  const handleView = useCallback(
    (schedule) => {
      // Role asosida to'g'ri yo'lni aniqlash
      const basePath = `/dashboard/${user.role}/schedules/${schedule._id}`
      navigate(basePath)
    },
    [navigate, user.role],
  )

  const handleEdit = useCallback((schedule) => {
    setSelectedSchedule(schedule)
    setShowEditModal(true)
  }, [])

  const handleArchive = useCallback(
    (schedule) => {
      setConfirmModal({
        isOpen: true,
        type: "archive",
        title: "Jadvalni arxivga yuborish",
        message: `${schedule.name} nomli jadvalni arxivga yuborishni tasdiqlaysizmi? Arxivlangan jadvallar faol bo'lmaydi, lekin ma'lumotlari saqlanib qoladi.`,
        onConfirm: async () => {
          setConfirmModal((prev) => ({ ...prev, loading: true }))
          try {
            const response = await scheduleService.archiveSchedule(schedule._id)
            if (response.success) {
              showNotification(response.message, "success")
              fetchData() // fetchStats() ni olib tashlang
              setConfirmModal({
                isOpen: false,
                type: "warning",
                title: "",
                message: "",
                onConfirm: null,
                loading: false,
              })
            }
          } catch (error) {
            showNotification(error.response?.data?.message || "Xato yuz berdi", "error")
          } finally {
            setConfirmModal((prev) => ({ ...prev, loading: false }))
          }
        },
      })
    },
    [showNotification, fetchData],
  )

  const handleRestore = useCallback(
    (schedule) => {
      setConfirmModal({
        isOpen: true,
        type: "restore",
        title: "Jadvalni qayta tiklash",
        message: `${schedule.name} nomli jadvalni qayta tiklamoqchimisiz? Tiklangandan so'ng jadval yana faol bo'ladi.`,
        onConfirm: async () => {
          setConfirmModal((prev) => ({ ...prev, loading: true }))
          try {
            const response = await scheduleService.restoreSchedule(schedule._id)
            if (response.success) {
              showNotification(response.message, "success")
              fetchData() // fetchStats() ni olib tashlang
              setConfirmModal({
                isOpen: false,
                type: "warning",
                title: "",
                message: "",
                onConfirm: null,
                loading: false,
              })
            }
          } catch (error) {
            showNotification(error.response?.data?.message || "Xato yuz berdi", "error")
          } finally {
            setConfirmModal((prev) => ({ ...prev, loading: false }))
          }
        },
      })
    },
    [showNotification, fetchData],
  )

  const handleDelete = useCallback(
    (schedule) => {
      setConfirmModal({
        isOpen: true,
        type: "danger",
        title: "Jadvalni butunlay o'chirish",
        message: `${schedule.name} nomli jadvalni butunlay o'chirishni tasdiqlaysizmi? Bu amal qaytarib bo'lmaydi va barcha ma'lumotlar yo'qoladi.`,
        onConfirm: async () => {
          setConfirmModal((prev) => ({ ...prev, loading: true }))
          try {
            const response = await scheduleService.deleteSchedule(schedule._id)
            if (response.success) {
              showNotification(response.message, "success")
              fetchData() // fetchStats() ni olib tashlang
              setConfirmModal({
                isOpen: false,
                type: "warning",
                title: "",
                message: "",
                onConfirm: null,
                loading: false,
              })
            }
          } catch (error) {
            showNotification(error.response?.data?.message || "Xato yuz berdi", "error")
          } finally {
            setConfirmModal((prev) => ({ ...prev, loading: false }))
          }
        },
      })
    },
    [showNotification, fetchData],
  )

  // Utility functions
  const getStatusColor = useCallback((status) => {
    const colors = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      inactive: "bg-amber-50 text-amber-700 border-amber-200",
      archived: "bg-red-50 text-red-700 border-red-200",
    }
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200"
  }, [])

  const getStatusLabel = useCallback((status) => {
    const labels = {
      active: "Faol",
      inactive: "Nofaol",
      archived: "Arxivlangan",
    }
    return labels[status] || status
  }, [])

  const formatWeekdays = useCallback((weekdays) => {
    const dayNames = {
      monday: "Du",
      tuesday: "Se",
      wednesday: "Ch",
      thursday: "Pa",
      friday: "Ju",
      saturday: "Sh",
      sunday: "Ya",
    }
    const enabledDays = Object.entries(weekdays)
      .filter(([_, dayData]) => dayData.enabled)
      .map(([day, dayData]) => `${dayNames[day]} ${dayData.startTime}-${dayData.endTime}`)
    return enabledDays.join(", ")
  }, [])

  // Permissions
  const canCreateSchedules = useMemo(() => ["director", "manager", "mentor"].includes(user?.role), [user?.role])
  const canEditSchedules = useMemo(() => ["director", "manager", "mentor"].includes(user?.role), [user?.role])
  const canDeleteSchedules = useMemo(() => ["director"].includes(user?.role), [user?.role])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Jadvallar</h1>
            <p className="text-gray-600 mt-1">Darslar jadvalini boshqarish va nazorat qilish</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            {canCreateSchedules && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yangi Jadval
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Jami Jadvallar" value={stats.total} icon={Calendar} color="blue" change="+12%" />
        <StatsCard title="Faol Jadvallar" value={stats.active} icon={Calendar} color="green" change="+8%" />
        <StatsCard title="Bugungi Darslar" value={stats.todayLessons} icon={Clock} color="purple" change="+15%" />
        <StatsCard title="Arxivlangan" value={stats.archived} icon={Archive} color="orange" change="-2%" />
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            <button
              onClick={() => setActiveTab("active")}
              className={`py-4 px-1 border-b-2 font-medium text-sm mr-8 ${activeTab === "active"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Faol Jadvallar ({stats.total})
            </button>
            {(canEditSchedules || user?.role === "reception" || user?.role === "accountant") && (
              <button
                onClick={() => setActiveTab("archived")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "archived"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Arxivlangan Jadvallar ({stats.archived})
              </button>
            )}
          </nav>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filterlar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qidirish</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Jadval nomi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              {/* Group filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guruh</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
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
          </div>
        )}

        {/* Schedules Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Jadvallar ({filteredSchedules.length})</h2>
            {searchTerm && <div className="text-sm text-gray-500">"{searchTerm}" bo'yicha qidiruv</div>}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Yuklanmoqda...</p>
              </div>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedGroup !== "all"
                  ? "Jadval topilmadi"
                  : activeTab === "active"
                    ? "Hali jadvallar yo'q"
                    : "Arxivlangan jadvallar yo'q"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedGroup !== "all"
                  ? "Qidiruv shartlaringizni o'zgartiring"
                  : activeTab === "active"
                    ? canCreateSchedules
                      ? "Birinchi jadvalni yaratish uchun yuqoridagi tugmani bosing"
                      : "Hozircha jadvallar mavjud emas"
                    : "Hali hech qanday jadval arxivlanmagan"}
              </p>
              {canCreateSchedules && !searchTerm && selectedGroup === "all" && activeTab === "active" && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Birinchi jadvalni yarating
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchedules.map((schedule) => (
                <ScheduleCard
                  key={schedule._id}
                  schedule={schedule}
                  onView={handleView}
                  onEdit={handleEdit}
                  onArchive={() => handleArchive(schedule)}
                  onRestore={() => handleRestore(schedule)}
                  onDelete={() => handleDelete(schedule)}
                  getStatusColor={getStatusColor}
                  getStatusLabel={getStatusLabel}
                  formatWeekdays={formatWeekdays}
                  canEditSchedules={canEditSchedules}
                  canDeleteSchedules={canDeleteSchedules}
                  activeTab={activeTab}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateScheduleModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchData() // fetchStats() ni olib tashlang
          }}
        />
      )}

      {showEditModal && selectedSchedule && (
        <EditScheduleModal
          isOpen={showEditModal}
          schedule={selectedSchedule}
          onClose={() => {
            setShowEditModal(false)
            setSelectedSchedule(null)
          }}
          onSuccess={() => {
            setShowEditModal(false)
            setSelectedSchedule(null)
            fetchData() // fetchStats() ni olib tashlang
          }}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, type: "warning", title: "", message: "", onConfirm: null, loading: false })
        }
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        loading={confirmModal.loading}
        confirmText={
          confirmModal.type === "archive"
            ? "Arxivga yuborish"
            : confirmModal.type === "restore"
              ? "Qayta tiklash"
              : "O'chirish"
        }
      />
    </div>
  )
}

// Helper Components
const StatsCard = ({ title, value, icon: Icon, color, change }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
  }

  const changeColor = change.startsWith("+") ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`${colorClasses[color]} p-2 rounded-lg border`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${changeColor}`}>{change}</span>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

const ScheduleCard = ({
  schedule,
  onView,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
  getStatusColor,
  getStatusLabel,
  formatWeekdays,
  canEditSchedules,
  canDeleteSchedules,
  activeTab,
}) => {
  const [showActions, setShowActions] = useState(false)

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all duration-200 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{schedule.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{schedule.lessons?.length || 0} ta dars</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {showActions && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onView(schedule)
                    setShowActions(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ko'rish
                </button>
                {canEditSchedules && activeTab === "active" && (
                  <button
                    onClick={() => {
                      onEdit(schedule)
                      setShowActions(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Tahrirlash
                  </button>
                )}
                {canEditSchedules && activeTab === "active" && (
                  <button
                    onClick={() => {
                      onArchive()
                      setShowActions(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Arxivga yuborish
                  </button>
                )}
                {canEditSchedules && activeTab === "archived" && (
                  <button
                    onClick={() => {
                      onRestore()
                      setShowActions(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Qayta tiklash
                  </button>
                )}
                {canDeleteSchedules && activeTab === "archived" && (
                  <button
                    onClick={() => {
                      onDelete()
                      setShowActions(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Butunlay o'chirish
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Vaqt:</span>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">{formatWeekdays(schedule.weekdays)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Muddat:</span>
          <span className="text-sm font-medium text-gray-900">
            {new Date(schedule.startDate).toLocaleDateString("uz-UZ")} -{" "}
            {new Date(schedule.endDate).toLocaleDateString("uz-UZ")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Status:</span>
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(schedule.status)}`}
          >
            {getStatusLabel(schedule.status)}
          </span>
        </div>
        {schedule.holidays && schedule.holidays.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Bayramlar:</span>
            <span className="text-sm font-medium text-gray-900">{schedule.holidays.length} ta</span>
          </div>
        )}
        {schedule.exams && schedule.exams.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Imtihonlar:</span>
            <span className="text-sm font-medium text-gray-900">{schedule.exams.length} ta</span>
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
        Yaratilgan: {new Date(schedule.createdAt).toLocaleDateString("uz-UZ")}
      </div>
    </div>
  )
}

export default ScheduleManagement
