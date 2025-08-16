'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { X, Menu, User, Calendar, Heart, Brain, Settings, Home } from 'lucide-react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const menus = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Doctors', path: '/doctors', icon: User },
    { label: 'Appointments', path: '/appointments', icon: Calendar },
    { label: 'Health Bits', path: '/health-bits', icon: Heart },
    { label: 'Virtra AI', path: '/virtra-ai', icon: Brain },
    { label: 'Profile', path: '/profile', icon: Settings },
  ]

  const handleNavigate = (path: string) => {
    router.push(path)
    setIsOpen(false) // close sidebar on mobile after navigation
  }

  return (
    <>
      {/* Hamburger menu for mobile */}
      <div className="lg:hidden px-4 py-2">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar overlay on mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-black/95 backdrop-blur-xl border-r border-white/10 shadow-2xl z-50 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:translate-x-0 lg:w-72 lg:h-auto lg:block lg:bg-transparent lg:border-r-0 lg:shadow-none`}
      >
        {/* Close button (mobile only) */}
        <div className="flex justify-end lg:hidden p-4">
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-6 space-y-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 pb-6 border-b border-white/10">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">VIRTRA</h2>
              <p className="text-gray-400 text-xs">Healthcare Platform</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menus.map((menu, index) => {
              const Icon = menu.icon
              const isActive = pathname === menu.path
              
              return (
                <button
                  key={index}
                  onClick={() => handleNavigate(menu.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-400'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                  <span>{menu.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Quick Stats */}
          <div className="pt-6 border-t border-white/10">
            <h3 className="text-gray-400 text-sm font-medium mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <span className="text-gray-300 text-sm">Active Appointments</span>
                <span className="text-blue-400 font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <span className="text-gray-300 text-sm">Health Score</span>
                <span className="text-green-400 font-semibold">92%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
