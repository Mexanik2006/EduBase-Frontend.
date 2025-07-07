"use client"
import { useState, useEffect } from "react"
import { useNotification } from "../../context/NotificationContext"
import { X, Calendar, Clock, Plus, Trash2, BookOpen } from "lucide-react"
import scheduleService from "../../service/scheduleService"

const CreateScheduleModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        startDate: "",
        endDate: "",
        weekdays: {
            monday: { enabled: false, startTime: "", endTime: "" },
            tuesday: { enabled: false, startTime: "", endTime: "" },
            wednesday: { enabled: false, startTime: "", endTime: "" },
            thursday: { enabled: false, startTime: "", endTime: "" },
            friday: { enabled: false, startTime: "", endTime: "" },
            saturday: { enabled: false, startTime: "", endTime: "" },
            sunday: { enabled: false, startTime: "", endTime: "" },
        },
        holidays: [],
        exams: [],
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [activeTab, setActiveTab] = useState("basic")
    const { showNotification } = useNotification()

    const dayNames = {
        monday: "Dushanba",
        tuesday: "Seshanba",
        wednesday: "Chorshanba",
        thursday: "Payshanba",
        friday: "Juma",
        saturday: "Shanba",
        sunday: "Yakshanba",
    }

    const tabs = [
        { id: "basic", label: "Asosiy ma'lumotlar", icon: Calendar },
        { id: "schedule", label: "Jadval", icon: Clock },
        { id: "holidays", label: "Bayramlar", icon: Plus },
        { id: "exams", label: "Imtihonlar", icon: BookOpen },
    ]

    useEffect(() => {
        if (isOpen) {
        }
    }, [isOpen])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Jadval nomi majburiy"
        }

        if (!formData.startDate) {
            newErrors.startDate = "Boshlanish sanasi majburiy"
        }

        if (!formData.endDate) {
            newErrors.endDate = "Tugash sanasi majburiy"
        }

        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate)
            const endDate = new Date(formData.endDate)
            if (endDate <= startDate) {
                newErrors.endDate = "Tugash sanasi boshlanish sanasidan keyin bo'lishi kerak"
            }
        }

        const hasEnabledDay = Object.values(formData.weekdays).some((day) => day.enabled)
        if (!hasEnabledDay) {
            newErrors.weekdays = "Kamida bitta kun tanlanishi kerak"
        }

        // Validate enabled days have times
        Object.entries(formData.weekdays).forEach(([day, dayData]) => {
            if (dayData.enabled && (!dayData.startTime || !dayData.endTime)) {
                newErrors[`${day}_time`] = "Vaqt kiritish majburiy"
            }
        })

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

    const handleWeekdayChange = (day, field, value) => {
        setFormData((prev) => ({
            ...prev,
            weekdays: {
                ...prev.weekdays,
                [day]: {
                    ...prev.weekdays[day],
                    [field]: value,
                },
            },
        }))

        // Clear errors
        if (errors.weekdays || errors[`${day}_time`]) {
            setErrors({
                ...errors,
                weekdays: "",
                [`${day}_time`]: "",
            })
        }
    }

    // Bayram qo'shish
    const addHoliday = () => {
        setFormData((prev) => ({
            ...prev,
            holidays: [
                ...prev.holidays,
                {
                    date: "",
                    name: "",
                    description: "",
                },
            ],
        }))
    }

    const updateHoliday = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            holidays: prev.holidays.map((holiday, i) => (i === index ? { ...holiday, [field]: value } : holiday)),
        }))
    }

    const removeHoliday = (index) => {
        setFormData((prev) => ({
            ...prev,
            holidays: prev.holidays.filter((_, i) => i !== index),
        }))
    }

    // Imtihon qo'shish
    const addExam = () => {
        setFormData((prev) => ({
            ...prev,
            exams: [
                ...prev.exams,
                {
                    date: "",
                    name: "",
                    type: "quiz",
                    startTime: "",
                    endTime: "",
                },
            ],
        }))
    }

    const updateExam = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            exams: prev.exams.map((exam, i) => (i === index ? { ...exam, [field]: value } : exam)),
        }))
    }

    const removeExam = (index) => {
        setFormData((prev) => ({
            ...prev,
            exams: prev.exams.filter((_, i) => i !== index),
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        try {
            const response = await scheduleService.createSchedule(formData)
            if (response.success) {
                showNotification(response.message, "success")
                onSuccess()
                // Reset form
                setFormData({
                    name: "",
                    startDate: "",
                    endDate: "",
                    weekdays: {
                        monday: { enabled: false, startTime: "", endTime: "" },
                        tuesday: { enabled: false, startTime: "", endTime: "" },
                        wednesday: { enabled: false, startTime: "", endTime: "" },
                        thursday: { enabled: false, startTime: "", endTime: "" },
                        friday: { enabled: false, startTime: "", endTime: "" },
                        saturday: { enabled: false, startTime: "", endTime: "" },
                        sunday: { enabled: false, startTime: "", endTime: "" },
                    },
                    holidays: [],
                    exams: [],
                })
                setErrors({})
                setActiveTab("basic")
            }
        } catch (error) {
            const message = error.response?.data?.message || "Jadval yaratishda xato"
            showNotification(message, "error")
        } finally {
            setLoading(false)
        }
    }

    const isBasicStepValid = () => {
        return formData.name.trim() && formData.startDate && formData.endDate
    }

    const isScheduleStepValid = () => {
        return Object.values(formData.weekdays).some((day) => day.enabled)
    }

    const canGoNext = () => {
        switch (activeTab) {
            case "basic":
                return isBasicStepValid()
            case "schedule":
                return isScheduleStepValid()
            case "holidays":
                return true
            case "exams":
                return false // Last step
            default:
                return false
        }
    }

    const handleNext = () => {
        const tabOrder = ["basic", "schedule", "holidays", "exams"]
        const currentIndex = tabOrder.indexOf(activeTab)
        if (currentIndex < tabOrder.length - 1) {
            setActiveTab(tabOrder[currentIndex + 1])
        }
    }

    const handlePrevious = () => {
        const tabOrder = ["basic", "schedule", "holidays", "exams"]
        const currentIndex = tabOrder.indexOf(activeTab)
        if (currentIndex > 0) {
            setActiveTab(tabOrder[currentIndex - 1])
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
                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Yangi Jadval Yaratish</h3>
                                <p className="text-sm text-gray-600 mt-1">Yangi dars jadvalini tizimga qo'shish</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex px-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center py-4 px-1 mr-8 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? "border-gray-900 text-gray-900"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <tab.icon className="h-4 w-4 mr-2" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="bg-white px-6 py-6">
                        {/* Basic Information Tab */}
                        {activeTab === "basic" && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Jadval nomi */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Jadval nomi <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                                                    }`}
                                                placeholder="Jadval nomini kiriting"
                                            />
                                        </div>
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    {/* Boshlanish sanasi */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Boshlanish sanasi <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            required
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ${errors.startDate ? "border-red-300 bg-red-50" : "border-gray-300"
                                                }`}
                                        />
                                        {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                                    </div>

                                    {/* Tugash sanasi */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tugash sanasi <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            required
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ${errors.endDate ? "border-red-300 bg-red-50" : "border-gray-300"
                                                }`}
                                        />
                                        {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Schedule Tab */}
                        {activeTab === "schedule" && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Hafta kunlari va vaqtlar <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-3">
                                        {Object.entries(dayNames).map(([day, dayName]) => (
                                            <div
                                                key={day}
                                                className={`flex items-center space-x-4 p-4 border rounded-lg transition-all duration-200 ${formData.weekdays[day].enabled
                                                    ? "border-gray-900 bg-gray-50 ring-2 ring-gray-900 ring-opacity-20"
                                                    : "border-gray-300 hover:border-gray-400"
                                                    }`}
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.weekdays[day].enabled}
                                                        onChange={(e) => handleWeekdayChange(day, "enabled", e.target.checked)}
                                                        className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                                                    />
                                                    <label className="ml-3 text-sm font-medium text-gray-900 w-24">{dayName}</label>
                                                </div>
                                                {formData.weekdays[day].enabled && (
                                                    <div className="flex items-center space-x-3 flex-1">
                                                        <Clock className="h-4 w-4 text-gray-400" />
                                                        <input
                                                            type="time"
                                                            value={formData.weekdays[day].startTime}
                                                            onChange={(e) => handleWeekdayChange(day, "startTime", e.target.value)}
                                                            className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ${errors[`${day}_time`] ? "border-red-300 bg-red-50" : "border-gray-300"
                                                                }`}
                                                        />
                                                        <span className="text-gray-500">-</span>
                                                        <input
                                                            type="time"
                                                            value={formData.weekdays[day].endTime}
                                                            onChange={(e) => handleWeekdayChange(day, "endTime", e.target.value)}
                                                            className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ${errors[`${day}_time`] ? "border-red-300 bg-red-50" : "border-gray-300"
                                                                }`}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {errors.weekdays && <p className="mt-1 text-sm text-red-600">{errors.weekdays}</p>}
                                </div>
                            </div>
                        )}

                        {/* Holidays Tab */}
                        {activeTab === "holidays" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700">Bayram kunlari</label>
                                    <button
                                        type="button"
                                        onClick={addHoliday}
                                        className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Bayram qo'shish
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {formData.holidays.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p>Hali bayram kunlari qo'shilmagan</p>
                                        </div>
                                    ) : (
                                        formData.holidays.map((holiday, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg"
                                            >
                                                <input
                                                    type="date"
                                                    value={holiday.date}
                                                    onChange={(e) => updateHoliday(index, "date", e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                                    placeholder="Sana"
                                                />
                                                <input
                                                    type="text"
                                                    value={holiday.name}
                                                    onChange={(e) => updateHoliday(index, "name", e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                                    placeholder="Bayram nomi"
                                                />
                                                <input
                                                    type="text"
                                                    value={holiday.description}
                                                    onChange={(e) => updateHoliday(index, "description", e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                                    placeholder="Tavsif"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeHoliday(index)}
                                                    className="flex items-center justify-center px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Exams Tab */}
                        {activeTab === "exams" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700">Imtihon kunlari</label>
                                    <button
                                        type="button"
                                        onClick={addExam}
                                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Imtihon qo'shish
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {formData.exams.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p>Hali imtihon kunlari qo'shilmagan</p>
                                        </div>
                                    ) : (
                                        formData.exams.map((exam, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg"
                                            >
                                                <input
                                                    type="date"
                                                    value={exam.date}
                                                    onChange={(e) => updateExam(index, "date", e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                                />
                                                <input
                                                    type="text"
                                                    value={exam.name}
                                                    onChange={(e) => updateExam(index, "name", e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                                    placeholder="Imtihon nomi"
                                                />
                                                <select
                                                    value={exam.type}
                                                    onChange={(e) => updateExam(index, "type", e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                                >
                                                    <option value="quiz">Test</option>
                                                    <option value="midterm">Oraliq</option>
                                                    <option value="final">Yakuniy</option>
                                                </select>
                                                <input
                                                    type="time"
                                                    value={exam.startTime}
                                                    onChange={(e) => updateExam(index, "startTime", e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                                />
                                                <input
                                                    type="time"
                                                    value={exam.endTime}
                                                    onChange={(e) => updateExam(index, "endTime", e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExam(index)}
                                                    className="flex items-center justify-center px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </form>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0 sm:space-x-3">
                        <div>
                            {activeTab !== "basic" && (
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                                >
                                    Oldingisi
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                            >
                                Bekor qilish
                            </button>
                            {activeTab === "exams" ? (
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full sm:w-auto px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Yaratilmoqda...
                                        </>
                                    ) : (
                                        "Jadval yaratish"
                                    )}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={!canGoNext()}
                                    className="w-full sm:w-auto px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Keyingisi
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateScheduleModal
