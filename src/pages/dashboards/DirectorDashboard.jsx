import { Routes, Route } from "react-router-dom"
import UserManagement from "../../components/users/UserManagement"

const DirectorStats = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Direktor Statistikasi</h2>
        <p className="text-gray-600">Bu yerda direktor uchun statistik ma'lumotlar bo'ladi</p>
    </div>
)

const DirectorFinance = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Moliya</h2>
        <p className="text-gray-600">Moliyaviy hisobotlar va statistika</p>
    </div>
)

const DirectorReports = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Hisobotlar</h2>
        <p className="text-gray-600">Umumiy hisobotlar va tahlillar</p>
    </div>
)

const DirectorSettings = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sozlamalar</h2>
        <p className="text-gray-600">Tizim sozlamalari</p>
    </div>
)

const DirectorDashboard = () => {
    return (
        <Routes>
            <Route path="/stats" element={<DirectorStats />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/finance" element={<DirectorFinance />} />
            <Route path="/reports" element={<DirectorReports />} />
            <Route path="/settings" element={<DirectorSettings />} />
            <Route path="/" element={<DirectorStats />} />
        </Routes>
    )
}

export default DirectorDashboard
