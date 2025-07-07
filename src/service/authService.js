import axios from "axios"

const API_BASE_URL = "https://edubase-backend.vercel.app"

// Axios instance yaratish
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 10000, // 10 soniya timeout
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// Response interceptor - 401 xatolarda faqat error qaytarish
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 401 xatolarda sahifani qayta yuklamaslik, faqat error qaytarish
        if (error.response?.status === 401) {
            // Token ni o'chirish
            localStorage.removeItem("token")
        }
        return Promise.reject(error)
    },
)

const authService = {
    // Ro'yxatdan o'tish
    register: async (userData) => {
        const response = await api.post("/api/auth/register", userData)
        return response.data
    },

    // Kirish
    login: async (userData) => {
        const response = await api.post("/api/auth/login", userData)
        if (response.data.token) {
            localStorage.setItem("token", response.data.token)
        }
        return response.data
    },

    // Chiqish
    logout: async () => {
        const response = await api.post("/api/auth/logout")
        localStorage.removeItem("token")
        return response.data
    },

    // Foydalanuvchi ma'lumotlarini olish
    getMe: async () => {
        const response = await api.get("/api/auth/me")
        return response.data
    },

    // Aktivatsiya kodi yuborish
    sendActivationCode: async (email) => {
        const response = await api.post("/api/users/send-activation", { email })
        return response.data
    },

    // Aktivatsiya
    activate: async (activationData) => {
        const response = await api.post("/api/users/activate", activationData)
        if (response.data.token) {
            localStorage.setItem("token", response.data.token)
        }
        return response.data
    },
}

// Axios instance ni export qilish
export { authService, api }
export default api
