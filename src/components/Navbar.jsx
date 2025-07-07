import { useState, useRef, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { Menu, Bell, Search, LogOut, User, Settings, ChevronDown } from 'lucide-react'

const Navbar = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="hidden md:block ml-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-4 w-4 transition-colors duration-200 ${searchFocused ? 'text-gray-700' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                placeholder="Qidirish..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="block w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Mobile search button */}
          <button className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-700 font-medium text-sm">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                {/* User info in dropdown */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-400 capitalize mt-1">{user?.role}</p>
                </div>

                {/* Menu items */}
                <div className="py-2">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <User className="h-4 w-4 mr-3 text-gray-500" />
                    Profil
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <Settings className="h-4 w-4 mr-3 text-gray-500" />
                    Sozlamalar
                  </button>
                </div>

                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Chiqish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
