import { Routes, Route } from "react-router-dom"
import UserManagement from "../../components/users/UserManagement"

const ManagerGroups = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Guruhlar</h2>
        <p className="text-gray-600">Barcha guruhlar ro'yxati va boshqaruv</p>
    </div>
)

const ManagerMentors = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mentorlar</h2>
        <p className="text-gray-600">Mentorlar ro'yxati va boshqaruv</p>
    </div>
)

const ManagerSchedule = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Jadval</h2>
        <p className="text-gray-600">Darslar jadvali va boshqaruv</p>
    </div>
)

const ManagerReports = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Hisobotlar</h2>
        <p className="text-gray-600">Menejer hisobotlari</p>
    </div>
)

const ManagerDashboard = () => {
    return (
        <Routes>
            <Route path="/groups" element={<ManagerGroups />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/mentors" element={<ManagerMentors />} />
            <Route path="/schedule" element={<ManagerSchedule />} />
            <Route path="/reports" element={<ManagerReports />} />
            <Route path="/" element={<ManagerGroups />} />
        </Routes>
    )
}

export default ManagerDashboard
