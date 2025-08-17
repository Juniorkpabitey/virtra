'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'
import { Bell, User, LogOut, Settings, Search, Menu } from 'lucide-react'

export default function DoctorTopbar() {
  const router = useRouter()
  const [doctorName, setDoctorName] = useState('')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [notifications] = useState(3)

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: doctorData } = await supabase
            .from('doctors')
            .select('name')
            .eq('user_id', user.id)
            .single()
          
          if (doctorData) {
            setDoctorName(doctorData.name)
          }
        }
      } catch (error) {
        console.error('Error fetching doctor profile:', error)
      }
    }

    fetchDoctorProfile()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/doctor/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Search */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="block w-full pl-10 pr-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
            />
          </div>
        </div>

        {/* Right Side - Notifications & Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all duration-300">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium">
                Dr. {doctorName || 'Doctor'}
              </span>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-white font-medium">Dr. {doctorName || 'Doctor'}</p>
                    <p className="text-gray-400 text-sm">Medical Professional</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      router.push('/doctor/profile')
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      handleLogout()
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden mt-4">
        <button className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all duration-300">
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
