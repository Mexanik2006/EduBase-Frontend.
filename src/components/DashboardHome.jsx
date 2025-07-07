import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { Users, BookOpen, Calendar, TrendingUp, Clock, CheckCircle, ArrowUpRight } from 'lucide-react'

const DashboardHome = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalStudents: 0,
    totalLessons: 0,
    completedLessons: 0,
  })

  useEffect(() => {
    setStats({
      totalGroups: 24,
      totalStudents: 156,
      totalLessons: 48,
      completedLessons: 32,
    })
  }, [])

  const getRoleBasedWelcome = () => {
    switch (user?.role) {
      case "director":
        return "Direktor paneli"
      case "manager":
        return "Menejer paneli"
      case "mentor":
        return "Mentor paneli"
      case "accountant":
        return "Buxgalter paneli"
      case "reception":
        return "Qabul paneli"
      case "student":
        return "Talaba paneli"
      default:
        return "Dashboard"
    }
  }

  const getStatsCards = () => {
    const baseCards = [
      {
        title: "Jami Guruhlar",
        value: stats.totalGroups,
        icon: Users,
        color: "blue",
        change: "+12%",
      },
      {
        title: "Jami Talabalar",
        value: stats.totalStudents,
        icon: BookOpen,
        color: "green",
        change: "+8%",
      },
      {
        title: "Jami Darslar",
        value: stats.totalLessons,
        icon: Calendar,
        color: "purple",
        change: "+15%",
      },
      {
        title: "Yakunlangan Darslar",
        value: stats.completedLessons,
        icon: CheckCircle,
        color: "orange",
        change: "+22%",
      },
    ]
    return baseCards
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Xush kelibsiz, {user?.name}!</h1>
            <p className="text-gray-600 mt-2">{getRoleBasedWelcome()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Bugun</p>
            <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString("uz-UZ")}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStatsCards().map((card, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${getCardBgColor(card.color)} p-3 rounded-lg`}>
                <card.icon className={`h-5 w-5 ${getCardIconColor(card.color)}`} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {card.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Tezkor Amallar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user?.role === "director" && (
            <>
              <QuickActionCard
                title="Yangi Guruh"
                description="Yangi guruh yaratish"
                icon={Users}
                href="/dashboard/director/groups"
              />
              <QuickActionCard
                title="Darslar"
                description="Darslarni boshqarish"
                icon={BookOpen}
                href="/dashboard/director/lessons"
              />
              <QuickActionCard
                title="Hisobotlar"
                description="Hisobotlarni ko'rish"
                icon={TrendingUp}
                href="/dashboard/director/reports"
              />
            </>
          )}
          {user?.role === "manager" && (
            <>
              <QuickActionCard
                title="Guruhlar"
                description="Guruhlarni boshqarish"
                icon={Users}
                href="/dashboard/manager/groups"
              />
              <QuickActionCard
                title="Darslar"
                description="Darslarni boshqarish"
                icon={BookOpen}
                href="/dashboard/manager/lessons"
              />
              <QuickActionCard
                title="Mentorlar"
                description="Mentorlarni boshqarish"
                icon={Users}
                href="/dashboard/manager/mentors"
              />
            </>
          )}
          {user?.role === "mentor" && (
            <>
              <QuickActionCard
                title="Mening Darslarim"
                description="Bugungi darslar"
                icon={BookOpen}
                href="/dashboard/mentor/lessons"
              />
              <QuickActionCard
                title="Guruhlarim"
                description="Mening guruhlarim"
                icon={Users}
                href="/dashboard/mentor/groups"
              />
              <QuickActionCard
                title="Jadval"
                description="Dars jadvali"
                icon={Calendar}
                href="/dashboard/mentor/schedules"
              />
            </>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">So'nggi Faoliyat</h2>
        <div className="space-y-4">
          <ActivityItem
            icon={Clock}
            title="Yangi dars boshlandi"
            description="React.js - Frontend Development"
            time="10 daqiqa oldin"
          />
          <ActivityItem
            icon={CheckCircle}
            title="Dars yakunlandi"
            description="Node.js - Backend Development"
            time="1 soat oldin"
          />
          <ActivityItem
            icon={Users}
            title="Yangi talaba qo'shildi"
            description="Alisher Karimov - Frontend guruhiga"
            time="2 soat oldin"
          />
        </div>
      </div>
    </div>
  )
}

const getCardBgColor = (color) => {
  const colors = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
    orange: "bg-orange-50",
  }
  return colors[color] || "bg-gray-50"
}

const getCardIconColor = (color) => {
  const colors = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  }
  return colors[color] || "text-gray-600"
}

const QuickActionCard = ({ title, description, icon: Icon, href }) => {
  return (
    <a
      href={href}
      className="group p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-50 group-hover:bg-gray-100 p-3 rounded-lg transition-colors">
            <Icon className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
    </a>
  )
}

const ActivityItem = ({ icon: Icon, title, description, time }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
      <div className="bg-white p-2 rounded-lg shadow-sm">
        <Icon className="h-4 w-4 text-gray-600" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <span className="text-xs text-gray-500 font-medium">{time}</span>
    </div>
  )
}

export default DashboardHome
