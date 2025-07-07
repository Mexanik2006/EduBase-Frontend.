import { Routes, Route } from "react-router-dom"
import ReceptionStudents from "../pageofreception/ReceptionStudents"
import GroupManagement from "../../components/groups/GroupManagement"
import { UserPlus, Users, Phone, CheckCircle, Clock } from "lucide-react"

const ReceptionAdmission = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Qabul</h2>
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Yangi Ariza
                </button>
            </div>

            {/* Admission Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <AdmissionStatCard title="Bugungi Arizalar" value="12" icon={UserPlus} color="blue" />
                <AdmissionStatCard title="Kutilayotgan" value="8" icon={Clock} color="yellow" />
                <AdmissionStatCard title="Tasdiqlangan" value="45" icon={CheckCircle} color="green" />
                <AdmissionStatCard title="Jami Talabalar" value="156" icon={Users} color="purple" />
            </div>

            {/* Recent Applications */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">So'nggi Arizalar</h3>
                <div className="space-y-3">
                    <ApplicationItem
                        name="Alisher Karimov"
                        phone="+998 90 123 45 67"
                        course="Frontend Development"
                        date="Bugun 14:30"
                        status="pending"
                    />
                    <ApplicationItem
                        name="Malika Tosheva"
                        phone="+998 91 234 56 78"
                        course="Backend Development"
                        date="Bugun 12:15"
                        status="approved"
                    />
                    <ApplicationItem
                        name="Bobur Rahimov"
                        phone="+998 93 345 67 89"
                        course="Mobile Development"
                        date="Kecha 16:45"
                        status="interview"
                    />
                </div>
            </div>
        </div>
    </div>
)

const ReceptionDashboard = () => {
    return (
        <Routes>
            <Route path="/admission" element={<ReceptionAdmission />} />
            <Route path="/students" element={<ReceptionStudents />} />
            <Route path="/groups" element={<GroupManagement />} />
            <Route path="/" element={<ReceptionAdmission />} />
        </Routes>
    )
}

// Helper Components
const AdmissionStatCard = ({ title, value, icon: Icon, color }) => {
    const colorClasses = {
        blue: "bg-blue-50 border-blue-200 text-blue-600",
        yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
        green: "bg-green-50 border-green-200 text-green-600",
        purple: "bg-purple-50 border-purple-200 text-purple-600",
    }

    return (
        <div className={`${colorClasses[color]} p-4 rounded-xl border`}>
            <div className="flex items-center justify-between mb-2">
                <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    )
}

const ApplicationItem = ({ name, phone, course, date, status }) => {
    const statusColors = {
        pending: "bg-yellow-100 text-yellow-600",
        approved: "bg-green-100 text-green-600",
        rejected: "bg-red-100 text-red-600",
        interview: "bg-blue-100 text-blue-600",
    }

    const statusText = {
        pending: "Kutilmoqda",
        approved: "Tasdiqlangan",
        rejected: "Rad etilgan",
        interview: "Suhbat",
    }

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
                <h4 className="font-medium text-gray-900">{name}</h4>
                <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center">
                        <Phone className="h-3 w-3 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-600">{phone}</span>
                    </div>
                    <span className="text-sm text-gray-600">{course}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{date}</p>
            </div>
            <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                    {statusText[status]}
                </span>
                <button className="bg-black text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                    Ko'rish
                </button>
            </div>
        </div>
    )
}

export default ReceptionDashboard
