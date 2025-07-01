import { Routes, Route } from "react-router-dom"

const MentorGroups = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mening Guruhlarim</h2>
        <p className="text-gray-600">Siz dars beradigan guruhlar</p>
    </div>
)

const MentorLessons = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Darslar</h2>
        <p className="text-gray-600">Darslar rejasi va materiallar</p>
    </div>
)

const MentorStudents = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Talabalar</h2>
        <p className="text-gray-600">Sizning talabalaringiz ro'yxati</p>
    </div>
)

const MentorSchedule = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Jadval</h2>
        <p className="text-gray-600">Sizning darslar jadvali</p>
    </div>
)

const MentorDashboard = () => {
    return (
        <Routes>
            <Route path="/groups" element={<MentorGroups />} />
            <Route path="/lessons" element={<MentorLessons />} />
            <Route path="/students" element={<MentorStudents />} />
            <Route path="/schedule" element={<MentorSchedule />} />
            <Route path="/" element={<MentorGroups />} />
        </Routes>
    )
}

export default MentorDashboard
