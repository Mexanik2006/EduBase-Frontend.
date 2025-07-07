import axios from "./authService"

const groupService = {
    // Guruh yaratish
    createGroup: async (data) => {
        const response = await axios.post("/api/groups", data)
        return response.data
    },

    // Barcha guruhlarni olish
    getGroups: async (params = {}) => {
        const queryParams = new URLSearchParams()
        if (params.status) queryParams.append("status", params.status)
        if (params.mentor) queryParams.append("mentor", params.mentor)
        if (params.subject) queryParams.append("subject", params.subject)

        const url = `/api/groups${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
        const response = await axios.get(url)
        return response.data
    },

    // Bitta guruhni olish
    getGroup: async (id) => {
        const response = await axios.get(`/api/groups/${id}`)
        return response.data
    },

    // Guruhni yangilash
    updateGroup: async (id, data) => {
        const response = await axios.put(`/api/groups/${id}`, data)
        return response.data
    },

    // Guruhga jadval biriktirish
    assignSchedule: async (groupId, scheduleId) => {
        const response = await axios.put(`/api/groups/${groupId}/assign-schedule`, { scheduleId })
        return response.data
    },

    // Guruhdan jadvalni ajratish
    removeSchedule: async (groupId) => {
        const response = await axios.put(`/api/groups/${groupId}/remove-schedule`)
        return response.data
    },

    // Guruh statistikasi
    getGroupStats: async () => {
        try {
            const response = await axios.get("/api/groups")
            if (response.data.success) {
                const groups = response.data.groups

                // Guruhlarni status bo'yicha guruhlash
                const stats = {
                    total: groups.length,
                    active: groups.filter((g) => g.status === "active").length,
                    inactive: groups.filter((g) => g.status === "inactive").length,
                    archived: groups.filter((g) => g.status === "archived").length,
                }

                return {
                    success: true,
                    stats: stats,
                }
            }
            return {
                success: false,
                stats: { total: 0, active: 0, inactive: 0, archived: 0 },
            }
        } catch (error) {
            console.error("Group stats error:", error)
            return {
                success: false,
                stats: { total: 0, active: 0, inactive: 0, archived: 0 },
            }
        }
    },

    // Guruhni arxivga yuborish
    archiveGroup: async (id) => {
        const response = await axios.put(`/api/groups/${id}/archive`)
        return response.data
    },

    // Guruhni qayta tiklash
    restoreGroup: async (id) => {
        const response = await axios.put(`/api/groups/${id}/restore`)
        return response.data
    },

    // Guruhni butunlay o'chirish
    deleteGroup: async (id) => {
        const response = await axios.delete(`/api/groups/${id}`)
        return response.data
    },
}

export default groupService
