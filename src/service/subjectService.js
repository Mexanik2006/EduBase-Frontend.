import axios from "./authService"

const subjectService = {
    // Barcha fanlarni olish
    getSubjects: async (params = {}) => {
        const queryParams = new URLSearchParams()
        if (params.status) queryParams.append("status", params.status)

        const url = `/api/subjects${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
        const response = await axios.get(url)
        return response.data
    },

    // Arxivlangan fanlarni olish
    getArchivedSubjects: async () => {
        const response = await axios.get("/api/subjects/archived")
        return response.data
    },

    // Bitta fanni olish
    getSubject: async (id) => {
        const response = await axios.get(`/api/subjects/${id}`)
        return response.data
    },

    // Fan yaratish
    createSubject: async (subjectData) => {
        const response = await axios.post("/api/subjects", subjectData)
        return response.data
    },

    // Fanni yangilash
    updateSubject: async (id, subjectData) => {
        const response = await axios.put(`/api/subjects/${id}`, subjectData)
        return response.data
    },

    // Fanni arxivga yuborish
    archiveSubject: async (id) => {
        const response = await axios.put(`/api/subjects/${id}/archive`)
        return response.data
    },

    // Fanni qayta tiklash
    restoreSubject: async (id) => {
        const response = await axios.put(`/api/subjects/${id}/restore`)
        return response.data
    },

    // Fanni butunlay o'chirish
    deleteSubject: async (id) => {
        const response = await axios.delete(`/api/subjects/${id}`)
        return response.data
    },
}

export default subjectService
