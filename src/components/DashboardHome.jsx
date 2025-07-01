"use client"
import { useAuth } from "../context/AuthContext"
import { Users, BookOpen, DollarSign, TrendingUp, Calendar, Bell, Award, Clock } from "lucide-react"

const DashboardHome = () => {
    const { user } = useAuth()

    const getRoleBasedStats = () => {
        switch (user?.role) {
            case "director":
                return [
                    { name: "Jami talabalar", value: "1,234", icon: Users, color: "bg-blue-500" },
                    { name: "Mentorlar", value: "45", icon: BookOpen, color: "bg-green-500" },
                    { name: "Oylik daromad", value: "$12,345", icon: DollarSign, color: "bg-yellow-500" },
                    { name: "O'sish", value: "+12%", icon: TrendingUp, color: "bg-purple-500" },
                ]

            case "manager":
                return [
                    { name: "Guruhlar", value: "24", icon: Users, color: "bg-blue-500" },
                    { name: "Mentorlar", value: "12", icon: BookOpen, color: "bg-green-500" },
                    { name: "Bugungi darslar", value: "8", icon: Calendar, color: "bg-orange-500" },
                    { name: "Yangi talabalar", value: "15", icon: TrendingUp, color: "bg-purple-500" },
                ]

            case "mentor":
                return [
                    { name: "Mening guruhlarim", value: "3", icon: Users, color: "bg-blue-500" },
                    { name: "Talabalar", value: "45", icon: BookOpen, color: "bg-green-500" },
                    { name: "Bugungi darslar", value: "4", icon: Calendar, color: "bg-orange-500" },
                    { name: "Baholash", value: "4.8", icon: Award, color: "bg-yellow-500" },
                ]

            case "student":
                return [
                    { name: "Darslar", value: "12", icon: BookOpen, color: "bg-blue-500" },
                    { name: "Baholash", value: "4.5", icon: Award, color: "bg-green-500" },
                    { name: "Soatlar", value: "48", icon: Clock, color: "bg-orange-500" },
                    { name: "To'lovlar", value: "$450", icon: DollarSign, color: "bg-purple-500" },
                ]

            default:
                return [{ name: "Statistika", value: "0", icon: Users, color: "bg-gray-500" }]
        }
    }

    const stats = getRoleBasedStats()

    const getWelcomeMessage = () => {
        const hour = new Date().getHours()
        let greeting = "Salom"

        if (hour < 12) greeting = "Xayrli tong"
        else if (hour < 18) greeting = "Xayrli kun"
        else greeting = "Xayrli kech"

        return `${greeting}, ${user?.name}!`
    }

    return (
        <div className="space-y-6">
            {/* Welcome section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">{getWelcomeMessage()}</h1>
                <p className="text-primary-100 capitalize">{user?.role} sifatida EduBase tizimiga xush kelibsiz</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tezkor harakatlar</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center p-3 text-left rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <Calendar className="h-5 w-5 text-primary-600 mr-3" />
                            <span className="text-sm font-medium text-gray-700">Bugungi jadval</span>
                        </button>
                        <button className="w-full flex items-center p-3 text-left rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <Bell className="h-5 w-5 text-primary-600 mr-3" />
                            <span className="text-sm font-medium text-gray-700">Bildirishnomalar</span>
                        </button>
                        <button className="w-full flex items-center p-3 text-left rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <Users className="h-5 w-5 text-primary-600 mr-3" />
                            <span className="text-sm font-medium text-gray-700">Foydalanuvchilar</span>
                        </button>
                    </div>
                </div>

                {/* Recent notifications */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">So'nggi xabarlar</h3>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                            <div>
                                <p className="text-sm text-gray-900">Yangi talaba qo'shildi</p>
                                <p className="text-xs text-gray-500">5 daqiqa oldin</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                            <div>
                                <p className="text-sm text-gray-900">To'lov amalga oshirildi</p>
                                <p className="text-xs text-gray-500">15 daqiqa oldin</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
                            <div>
                                <p className="text-sm text-gray-900">Dars yakunlandi</p>
                                <p className="text-xs text-gray-500">1 soat oldin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome
