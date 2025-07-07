import axios from "./authService"

const holidayService = {
    // Dam olish kuni yaratish
    createHoliday: async (holidayData) => {
        const response = await axios.post("/api/holidays", holidayData)
        return response.data
    },

    // Dam olish kunlarini olish
    getHolidays: async (params = {}) => {
        const queryParams = new URLSearchParams()
        if (params.month) queryParams.append("month", params.month)
        if (params.year) queryParams.append("year", params.year)

        const url = `/api/holidays${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
        const response = await axios.get(url)
        return response.data
    },

    // Dam olish kunini o'chirish
    deleteHoliday: async (id) => {
        const response = await axios.delete(`/api/holidays/${id}`)
        return response.data
    },
}

export default holidayService
