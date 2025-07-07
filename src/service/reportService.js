import axios from "./authService"

const reportService = {
    // Oylik hisobot yaratish
    generateMonthlyReport: async (studentId, groupId, month, year) => {
        const response = await axios.post("/api/reports/monthly", {
            studentId,
            groupId,
            month,
            year,
        })
        return response.data
    },

    // Guruh uchun oylik hisobotlar yaratish
    generateGroupMonthlyReports: async (groupId, month, year) => {
        const response = await axios.post("/api/reports/monthly/group", {
            groupId,
            month,
            year,
        })
        return response.data
    },

    // Oylik hisobotlarni olish
    getMonthlyReports: async (params = {}) => {
        const queryParams = new URLSearchParams()
        if (params.studentId) queryParams.append("studentId", params.studentId)
        if (params.groupId) queryParams.append("groupId", params.groupId)
        if (params.month) queryParams.append("month", params.month)
        if (params.year) queryParams.append("year", params.year)

        const url = `/api/reports/monthly${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
        const response = await axios.get(url)
        return response.data
    },
}

export default reportService
