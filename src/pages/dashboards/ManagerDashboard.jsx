import { Routes, Route } from "react-router-dom"
import UserManagement from "../../components/users/UserManagement"
import GroupManagement from "../../components/groups/GroupManagement"
import GroupDetails from "../../components/groups/GroupDetails"
import SubjectManagement from "../../components/subjects/SubjectManagement"
import ScheduleManagement from "../../components/schedules/ScheduleManagement"
import LessonManagement from "../../components/lessons/LessonManagement"
import LessonDetails from "../../components/lessons/LessonDetails"
import HolidayManagement from "../../components/holidays/HolidayManagement"
import { Users, BookOpen, Calendar, Star, Clock } from 'lucide-react'

const ManagerStats = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Menejer Statistikasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Mening Guruhlarim" value="8" icon={Users} color="blue" change="+2%" />
                <StatCard title="Jami Talabalar" value="64" icon={BookOpen} color="green" change="+12%" />
                <StatCard title="Faol Darslar" value="24" icon={Calendar} color="purple" change="+5%" />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bugungi Jadval</h3>
                <div className="space-y-3">
                    <ScheduleItem time="09:00 - 11:00" subject="React.js" group="Frontend A" status="active" />
                    <ScheduleItem time="14:00 - 16:00" subject="Node.js" group="Backend B" status="upcoming" />
                    <ScheduleItem time="16:30 - 18:30" subject="JavaScript" group="Beginner C" status="upcoming" />
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Guruh Holati</h3>
                <div className="space-y-3">
                    <GroupStatus name="Frontend A" students={12} completion={85} />
                    <GroupStatus name="Backend B" students={8} completion={72} />
                    <GroupStatus name="Beginner C" students={15} completion={45} />
                </div>
            </div>
        </div>
    </div>
)

const ManagerMentors = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Mentorlar</h2>
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Yangi Mentor
                </button>
            </div>
            <div className="space-y-4">
                <MentorCard
                    name="Alisher Karimov"
                    subject="Frontend Development"
                    stats="5 guruh, 40 talaba"
                    rating="4.8"
                    status="active"
                    experience="3 yil"
                />
                <MentorCard
                    name="Malika Tosheva"
                    subject="Backend Development"
                    stats="3 guruh, 24 talaba"
                    rating="4.6"
                    status="active"
                    experience="2 yil"
                />
                <MentorCard
                    name="Bobur Rahimov"
                    subject="Mobile Development"
                    stats="2 guruh, 16 talaba"
                    rating="4.4"
                    status="inactive"
                    experience="1 yil"
                />
            </div>
        </div>
    </div>
)

const ManagerReports = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Menejer Hisobotlari</h2>
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Yangi Hisobot
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReportCard
                    title="Guruhlar Hisoboti"
                    description="Mening guruhlarim bo'yicha batafsil hisobot"
                    period="Dekabr 2024"
                    status="ready"
                />
                <ReportCard
                    title="Mentorlar Faoliyati"
                    description="Mentorlar ish faoliyati va samaradorligi"
                    period="Dekabr 2024"
                    status="processing"
                />
                <ReportCard
                    title="Talabalar Davomati"
                    description="Guruhlar bo'yicha davomat tahlili"
                    period="Dekabr 2024"
                    status="ready"
                />
                <ReportCard
                    title="Darslar Sifati"
                    description="O'tilgan darslar sifati va baholash"
                    period="Dekabr 2024"
                    status="draft"
                />
            </div>
        </div>
    </div>
)

const ManagerDashboard = () => {
    return (
        <Routes>
            <Route path="/stats" element={<ManagerStats />} />
            <Route path="/groups" element={<GroupManagement />} />
            <Route path="/groups/:id" element={<GroupDetails />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/subjects" element={<SubjectManagement />} />
            <Route path="/schedules" element={<ScheduleManagement />} />
            <Route path="/lessons" element={<LessonManagement />} />
            <Route path="/lessons/:id" element={<LessonDetails />} />
            <Route path="/holidays" element={<HolidayManagement />} />
            <Route path="/reports" element={<ManagerReports />} />
            <Route path="/mentors" element={<ManagerMentors />} />
            <Route path="/" element={<ManagerStats />} />
        </Routes>
    )
}

// Helper Components
const StatCard = ({ title, value, icon: Icon, color, change }) => {
    const colorClasses = {
        blue: "bg-blue-50 border-blue-200",
        green: "bg-green-50 border-green-200",
        purple: "bg-purple-50 border-purple-200",
    }

    const iconColors = {
        blue: "text-blue-600",
        green: "text-green-600",
        purple: "text-purple-600",
    }

    const valueColors = {
        blue: "text-blue-600",
        green: "text-green-600",
        purple: "text-purple-600",
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

const ScheduleItem = ({ time, subject, group, status }) => {
    const statusColors = {
        active: "border-green-500 bg-green-50",
        upcoming: "border-orange-500 bg-orange-50",
        completed: "border-gray-500 bg-gray-50",
    }

    return (
        <div className={`border-l-4 pl-4 py-3 rounded-r-lg ${statusColors[status]}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-medium text-gray-900">{subject}</h4>
                    <p className="text-sm text-gray-600">{group}</p>
                    <p className="text-xs text-gray-500 mt-1">{time}</p>
                </div>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${status === "active"
                        ? "bg-green-100 text-green-600"
                        : status === "upcoming"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                >
                    {status === "active" ? "Faol" : status === "upcoming" ? "Kutilmoqda" : "Tugagan"}
                </span>
            </div>
        </div>
    )
}

const GroupStatus = ({ name, students, completion }) => (
    <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-900">{name}</h4>
            <span className="text-sm text-gray-600">{students} talaba</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${completion}%` }}></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{completion}% tugallangan</p>
    </div>
)

const MentorCard = ({ name, subject, stats, rating, status, experience }) => (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900">{name}</h3>
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        {status === "active" ? "Faol" : "Nofaol"}
                    </span>
                </div>
                <p className="text-sm text-gray-600">{subject}</p>
                <p className="text-xs text-gray-500 mt-1">{stats}</p>
                <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="text-xs font-medium text-gray-700">{rating}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-3 w-3 text-gray-500 mr-1" />
                        <span className="text-xs text-gray-500">{experience}</span>
                    </div>
                </div>
            </div>
            <div className="flex space-x-2">
                <button className="bg-black text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                    Ko'rish
                </button>
                <button className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                    Tahrirlash
                </button>
            </div>
        </div>
    </div>
)

const ReportCard = ({ title, description, period, status }) => {
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
                <span className="text-xs text-gray-500">{period}</span>
                <button className="bg-black text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                    Ko'rish
                </button>
            </div>
        </div>
    )
}

export default ManagerDashboard
