"use client"

import { useState, useMemo } from "react"
import { Routes, Route } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import DashboardHome from "./DashboardHome"
import ProtectedRoute from "./ProtectedRoute"

// Role-based sahifalar
import DirectorDashboard from "../pages/dashboards/DirectorDashboard"
import ManagerDashboard from "../pages/dashboards/ManagerDashboard"
import MentorDashboard from "../pages/dashboards/MentorDashboard"
import AccountantDashboard from "../pages/dashboards/AccountantDashboard"
import ReceptionDashboard from "../pages/dashboards/ReceptionDashboard"
import StudentDashboard from "../pages/dashboards/StudentDashboard"

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user } = useAuth()

    // Memoize the dashboard layout to prevent unnecessary re-renders
    const dashboardLayout = useMemo(
        () => (
            <div className="flex h-screen bg-gray-100">
                {/* Sidebar */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Navbar */}
                    <Navbar setSidebarOpen={setSidebarOpen} />

                    {/* Page content */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                        <Routes>
                            <Route path="/" element={<DashboardHome />} />

                            {/* Director sahifalari */}
                            <Route
                                path="/director/*"
                                element={
                                    <ProtectedRoute allowedRoles={["director"]}>
                                        <DirectorDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Manager sahifalari */}
                            <Route
                                path="/manager/*"
                                element={
                                    <ProtectedRoute allowedRoles={["director", "manager"]}>
                                        <ManagerDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Mentor sahifalari */}
                            <Route
                                path="/mentor/*"
                                element={
                                    <ProtectedRoute allowedRoles={["director", "manager", "mentor"]}>
                                        <MentorDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Accountant sahifalari */}
                            <Route
                                path="/accountant/*"
                                element={
                                    <ProtectedRoute allowedRoles={["director", "accountant"]}>
                                        <AccountantDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Reception sahifalari */}
                            <Route
                                path="/reception/*"
                                element={
                                    <ProtectedRoute allowedRoles={["director", "manager", "reception"]}>
                                        <ReceptionDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Student sahifalari */}
                            <Route
                                path="/student/*"
                                element={
                                    <ProtectedRoute allowedRoles={["student"]}>
                                        <StudentDashboard />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </div>
        ),
        [sidebarOpen],
    )

    return dashboardLayout
}

export default Dashboard
