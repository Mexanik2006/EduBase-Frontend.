import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useMemo } from "react"
import { X, Home, Users, BookOpen, DollarSign, UserCheck, GraduationCap, Settings, BarChart3, Calendar, FileText } from 'lucide-react'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth()
  const location = useLocation()

  const menuItems = useMemo(() => {
    const baseItems = [{ name: "Bosh sahifa", href: "/dashboard", icon: Home }]

    switch (user?.role) {
      case "director":
        return [
          ...baseItems,
          { name: "Statistika", href: "/dashboard/director/stats", icon: BarChart3 },
          { name: "Foydalanuvchilar", href: "/dashboard/director/users", icon: Users },
          { name: "Guruhlar", href: "/dashboard/director/groups", icon: Users },
          { name: "Fanlar", href: "/dashboard/director/subjects", icon: BookOpen },
          { name: "Jadvallar", href: "/dashboard/director/schedules", icon: Calendar },
          { name: "Darslar", href: "/dashboard/director/lessons", icon: BookOpen },
          { name: "Moliya", href: "/dashboard/director/finance", icon: DollarSign },
          { name: "Hisobotlar", href: "/dashboard/director/reports", icon: FileText },
          { name: "Sozlamalar", href: "/dashboard/director/settings", icon: Settings },
        ]
      case "manager":
        return [
          ...baseItems,
          { name: "Guruhlar", href: "/dashboard/manager/groups", icon: Users },
          { name: "Foydalanuvchilar", href: "/dashboard/manager/users", icon: Users },
          { name: "Fanlar", href: "/dashboard/manager/subjects", icon: BookOpen },
          { name: "Jadvallar", href: "/dashboard/manager/schedules", icon: Calendar },
          { name: "Darslar", href: "/dashboard/manager/lessons", icon: BookOpen },
          { name: "Mentorlar", href: "/dashboard/manager/mentors", icon: UserCheck },
          { name: "Hisobotlar", href: "/dashboard/manager/reports", icon: FileText },
        ]
      case "mentor":
        return [
          ...baseItems,
          { name: "Mening guruhlarim", href: "/dashboard/mentor/groups", icon: Users },
          { name: "Jadvallar", href: "/dashboard/mentor/schedules", icon: Calendar },
          { name: "Darslar", href: "/dashboard/mentor/lessons", icon: BookOpen },
          { name: "Talabalar", href: "/dashboard/mentor/students", icon: GraduationCap },
        ]
      case "accountant":
        return [
          ...baseItems,
          { name: "To'lovlar", href: "/dashboard/accountant/payments", icon: DollarSign },
          { name: "Hisobotlar", href: "/dashboard/accountant/reports", icon: FileText },
          { name: "Talabalar", href: "/dashboard/accountant/students", icon: Users },
          { name: "Guruhlar", href: "/dashboard/accountant/groups", icon: Users },
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
  }, [user?.role])

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900">EduBase</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-700 font-medium text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={`
                  mr-3 h-4 w-4 transition-colors duration-200
                  ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"}
                `}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 text-center">
            EduBase v1.0
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
