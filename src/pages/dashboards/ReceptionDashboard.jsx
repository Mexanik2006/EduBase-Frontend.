import { Routes, Route } from "react-router-dom"

const ReceptionAdmission = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Qabul</h2>
        <p className="text-gray-600">Yangi talabalarni qabul qilish</p>
    </div>
)

const ReceptionStudents = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Talabalar</h2>
        <p className="text-gray-600">Barcha talabalar ro'yxati</p>
    </div>
)

const ReceptionGroups = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Guruhlar</h2>
        <p className="text-gray-600">Guruhlar ro'yxati va ma'lumotlar</p>
    </div>
)

const ReceptionDashboard = () => {
    return (
        <Routes>
            <Route path="/admission" element={<ReceptionAdmission />} />
            <Route path="/students" element={<ReceptionStudents />} />
            <Route path="/groups" element={<ReceptionGroups />} />
            <Route path="/" element={<ReceptionAdmission />} />
        </Routes>
    )
}

export default ReceptionDashboard
