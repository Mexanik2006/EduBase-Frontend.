import { Routes, Route } from "react-router-dom"

const StudentLessons = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mening Darslarim</h2>
        <p className="text-gray-600">Sizning darslaringiz va materiallar</p>
    </div>
)

const StudentSchedule = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Jadval</h2>
        <p className="text-gray-600">Sizning darslar jadvali</p>
    </div>
)

const StudentPayments = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">To'lovlar</h2>
        <p className="text-gray-600">Sizning to'lovlaringiz tarixi</p>
    </div>
)

const StudentProfile = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil</h2>
        <p className="text-gray-600">Shaxsiy ma'lumotlaringiz</p>
    </div>
)

const StudentDashboard = () => {
    return (
        <Routes>
            <Route path="/lessons" element={<StudentLessons />} />
            <Route path="/schedule" element={<StudentSchedule />} />
            <Route path="/payments" element={<StudentPayments />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/" element={<StudentLessons />} />
        </Routes>
    )
}

export default StudentDashboard
