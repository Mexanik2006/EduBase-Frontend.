import axios from "./authService"

const scheduleService = {
    // Jadval yaratish
    createSchedule: async (data) => {
        const response = await axios.post("/api/schedules", data)
        return response.data
    },

    // Barcha jadvallarni olish
    getSchedules: async (params = {}) => {
        const queryParams = new URLSearchParams()
        if (params.status) queryParams.append("status", params.status)
        const url = `/api/schedules${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
        const response = await axios.get(url)
        return response.data
    },

    // Bitta jadvalni olish
    getSchedule: async (id) => {
        const response = await axios.get(`/api/schedules/${id}`)
        return response.data
    },

    // Jadvalni yangilash
    updateSchedule: async (id, data) => {
        const response = await axios.put(`/api/schedules/${id}`, data)
        return response.data
    },

    // Davomat va baho saqlash
    saveLessonData: async (scheduleId, lessonId, data) => {
        const response = await axios.put(`/api/schedules/${scheduleId}/lessons/${lessonId}`, data)
        return response.data
    },

    // Jadvalni arxivga yuborish
    archiveSchedule: async (id) => {
        const response = await axios.put(`/api/schedules/${id}/archive`)
        return response.data
    },

    // Jadvalni qayta tiklash
    restoreSchedule: async (id) => {
        const response = await axios.put(`/api/schedules/${id}/restore`)
        return response.data
    },

    // Jadvalni butunlay o'chirish
    deleteSchedule: async (id) => {
        const response = await axios.delete(`/api/schedules/${id}`)
        return response.data
    },
}

export default scheduleService
