import axios from "./authService"

const lessonService = {
    // Darslar yaratish
    generateLessons: async (data) => {
        const response = await axios.post("/api/lessons/generate", data)
        return response.data
    },

    // Darslarni olish
    getLessons: async (params = {}) => {
        const queryParams = new URLSearchParams()
        if (params.groupId) queryParams.append("groupId", params.groupId)
        if (params.month) queryParams.append("month", params.month)
        if (params.year) queryParams.append("year", params.year)

        const url = `/api/lessons${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
        const response = await axios.get(url)
        return response.data
    },

    // Bitta darsni olish
    getLesson: async (id) => {
        const response = await axios.get(`/api/lessons/${id}`)
        return response.data
    },

    // Davomat va baho saqlash
    saveAttendanceAndGrades: async (id, data) => {
        const response = await axios.put(`/api/lessons/${id}/save`, data)
        return response.data
    },

    // Imtihon yaratish
    createExam: async (data) => {
        const response = await axios.post("/api/lessons/exam", data)
        return response.data
    },
}

export default lessonService
