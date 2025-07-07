import { Routes, Route } from "react-router-dom"
import GroupManagement from "../../components/groups/GroupManagement"
import { DollarSign, FileText, Users, CreditCard, TrendingUp, Calendar } from 'lucide-react'

const AccountantPayments = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">To'lovlar</h2>
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Yangi To'lov
                </button>
            </div>

            {/* Payment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <PaymentStatCard title="Bugungi To'lovlar" value="5,200,000" unit="so'm" color="green" />
                <PaymentStatCard title="Haftalik To'lovlar" value="28,500,000" unit="so'm" color="blue" />
                <PaymentStatCard title="Oylik To'lovlar" value="125,000,000" unit="so'm" color="purple" />
                <PaymentStatCard title="Qarzdorlik" value="2,800,000" unit="so'm" color="red" />
            </div>

            {/* Recent Payments */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">So'nggi To'lovlar</h3>
                <div className="space-y-3">
                    <PaymentItem
                        student="Alisher Karimov"
                        amount="800,000"
                        date="Bugun 14:30"
                        status="completed"
                        method="Naqd"
                    />
                    <PaymentItem
                        student="Malika Tosheva"
                        amount="800,000"
                        date="Bugun 12:15"
                        status="completed"
                        method="Karta"
                    />
                    <PaymentItem
                        student="Bobur Rahimov"
                        amount="400,000"
                        date="Kecha 16:45"
                        status="pending"
                        method="Bank"
                    />
                </div>
            </div>
        </div>
    </div>
)

const AccountantReports = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Moliyaviy Hisobotlar</h2>
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Hisobot Yaratish
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FinancialReportCard
                    title="Oylik Moliyaviy Hisobot"
                    description="Daromad, xarajat va foyda tahlili"
                    period="Dekabr 2024"
                    status="ready"
                />
                <FinancialReportCard
                    title="To'lovlar Hisoboti"
                    description="Talabalar to'lovlari va qarzdorliklar"
                    period="Dekabr 2024"
                    status="processing"
                />
                <FinancialReportCard
                    title="Xarajatlar Tahlili"
                    description="Tizim xarajatlari va byudjet tahlili"
                    period="Dekabr 2024"
                    status="ready"
                />
                <FinancialReportCard
                    title="Daromad Prognozi"
                    description="Kelgusi oy uchun daromad prognozi"
                    period="Yanvar 2025"
                    status="draft"
                />
            </div>
        </div>
    </div>
)

const AccountantStudents = () => (
    <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Talabalar va To'lovlar</h2>
                <div className="flex space-x-2">
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        Export
                    </button>
                    <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        Filter
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <StudentPaymentCard
                    name="Alisher Karimov"
                    group="Frontend Development"
                    totalPaid="4,800,000"
                    remaining="0"
                    status="paid"
                    lastPayment="15 Dekabr"
                />
                <StudentPaymentCard
                    name="Malika Tosheva"
                    group="Backend Development"
                    totalPaid="3,200,000"
                    remaining="800,000"
                    status="partial"
                    lastPayment="10 Dekabr"
                />
                <StudentPaymentCard
                    name="Bobur Rahimov"
                    group="Mobile Development"
                    totalPaid="1,600,000"
                    remaining="2,400,000"
                    status="overdue"
                    lastPayment="25 Noyabr"
                />
            </div>
        </div>
    </div>
)

const AccountantDashboard = () => {
    return (
        <Routes>
            <Route path="/payments" element={<AccountantPayments />} />
            <Route path="/reports" element={<AccountantReports />} />
            <Route path="/students" element={<AccountantStudents />} />
            <Route path="/groups" element={<GroupManagement />} />
            <Route path="/" element={<AccountantPayments />} />
        </Routes>
    )
}

// Helper Components
const PaymentStatCard = ({ title, value, unit, color }) => {
    const colorClasses = {
        green: "bg-green-50 border-green-200 text-green-600",
        blue: "bg-blue-50 border-blue-200 text-blue-600",
        purple: "bg-purple-50 border-purple-200 text-purple-600",
        red: "bg-red-50 border-red-200 text-red-600",
    }

    return (
        <div className={`${colorClasses[color]} p-4 rounded-xl border`}>
            <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
            <p className="text-xl font-semibold">
                {value} {unit}
            </p>
        </div>
    )
}

const PaymentItem = ({ student, amount, date, status, method }) => {
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
                <h4 className="font-medium text-gray-900">{student}</h4>
                <p className="text-sm text-gray-600">{date}</p>
            </div>
            <div className="text-right mr-4">
                <p className="font-semibold text-gray-900">{amount} so'm</p>
                <p className="text-sm text-gray-600">{method}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                {statusText[status]}
            </span>
        </div>
    )
}

const FinancialReportCard = ({ title, description, period, status }) => {
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

const StudentPaymentCard = ({ name, group, totalPaid, remaining, status, lastPayment }) => {
    const statusColors = {
        paid: "bg-green-100 text-green-600",
        partial: "bg-yellow-100 text-yellow-600",
        overdue: "bg-red-100 text-red-600",
    }

    const statusText = {
        paid: "To'langan",
        partial: "Qisman",
        overdue: "Muddati o'tgan",
    }

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                            {statusText[status]}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">{group}</p>
                    <p className="text-xs text-gray-500 mt-1">Oxirgi to'lov: {lastPayment}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-600">To'langan: {totalPaid} so'm</p>
                    <p className="text-sm text-gray-600">Qolgan: {remaining} so'm</p>
                    <button className="mt-2 bg-black text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                        Batafsil
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AccountantDashboard
