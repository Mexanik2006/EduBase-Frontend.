import { Routes, Route } from "react-router-dom"
import GroupManagement from "../../components/groups/GroupManagement"
import GroupDetails from "../../components/groups/GroupDetails"
import ScheduleManagement from "../../components/schedules/ScheduleManagement"
import LessonManagement from "../../components/lessons/LessonManagement"
import LessonDetails from "../../components/lessons/LessonDetails"
import MonthlyReports from "../../components/reports/MonthlyReports"
import { Users, BookOpen, Calendar, Star, Play, FileText, TrendingUp, Award, Target } from "lucide-react"

const MentorStats = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Mentor Statistikasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Mening Guruhlarim" value="3" icon={Users} color="blue" change="+1%" />
                <StatCard title="Jami Talabalar" value="24" icon={BookOpen} color="green" change="+8%" />
                <StatCard title="Bugungi Darslar" value="2" icon={Calendar} color="purple" change="0%" />
                <StatCard title="O'rtacha Baho" value="4.2" icon={Star} color="orange" change="+0.3%" />
            </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Bugungi Darslar</h3>
                <div className="space-y-4">
                    <LessonCard
                        title="Frontend Development - Guruh A"
                        time="10:00 - 12:00"
                        status="ready"
                        students={8}
                        topic="React Hooks"
                    />
                    <LessonCard
                        title="React.js - Guruh B"
                        time="14:00 - 16:00"
                        status="upcoming"
                        students={6}
                        topic="State Management"
                    />
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Haftalik Statistika</h3>
                <div className="space-y-4">
                    <WeeklyStatItem title="O'tilgan Darslar" value="12" total="14" percentage={86} color="green" />
                    <WeeklyStatItem title="Talabalar Davomati" value="92%" total="100%" percentage={92} color="blue" />
                    <WeeklyStatItem title="Baholangan Vazifalar" value="18" total="24" percentage={75} color="purple" />
                </div>
            </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tezkor Harakatlar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuickActionCard
                    title="Yangi Dars Yaratish"
                    description="Guruhlar uchun yangi dars rejasini yaratish"
                    icon={BookOpen}
                    action="Yaratish"
                />
                <QuickActionCard
                    title="Talabalarni Baholash"
                    description="Oxirgi darslar bo'yicha baholar qo'yish"
                    icon={Award}
                    action="Baholash"
                />
                <QuickActionCard
                    title="Hisobot Tayyorlash"
                    description="Guruhlar bo'yicha progress hisoboti"
                    icon={TrendingUp}
                    action="Tayyorlash"
                />
            </div>
        </div>
    </div>
)

const MentorLessons = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Mening Darslarim</h2>
                <div className="flex space-x-2">
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        Filter
                    </button>
                    <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        Yangi Dars
                    </button>
                </div>
            </div>

            {/* Lesson Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <LessonCategoryCard title="Bugungi Darslar" count="2" color="green" description="Bugun o'tiladigan darslar" />
                <LessonCategoryCard title="Keyingi Darslar" count="5" color="blue" description="Rejalashtirilgan darslar" />
                <LessonCategoryCard title="Tugallangan" count="18" color="gray" description="O'tilgan darslar" />
            </div>

            {/* Detailed Lessons */}
            <div className="space-y-4">
                <DetailedLessonCard
                    title="React.js Asoslari"
                    group="Frontend Development - Guruh A"
                    time="Bugun 10:00 - 12:00"
                    canStart={true}
                    students={8}
                    materials={5}
                    topic="Component Lifecycle"
                    attendance={100}
                />
                <DetailedLessonCard
                    title="Node.js va Express"
                    group="Backend Development - Guruh B"
                    time="Ertaga 14:00 - 16:00"
                    canStart={false}
                    students={6}
                    materials={3}
                    topic="REST API Development"
                    attendance={85}
                />
                <DetailedLessonCard
                    title="JavaScript ES6+"
                    group="Beginner - Guruh C"
                    time="Ertaga 16:30 - 18:30"
                    canStart={false}
                    students={12}
                    materials={4}
                    topic="Arrow Functions"
                    attendance={92}
                />
                <DetailedLessonCard
                    title="Database Design"
                    group="Backend Development - Guruh B"
                    time="Dushanba 10:00 - 12:00"
                    canStart={false}
                    students={6}
                    materials={7}
                    topic="SQL Relationships"
                    attendance={78}
                />
            </div>
        </div>
    </div>
)

const MentorStudents = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Mening Talabalarim</h2>
                <div className="flex space-x-2">
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        Export
                    </button>
                    <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        Baho Qo'yish
                    </button>
                </div>
            </div>

            {/* Student Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StudentOverviewCard title="Jami Talabalar" value="24" color="blue" />
                <StudentOverviewCard title="Faol Talabalar" value="22" color="green" />
                <StudentOverviewCard title="O'rtacha Baho" value="4.3" color="purple" />
                <StudentOverviewCard title="Davomat" value="89%" color="orange" />
            </div>

            {/* Student Groups */}
            <div className="space-y-6">
                <StudentGroup
                    title="Frontend Development - Guruh A"
                    students={[
                        { name: "Alisher Karimov", grade: "4.5", attendance: 95, progress: 85, status: "excellent" },
                        { name: "Malika Tosheva", grade: "4.8", attendance: 100, progress: 92, status: "excellent" },
                        { name: "Bobur Rahimov", grade: "3.9", attendance: 85, progress: 70, status: "good" },
                        { name: "Nilufar Saidova", grade: "4.2", attendance: 90, progress: 78, status: "good" },
                        { name: "Jasur Abdullayev", grade: "3.5", attendance: 75, progress: 60, status: "needs_attention" },
                    ]}
                />
                <StudentGroup
                    title="Backend Development - Guruh B"
                    students={[
                        { name: "Sevara Nazarova", grade: "4.7", attendance: 98, progress: 95, status: "excellent" },
                        { name: "Otabek Toshev", grade: "4.1", attendance: 88, progress: 82, status: "good" },
                        { name: "Dilnoza Karimova", grade: "3.8", attendance: 82, progress: 68, status: "good" },
                        { name: "Sardor Rahimov", grade: "3.2", attendance: 70, progress: 55, status: "needs_attention" },
                    ]}
                />
                <StudentGroup
                    title="Beginner - Guruh C"
                    students={[
                        { name: "Aziza Saidova", grade: "4.0", attendance: 92, progress: 75, status: "good" },
                        { name: "Bekzod Nazarov", grade: "3.7", attendance: 85, progress: 65, status: "good" },
                        { name: "Charos Abdullayeva", grade: "4.4", attendance: 96, progress: 88, status: "excellent" },
                    ]}
                />
            </div>
        </div>
    </div>
)

const MentorDashboard = () => {
    return (
        <Routes>
            <Route path="/stats" element={<MentorStats />} />
            <Route path="/groups" element={<GroupManagement />} />
            <Route path="/groups/:id" element={<GroupDetails />} />
            <Route path="/schedules" element={<ScheduleManagement />} />
            <Route path="/lessons" element={<LessonManagement />} />
            <Route path="/lessons/:id" element={<LessonDetails />} />
            <Route path="/my-lessons" element={<MentorLessons />} />
            <Route path="/students" element={<MentorStudents />} />
            <Route path="/reports" element={<MonthlyReports />} />
            <Route path="/" element={<MentorStats />} />
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
        <div className={`${colorClasses[color]} p-6 rounded-xl border hover:shadow-sm transition-shadow`}>
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

const WeeklyStatItem = ({ title, value, total, percentage, color }) => {
    const colorClasses = {
        green: "bg-green-600",
        blue: "bg-blue-600",
        purple: "bg-purple-600",
    }

    return (
        <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                <span className="text-sm text-gray-600">
                    {value}/{total}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${colorClasses[color]} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{percentage}%</p>
        </div>
    )
}

const QuickActionCard = ({ title, description, icon: Icon, action }) => (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors group">
        <div className="flex items-start space-x-3">
            <div className="bg-gray-100 group-hover:bg-gray-200 p-2 rounded-lg transition-colors">
                <Icon className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
                <p className="text-sm text-gray-600 mb-3">{description}</p>
                <button className="bg-black text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                    {action}
                </button>
            </div>
        </div>
    </div>
)

const LessonCard = ({ title, time, status, students, topic }) => {
    const statusColors = {
        ready: "border-green-500 bg-green-50",
        upcoming: "border-orange-500 bg-orange-50",
    }

    return (
        <div className={`border-l-4 pl-4 py-4 rounded-r-lg ${statusColors[status]}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-medium text-gray-900">{title}</h4>
                    <p className="text-sm text-gray-600 mt-1">Mavzu: {topic}</p>
                    <p className="text-sm text-gray-600">{time}</p>
                    <p className="text-xs text-gray-500 mt-1">{students} talaba</p>
                </div>
                <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${status === "ready"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                    disabled={status !== "ready"}
                >
                    {status === "ready" && <Play className="h-4 w-4" />}
                    <span>{status === "ready" ? "Darsni Boshlash" : "Kutish"}</span>
                </button>
            </div>
        </div>
    )
}

const LessonCategoryCard = ({ title, count, color, description }) => {
    const colorClasses = {
        green: "bg-green-50 border-green-200 text-green-600",
        blue: "bg-blue-50 border-blue-200 text-blue-600",
        gray: "bg-gray-50 border-gray-200 text-gray-600",
    }

    return (
        <div className={`${colorClasses[color]} p-4 rounded-xl border`}>
            <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
            <p className="text-2xl font-semibold mb-1">{count}</p>
            <p className="text-xs text-gray-600">{description}</p>
        </div>
    )
}

const DetailedLessonCard = ({ title, group, time, canStart, students, materials, topic, attendance }) => (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <h3 className="font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{group}</p>
                <p className="text-sm text-gray-600 mt-1">Mavzu: {topic}</p>
                <p className="text-xs text-gray-500 mt-1">{time}</p>
                <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                        <Users className="h-3 w-3 text-gray-500 mr-1" />
                        <span className="text-xs text-gray-500">{students} talaba</span>
                    </div>
                    <div className="flex items-center">
                        <FileText className="h-3 w-3 text-gray-500 mr-1" />
                        <span className="text-xs text-gray-500">{materials} material</span>
                    </div>
                    <div className="flex items-center">
                        <Target className="h-3 w-3 text-gray-500 mr-1" />
                        <span className="text-xs text-gray-500">{attendance}% davomat</span>
                    </div>
                </div>
            </div>
            <div className="flex space-x-2">
                <button
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${canStart ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                    disabled={!canStart}
                >
                    {canStart && <Play className="h-3 w-3" />}
                    <span>{canStart ? "Boshlash" : "Kutish"}</span>
                </button>
                <button className="bg-black text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                    Materiallar
                </button>
            </div>
        </div>
    </div>
)

const StudentOverviewCard = ({ title, value, color }) => {
    const colorClasses = {
        blue: "bg-blue-50 border-blue-200 text-blue-600",
        green: "bg-green-50 border-green-200 text-green-600",
        purple: "bg-purple-50 border-purple-200 text-purple-600",
        orange: "bg-orange-50 border-orange-200 text-orange-600",
    }

    return (
        <div className={`${colorClasses[color]} p-4 rounded-xl border`}>
            <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    )
}

const StudentGroup = ({ title, students }) => (
    <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">{title}</h3>
            <span className="text-sm text-gray-500">{students.length} talaba</span>
        </div>
        <div className="space-y-3">
            {students.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{student.name}</h4>
                            <StudentStatusBadge status={student.status} />
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">Davomat: {student.attendance}%</span>
                            <span className="text-xs text-gray-500">Progress: {student.progress}%</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span
                            className={`text-lg font-semibold ${Number.parseFloat(student.grade) >= 4.0
                                ? "text-green-600"
                                : Number.parseFloat(student.grade) >= 3.5
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                        >
                            {student.grade}
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                            <div
                                className={`h-1 rounded-full ${student.progress >= 80 ? "bg-green-600" : student.progress >= 60 ? "bg-yellow-600" : "bg-red-600"
                                    }`}
                                style={{ width: `${student.progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
)

const StudentStatusBadge = ({ status }) => {
    const statusConfig = {
        excellent: { color: "bg-green-100 text-green-600", text: "A'lo" },
        good: { color: "bg-blue-100 text-blue-600", text: "Yaxshi" },
        needs_attention: { color: "bg-red-100 text-red-600", text: "E'tibor" },
    }

    const config = statusConfig[status] || statusConfig.good

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.text}</span>
}

export default MentorDashboard
