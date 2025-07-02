"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import { Plus, Search, Users, Archive, Trash2, Edit, RotateCcw } from "lucide-react"
import CreateUserModal from "./CreateUserModal"
import EditUserModal from "./EditUserModal"
import axios from "axios"

const UserManagement = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedRole, setSelectedRole] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    const { user } = useAuth()
    const { showNotification } = useNotification()

    const roles = [
        { value: "all", label: "Barcha rollar" },
        { value: "director", label: "Direktor" },
        { value: "manager", label: "Menejer" },
        { value: "mentor", label: "Mentor" },
        { value: "accountant", label: "Buxgalter" },
        { value: "reception", label: "Qabulxona" },
        { value: "student", label: "Talaba" },
    ]

    const statusOptions = [
        { value: "all", label: "Barchasi" },
        { value: "active", label: "Faol" },
        { value: "inactive", label: "Nofaol" },
    ]

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true)

            if (selectedStatus === "all") {
                const [activeResponse, inactiveResponse] = await Promise.all([
                    axios.get("/api/users?status=active"),
                    axios.get("/api/users?status=inactive"),
                ])

                const activeUsers = activeResponse.data.success ? activeResponse.data.users : []
                const inactiveUsers = inactiveResponse.data.success ? inactiveResponse.data.users : []

                // Ikki massivni birlashtirish
                const allUsers = [...activeUsers, ...inactiveUsers]

                setUsers(allUsers)
            } else {
                // Bitta status uchun oddiy so'rov
                const url = `/api/users?status=${selectedStatus}`

                const response = await axios.get(url)

                if (response.data.success) {
                    setUsers(response.data.users)
                }
            }
        } catch (error) {
            showNotification("Foydalanuvchilarni yuklashda xato", "error")
        } finally {
            setLoading(false)
        }
    }, [selectedStatus, showNotification])

    // Filterlangan foydalanuvchilarni memoize qilish
    const filteredUsers = useMemo(() => {
        let filtered = users

        // Role filter
        if (selectedRole !== "all") {
            filtered = filtered.filter((user) => user.role === selectedRole)
        }

        // Search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(
                (user) =>
                    user.name?.toLowerCase().includes(searchLower) ||
                    user.email?.toLowerCase().includes(searchLower) ||
                    user.login?.toLowerCase().includes(searchLower),
            )
        }

        return filtered
    }, [users, selectedRole, searchTerm])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleEdit = useCallback((user) => {
        setSelectedUser(user)
        setShowEditModal(true)
    }, [])

    const handleArchive = useCallback(
        async (userId) => {
            if (window.confirm("Foydalanuvchini arxivga yuborishni tasdiqlaysizmi?")) {
                try {
                    const response = await axios.put(`/api/users/${userId}/archive`)
                    if (response.data.success) {
                        showNotification(response.data.message, "success")
                        fetchUsers()
                    }
                } catch (error) {
                    showNotification(error.response?.data?.message || "Xato yuz berdi", "error")
                }
            }
        },
        [showNotification, fetchUsers],
    )

    const handleRestore = useCallback(
        async (userId) => {
            try {
                const response = await axios.put(`/api/users/${userId}/restore`)
                if (response.data.success) {
                    showNotification(response.data.message, "success")
                    fetchUsers()
                }
            } catch (error) {
                showNotification(error.response?.data?.message || "Xato yuz berdi", "error")
            }
        },
        [showNotification, fetchUsers],
    )

    const handleDelete = useCallback(
        async (userId) => {
            if (window.confirm("Foydalanuvchini butunlay o'chirishni tasdiqlaysizmi? Bu amalni bekor qilib bo'lmaydi!")) {
                try {
                    const response = await axios.delete(`/api/users/${userId}`)
                    if (response.data.success) {
                        showNotification(response.data.message, "success")
                        fetchUsers()
                    }
                } catch (error) {
                    showNotification(error.response?.data?.message || "Xato yuz berdi", "error")
                }
            }
        },
        [showNotification, fetchUsers],
    )

    const getRoleColor = useCallback((role) => {
        const colors = {
            director: "bg-purple-100 text-purple-800",
            manager: "bg-blue-100 text-blue-800",
            mentor: "bg-green-100 text-green-800",
            accountant: "bg-yellow-100 text-yellow-800",
            reception: "bg-pink-100 text-pink-800",
            student: "bg-gray-100 text-gray-800",
        }
        return colors[role] || "bg-gray-100 text-gray-800"
    }, [])

    const getStatusColor = useCallback((status) => {
        const colors = {
            active: "bg-green-100 text-green-800",
            inactive: "bg-yellow-100 text-yellow-800",
            archived: "bg-red-100 text-red-800",
        }
        return colors[status] || "bg-gray-100 text-gray-800"
    }, [])

    const canCreateUsers = useMemo(() => ["director", "manager", "reception"].includes(user?.role), [user?.role])

    const canEditUsers = useMemo(() => ["director", "manager"].includes(user?.role), [user?.role])

    const handleModalClose = useCallback(() => {
        setShowCreateModal(false)
    }, [])

    const handleEditModalClose = useCallback(() => {
        setShowEditModal(false)
        setSelectedUser(null)
    }, [])

    const handleCreateSuccess = useCallback(() => {
        setShowCreateModal(false)
        fetchUsers()
    }, [fetchUsers])

    const handleEditSuccess = useCallback(() => {
        setShowEditModal(false)
        setSelectedUser(null)
        fetchUsers()
    }, [fetchUsers])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Foydalanuvchilar</h1>
                    <p className="text-gray-600">Tizim foydalanuvchilarini boshqarish</p>
                </div>
                {canCreateUsers && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Yangi foydalanuvchi
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Role filter */}
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {roles.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>

                    {/* Status filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Foydalanuvchi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Yaratilgan
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amallar
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((userData) => (
                                    <tr key={userData._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold">
                                                        {userData.name?.charAt(0)?.toUpperCase() || "U"}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{userData.name || "Noma'lum"}</div>
                                                    <div className="text-sm text-gray-500">{userData.email || "Email yo'q"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(userData.role)}`}
                                            >
                                                {userData.role || "Noma'lum"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(userData.status)}`}
                                            >
                                                {userData.status === "active"
                                                    ? "Faol"
                                                    : userData.status === "inactive"
                                                        ? "Nofaol"
                                                        : userData.status === "archived"
                                                            ? "Arxivlangan"
                                                            : "Noma'lum"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString("uz-UZ") : "Noma'lum"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                {canEditUsers && userData.status === "active" && (
                                                    <button
                                                        onClick={() => handleEdit(userData)}
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        title="Tahrirlash"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {canEditUsers && userData.status === "active" && (
                                                    <button
                                                        onClick={() => handleArchive(userData._id)}
                                                        className="text-yellow-600 hover:text-yellow-900 p-1"
                                                        title="Arxivga yuborish"
                                                    >
                                                        <Archive className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {canEditUsers && userData.status === "archived" && (
                                                    <button
                                                        onClick={() => handleRestore(userData._id)}
                                                        className="text-green-600 hover:text-green-900 p-1"
                                                        title="Qayta tiklash"
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {user?.role === "director" && userData.status === "archived" && (
                                                    <button
                                                        onClick={() => handleDelete(userData._id)}
                                                        className="text-red-600 hover:text-red-900 p-1"
                                                        title="Butunlay o'chirish"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <Users className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Foydalanuvchi topilmadi</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm ? "Qidiruv shartlaringizni o'zgartiring" : "Hozircha foydalanuvchilar yo'q"}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateUserModal isOpen={showCreateModal} onClose={handleModalClose} onSuccess={handleCreateSuccess} />
            )}

            {showEditModal && selectedUser && (
                <EditUserModal
                    isOpen={showEditModal}
                    user={selectedUser}
                    onClose={handleEditModalClose}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    )
}

export default UserManagement
