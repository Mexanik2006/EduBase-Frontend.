import { Routes, Route } from "react-router-dom"

const AccountantPayments = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">To'lovlar</h2>
        <p className="text-gray-600">Barcha to'lovlar va moliyaviy operatsiyalar</p>
    </div>
)

const AccountantReports = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Moliyaviy Hisobotlar</h2>
        <p className="text-gray-600">Moliyaviy hisobotlar va tahlillar</p>
    </div>
)

const AccountantStudents = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Talabalar</h2>
        <p className="text-gray-600">Talabalar va ularning to'lovlari</p>
    </div>
)

const AccountantDashboard = () => {
    return (
        <Routes>
            <Route path="/payments" element={<AccountantPayments />} />
            <Route path="/reports" element={<AccountantReports />} />
            <Route path="/students" element={<AccountantStudents />} />
            <Route path="/" element={<AccountantPayments />} />
        </Routes>
    )
}

export default AccountantDashboard
