import axios from "axios"

const API_URL = "https://edubase-backend.vercel.app/api/auth"

// Axios konfiguratsiyasi
axios.defaults.withCredentials = true

const authService = {
    // Ro'yxatdan o'tish
    register: async (userData) => {
        const response = await axios.post(`${API_URL}/register`, userData)
        return response.data
    },

    // Kirish
    login: async (userData) => {
        const response = await axios.post(`${API_URL}/login`, userData)
        return response.data
    },

    // Chiqish
    logout: async () => {
        const response = await axios.post(`${API_URL}/logout`)
        return response.data
    },

    // Foydalanuvchi ma'lumotlarini olish
    getMe: async () => {
        const response = await axios.get(`${API_URL}/me`)
        return response.data
    },
}

export { authService }
