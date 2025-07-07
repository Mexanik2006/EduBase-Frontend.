import { Routes, Route } from "react-router-dom"

const StudentLessons = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Mening Darslarim</h2>
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Jadval Ko'rish
                </button>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <ProgressCard title="Tugallangan Darslar" value="24" total="36" percentage={67} color="green" />
                <ProgressCard title="Joriy Hafta" value="3" total="4" percentage={75} color="blue" />
                <ProgressCard title="O'rtacha Baho" value="4.2" total="5.0" percentage={84} color="purple" />
            </div>

            {/* Current Lessons */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Joriy Darslar</h3>
                <div className="space-y-4">
                    <StudentLessonCard
                        title="React.js Asoslari"
                        instructor="Alisher Karimov"
                        time="Bugun 10:00 - 12:00"
                        status="available"
                        progress={75}
                        materials={8}
                    />
                    <StudentLessonCard
                        title="Node.js va Express"
                        instructor="Malika Tosheva"
                        time="Ertaga 14:00 - 16:00"
                        status="upcoming"
                        progress={60}
                        materials={5}
                    />
                    <StudentLessonCard
                        title="Database Design"
                        instructor="Bobur Rahimov"
                        time="Dushanba 16:30 - 18:30"
                        status="locked"
                        progress={0}
                        materials={12}
                    />
                </div>
            </div>
        </div>
    </div>
)

const StudentSchedule = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Dars Jadvali</h2>
                <div className="flex space-x-2">
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        Bu Hafta
                    </button>
                    <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        Keyingi Hafta
                    </button>
                </div>
            </div>

            {/* Weekly Schedule */}
            <div className="space-y-4">
                <ScheduleDay
                    day="Dushanba"
                    date="18 Dekabr"
                    lessons={[
                        { time: "10:00 - 12:00", subject: "React.js", instructor: "Alisher Karimov", room: "A-101" },
                        { time: "14:00 - 16:00", subject: "Node.js", instructor: "Malika Tosheva", room: "B-205" },
                    ]}
                />
                <ScheduleDay
                    day="Seshanba"
                    date="19 Dekabr"
                    lessons={[{ time: "16:30 - 18:30", subject: "Database", instructor: "Bobur Rahimov", room: "C-301" }]}
                />
                <ScheduleDay
                    day="Chorshanba"
                    date="20 Dekabr"
                    lessons={[{ time: "10:00 - 12:00", subject: "React.js", instructor: "Alisher Karimov", room: "A-101" }]}
                />
            </div>
        </div>
    </div>
)

const StudentPayments = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">To'lovlar</h2>
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    To'lov Qilish
                </button>
            </div>

            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <PaymentSummaryCard title="Jami To'lov" amount="4,800,000" status="total" />
                <PaymentSummaryCard title="To'langan" amount="3,200,000" status="paid" />
                <PaymentSummaryCard title="Qolgan" amount="1,600,000" status="remaining" />
            </div>

            {/* Payment History */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">To'lovlar Tarixi</h3>
                <div className="space-y-3">
                    <PaymentHistoryItem
                        amount="800,000"
                        date="15 Dekabr 2024"
                        method="Bank kartasi"
                        status="completed"
                        description="Oylik to'lov - Dekabr"
                    />
                    <PaymentHistoryItem
                        amount="800,000"
                        date="15 Noyabr 2024"
                        method="Naqd pul"
                        status="completed"
                        description="Oylik to'lov - Noyabr"
                    />
                    <PaymentHistoryItem
                        amount="800,000"
                        date="15 Oktyabr 2024"
                        method="Bank kartasi"
                        status="completed"
                        description="Oylik to'lov - Oktyabr"
                    />
                </div>
            </div>
        </div>
    </div>
)

const StudentProfile = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Shaxsiy Profil</h2>
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Tahrirlash
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="lg:col-span-2">
                    <div className="space-y-6">
                        <ProfileSection
                            title="Shaxsiy Ma'lumotlar"
                            fields={[
                                { label: "To'liq ism", value: "Alisher Karimov" },
                                { label: "Email", value: "alisher@example.com" },
                                { label: "Telefon", value: "+998 90 123 45 67" },
                                { label: "Tug'ilgan sana", value: "15 Mart 1995" },
                            ]}
                        />
                        <ProfileSection
                            title="Ta'lim Ma'lumotlari"
                            fields={[
                                { label: "Guruh", value: "Frontend Development - A" },
                                { label: "Mentor", value: "Alisher Karimov" },
                                { label: "Boshlangan sana", value: "1 Sentyabr 2024" },
                                { label: "Tugash sanasi", value: "1 Mart 2025" },
                            ]}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div>
                    <div className="space-y-4">
                        <ProfileStatCard title="Davomat" value="95%" color="green" />
                        <ProfileStatCard title="O'rtacha Baho" value="4.2" color="blue" />
                        <ProfileStatCard title="Tugallangan Darslar" value="24/36" color="purple" />
                        <ProfileStatCard title="Sertifikat" value="85%" color="orange" />
                    </div>
                </div>
            </div>
        </div>
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

// Helper Components
const ProgressCard = ({ title, value, total, percentage, color }) => {
    const colorClasses = {
        green: "bg-green-50 border-green-200",
        blue: "bg-blue-50 border-blue-200",
        purple: "bg-purple-50 border-purple-200",
    }

    const progressColors = {
        green: "bg-green-600",
        blue: "bg-blue-600",
        purple: "bg-purple-600",
    }

    return (
        <div className={`${colorClasses[color]} p-4 rounded-xl border`}>
            <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
            <p className="text-2xl font-semibold text-gray-900 mb-2">
                {value}/{total}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${progressColors[color]} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{percentage}%</p>
        </div>
    )
}

const StudentLessonCard = ({ title, instructor, time, status, progress, materials }) => {
    const statusConfig = {
        available: { color: "border-green-500 bg-green-50", text: "Mavjud", button: "bg-green-600 hover:bg-green-700" },
        upcoming: { color: "border-orange-500 bg-orange-50", text: "Kutilmoqda", button: "bg-gray-200 cursor-not-allowed" },
        locked: { color: "border-gray-500 bg-gray-50", text: "Yopiq", button: "bg-gray-200 cursor-not-allowed" },
    }

    return (
        <div className={`border-l-4 pl-4 py-4 rounded-r-lg ${statusConfig[status].color}`}>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{title}</h4>
                    <p className="text-sm text-gray-600">Mentor: {instructor}</p>
                    <p className="text-sm text-gray-600">{time}</p>
                    <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">Progress: {progress}%</span>
                        <span className="text-xs text-gray-500">{materials} material</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {statusConfig[status].text}
                    </span>
                    <button
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors ${statusConfig[status].button}`}
                        disabled={status !== "available"}
                    >
                        {status === "available" ? "Kirish" : "Kutish"}
                    </button>
                </div>
            </div>
        </div>
    )
}

const ScheduleDay = ({ day, date, lessons }) => (
    <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">{day}</h3>
            <span className="text-sm text-gray-500">{date}</span>
        </div>
        {lessons.length > 0 ? (
            <div className="space-y-2">
                {lessons.map((lesson, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                            <p className="font-medium text-gray-900">{lesson.subject}</p>
                            <p className="text-sm text-gray-600">{lesson.instructor}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{lesson.time}</p>
                            <p className="text-xs text-gray-500">{lesson.room}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-sm text-gray-500 italic">Dars yo'q</p>
        )}
    </div>
)

const PaymentSummaryCard = ({ title, amount, status }) => {
    const statusColors = {
        total: "bg-blue-50 border-blue-200 text-blue-600",
        paid: "bg-green-50 border-green-200 text-green-600",
        remaining: "bg-orange-50 border-orange-200 text-orange-600",
    }

    return (
        <div className={`${statusColors[status]} p-4 rounded-xl border`}>
            <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
            <p className="text-2xl font-semibold">{amount} so'm</p>
        </div>
    )
}

const PaymentHistoryItem = ({ amount, date, method, status, description }) => {
    const statusColors = {
        completed: "bg-green-100 text-green-600",
        pending: "bg-yellow-100 text-yellow-600",
        failed: "bg-red-100 text-red-600",
    }

    const statusText = {
        completed: "Tugallangan",
        pending: "Kutilmoqda",
        failed: "Muvaffaqiyatsiz",
    }

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
                <h4 className="font-medium text-gray-900">{description}</h4>
                <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">{date}</span>
                    <span className="text-sm text-gray-600">{method}</span>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-gray-900">{amount} so'm</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                    {statusText[status]}
                </span>
            </div>
        </div>
    )
}

const ProfileSection = ({ title, fields }) => (
    <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
            {fields.map((field, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{field.label}</span>
                    <span className="text-sm font-medium text-gray-900">{field.value}</span>
                </div>
            ))}
        </div>
    </div>
)

const ProfileStatCard = ({ title, value, color }) => {
    const colorClasses = {
        green: "bg-green-50 border-green-200 text-green-600",
        blue: "bg-blue-50 border-blue-200 text-blue-600",
        purple: "bg-purple-50 border-purple-200 text-purple-600",
        orange: "bg-orange-50 border-orange-200 text-orange-600",
    }

    return (
        <div className={`${colorClasses[color]} p-4 rounded-xl border`}>
            <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
            <p className="text-xl font-semibold">{value}</p>
        </div>
    )
}

export default StudentDashboard
