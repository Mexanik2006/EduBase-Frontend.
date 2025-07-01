"use client"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
    X,
    Home,
    Users,
    BookOpen,
    DollarSign,
    UserCheck,
    GraduationCap,
    Settings,
    BarChart3,
    Calendar,
    FileText,
} from "lucide-react"

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const { user } = useAuth()
    const location = useLocation()

    // Role-based menu items
    const getMenuItems = () => {
        const baseItems = [{ name: "Bosh sahifa", href: "/dashboard", icon: Home }]

        switch (user?.role) {
            case "director":
                return [
                    ...baseItems,
                    { name: "Statistika", href: "/dashboard/director/stats", icon: BarChart3 },
                    { name: "Foydalanuvchilar", href: "/dashboard/director/users", icon: Users },
                    { name: "Moliya", href: "/dashboard/director/finance", icon: DollarSign },
                    { name: "Hisobotlar", href: "/dashboard/director/reports", icon: FileText },
                    { name: "Sozlamalar", href: "/dashboard/director/settings", icon: Settings },
                ]

            case "manager":
                return [
                    ...baseItems,
                    { name: "Guruhlar", href: "/dashboard/manager/groups", icon: Users },
                    { name: "Mentorlar", href: "/dashboard/manager/mentors", icon: UserCheck },
                    { name: "Jadval", href: "/dashboard/manager/schedule", icon: Calendar },
                    { name: "Hisobotlar", href: "/dashboard/manager/reports", icon: FileText },
                ]

            case "mentor":
                return [
                    ...baseItems,
                    { name: "Mening guruhlarim", href: "/dashboard/mentor/groups", icon: Users },
                    { name: "Darslar", href: "/dashboard/mentor/lessons", icon: BookOpen },
                    { name: "Talabalar", href: "/dashboard/mentor/students", icon: GraduationCap },
                    { name: "Jadval", href: "/dashboard/mentor/schedule", icon: Calendar },
                ]

            case "accountant":
                return [
                    ...baseItems,
                    { name: "To'lovlar", href: "/dashboard/accountant/payments", icon: DollarSign },
                    { name: "Hisobotlar", href: "/dashboard/accountant/reports", icon: FileText },
                    { name: "Talabalar", href: "/dashboard/accountant/students", icon: Users },
                ]

            case "reception":
                return [
                    ...baseItems,
                    { name: "Qabul", href: "/dashboard/reception/admission", icon: UserCheck },
                    { name: "Talabalar", href: "/dashboard/reception/students", icon: GraduationCap },
                    { name: "Guruhlar", href: "/dashboard/reception/groups", icon: Users },
                ]

            case "student":
                return [
                    ...baseItems,
                    { name: "Mening darslarim", href: "/dashboard/student/lessons", icon: BookOpen },
                    { name: "Jadval", href: "/dashboard/student/schedule", icon: Calendar },
                    { name: "To'lovlar", href: "/dashboard/student/payments", icon: DollarSign },
                    { name: "Profil", href: "/dashboard/student/profile", icon: Settings },
                ]

            default:
                return baseItems
        }
    }

    const menuItems = getMenuItems()

    return (
        <>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
                </div>
            )}

            {/* Sidebar */}
            <div
                className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
            >
                <div className="flex items-center justify-between h-16 px-6 bg-primary-600">
                    <div className="flex items-center">
                        <GraduationCap className="h-8 w-8 text-white" />
                        <span className="ml-2 text-xl font-bold text-white">EduBase</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white hover:text-gray-200">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* User info */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">{user?.name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-6">
                    <div className="px-3">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors duration-200
                    ${isActive
                                            ? "bg-primary-100 text-primary-700 border-r-2 border-primary-600"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }
                  `}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon
                                        className={`
                    mr-3 h-5 w-5 transition-colors duration-200
                    ${isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-500"}
                  `}
                                    />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>
                </nav>
            </div>
        </>
    )
}

export default Sidebar
