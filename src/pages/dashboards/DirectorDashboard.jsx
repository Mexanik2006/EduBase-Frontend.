import { Routes, Route } from "react-router-dom"
import UserManagement from "../../components/users/UserManagement"
import GroupManagement from "../../components/groups/GroupManagement"
import GroupDetails from "../../components/groups/GroupDetails"
import SubjectManagement from "../../components/subjects/SubjectManagement"
import ScheduleManagement from "../../components/schedules/ScheduleManagement"
import LessonManagement from "../../components/lessons/LessonManagement"
import LessonDetails from "../../components/lessons/LessonDetails"
import HolidayManagement from "../../components/holidays/HolidayManagement"
import { Users, BookOpen, DollarSign, FileText, Settings, BarChart3 } from 'lucide-react'
import ScheduleDetails from "../../components/schedules/ScheduleDetails"

const DirectorStats = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Direktor Statistikasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Jami Guruhlar" value="24" icon={Users} color="blue" change="+12%" />
                <StatCard title="Jami Talabalar" value="156" icon={BookOpen} color="green" change="+8%" />
                <StatCard title="Jami Mentorlar" value="12" icon={Users} color="purple" change="+5%" />
                <StatCard title="Oylik Daromad" value="45M" icon={DollarSign} color="orange" change="+22%" />
            </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">So'nggi Faoliyat</h3>
                <div className="space-y-4">
                    <ActivityItem
                        title="Yangi guruh yaratildi"
                        description="Frontend Development - Guruh C"
                        time="2 soat oldin"
                        type="success"
                    />
                    <ActivityItem
                        title="Yangi mentor qo'shildi"
                        description="Jasur Abdullayev - React.js"
                        time="5 soat oldin"
                        type="info"
                    />
                    <ActivityItem title="To'lov qabul qilindi" description="15,000,000 so'm" time="1 kun oldin" type="success" />
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tezkor Harakatlar</h3>
                <div className="space-y-3">
                    <QuickAction title="Yangi Guruh Yaratish" description="Yangi o'quv guruhini yaratish" icon={Users} />
                    <QuickAction title="Mentor Qo'shish" description="Yangi mentorni tizimga qo'shish" icon={Users} />
                    <QuickAction title="Hisobot Ko'rish" description="Oylik hisobotlarni ko'rish" icon={FileText} />
                </div>
            </div>
        </div>
    </div>
)

const DirectorFinance = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Moliya</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FinanceCard title="Jami Daromad" value="125,000,000" unit="so'm" color="green" change="+15%" />
                <FinanceCard title="Jami Xarajat" value="80,000,000" unit="so'm" color="red" change="+8%" />
                <FinanceCard title="Sof Foyda" value="45,000,000" unit="so'm" color="blue" change="+25%" />
            </div>
        </div>

        {/* Monthly Chart Placeholder */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Oylik Daromad Grafigi</h3>
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                    Export
                </button>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Grafik bu yerda ko'rsatiladi</p>
                </div>
            </div>
        </div>
    </div>
)

const DirectorReports = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Hisobotlar</h2>
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Yangi Hisobot
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReportCard
                    title="Oylik Hisobot"
                    description="Oxirgi oy bo'yicha to'liq hisobot"
                    date="Dekabr 2024"
                    status="ready"
                />
                <ReportCard
                    title="Davomat Hisoboti"
                    description="Talabalar davomati bo'yicha hisobot"
                    date="Dekabr 2024"
                    status="processing"
                />
                <ReportCard
                    title="Moliyaviy Hisobot"
                    description="Daromad va xarajatlar tahlili"
                    date="Dekabr 2024"
                    status="ready"
                />
                <ReportCard
                    title="Mentorlar Faoliyati"
                    description="Mentorlar ish faoliyati hisoboti"
                    date="Dekabr 2024"
                    status="draft"
                />
            </div>
        </div>
    </div>
)

const DirectorSettings = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sozlamalar</h2>
            <div className="space-y-4">
                <SettingCard
                    title="Tizim Sozlamalari"
                    description="Umumiy tizim sozlamalari va konfiguratsiya"
                    action="Sozlash"
                    icon={Settings}
                />
                <SettingCard
                    title="Xavfsizlik"
                    description="Parol va xavfsizlik sozlamalari"
                    action="Boshqarish"
                    icon={Settings}
                />
                <SettingCard
                    title="Bildirishnomalar"
                    description="Email va SMS bildirishnomalar sozlamalari"
                    action="Sozlash"
                    icon={Settings}
                />
                <SettingCard title="Backup" description="Ma'lumotlar zaxirasi va tiklash" action="Boshqarish" icon={Settings} />
            </div>
        </div>
    </div>
)

const DirectorDashboard = () => {
    return (
        <Routes>
            <Route path="/stats" element={<DirectorStats />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/groups" element={<GroupManagement />} />
            <Route path="/groups/:id" element={<GroupDetails />} />
            <Route path="/subjects" element={<SubjectManagement />} />
            <Route path="/schedules" element={<ScheduleManagement />} />
            <Route path="/schedules/:id" element={<ScheduleDetails />} />
            <Route path="/lessons" element={<LessonManagement />} />
            <Route path="/lessons/:id" element={<LessonDetails />} />
            <Route path="/holidays" element={<HolidayManagement />} />
            <Route path="/reports" element={<DirectorReports />} />
            <Route path="/finance" element={<DirectorFinance />} />
            <Route path="/settings" element={<DirectorSettings />} />
            <Route path="/" element={<DirectorStats />} />
        </Routes>
    )
}

// Helper Components
const StatCard = ({ title, value, icon: Icon, color, change }) => {
    const colorClasses = {
        blue: "bg-blue-50 border-blue-200",
        green: "bg-green-50 border-green-200",
        purple: "bg-purple-50 border-purple-200",
        orange: "bg-orange-50 border-orange-200",
    }

    const iconColors = {
        blue: "text-blue-600",
        green: "text-green-600",
        purple: "text-purple-600",
        orange: "text-orange-600",
    }

    const valueColors = {
        blue: "text-blue-600",
        green: "text-green-600",
        purple: "text-purple-600",
        orange: "text-orange-600",
    }

    return (
        <div className={`${colorClasses[color]} p-6 rounded-xl border`}>
            <div className="flex items-center justify-between mb-4">
                <Icon className={`h-6 w-6 ${iconColors[color]}`} />
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">{change}</span>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
                <p className={`text-2xl font-semibold ${valueColors[color]}`}>{value}</p>
            </div>
        </div>
    )
}

const FinanceCard = ({ title, value, unit, color, change }) => {
    const colorClasses = {
        green: "bg-green-50 border-green-200",
        red: "bg-red-50 border-red-200",
        blue: "bg-blue-50 border-blue-200",
    }

    const valueColors = {
        green: "text-green-600",
        red: "text-red-600",
        blue: "text-blue-600",
    }

    return (
        <div className={`${colorClasses[color]} p-6 rounded-xl border`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">{title}</h3>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">{change}</span>
            </div>
            <p className={`text-xl font-semibold ${valueColors[color]}`}>
                {value} {unit}
            </p>
        </div>
    )
}

const ActivityItem = ({ title, description, time, type }) => {
    const typeColors = {
        success: "bg-green-100 border-green-200",
        info: "bg-blue-100 border-blue-200",
        warning: "bg-yellow-100 border-yellow-200",
    }

    return (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${typeColors[type]}`}></div>
            <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
            <span className="text-xs text-gray-500 font-medium">{time}</span>
        </div>
    )
}

const QuickAction = ({ title, description, icon: Icon }) => (
    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
        <div className="flex items-center space-x-3">
            <div className="bg-gray-100 group-hover:bg-gray-200 p-2 rounded-lg transition-colors">
                <Icon className="h-4 w-4 text-gray-600" />
            </div>
            <div>
                <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    </button>
)

const ReportCard = ({ title, description, date, status }) => {
    const statusColors = {
        ready: "bg-green-100 text-green-600",
        processing: "bg-yellow-100 text-yellow-600",
        draft: "bg-gray-100 text-gray-600",
    }

    const statusText = {
        ready: "Tayyor",
        processing: "Jarayonda",
        draft: "Qoralama",
    }

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-gray-900">{title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                    {statusText[status]}
                </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{date}</span>
                <button className="bg-black text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                    Ko'rish
                </button>
            </div>
        </div>
    )
}

const SettingCard = ({ title, description, action, icon: Icon }) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-2 rounded-lg">
                <Icon className="h-4 w-4 text-gray-600" />
            </div>
            <div>
                <h3 className="font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
        <button className="bg-black text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800 transition-colors">
            {action}
        </button>
    </div>
)

export default DirectorDashboard
