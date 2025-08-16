'use client'

//import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { LogOut, Bell, Settings, User, Search } from 'lucide-react'

export default function Topbar() {
  const [firstname, setFirstname] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch firstname from Supabase profiles table
  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError

      const userId = authData?.user?.id
      if (!userId) {
        setFirstname(null)
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('firstName')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError

      setFirstname(profileData?.firstName || null)
    } catch (err) {
      console.error('Error fetching user profile:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  // Logout function
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      // Clear all data and force redirect
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
        // Force hard redirect to prevent back navigation
        window.location.replace('/login')
      }
    } catch (error) {
      console.error('Error logging out:', error)
      // Force redirect even if there's an error
      if (typeof window !== 'undefined') {
        window.location.replace('/login')
      }
    }
  }

  return (
    <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo + Greeting */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-semibold text-lg">VIRTRA</h1>
              <p className="text-gray-400 text-xs">Healthcare Platform</p>
            </div>
          </div>
          
          {!loading && firstname && (
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm font-medium">
                Welcome back, {firstname}
              </span>
            </div>
          )}
        </div>

        {/* Center: Search (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search doctors, appointments..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 text-sm"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="relative p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all duration-300">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all duration-300">
            <Settings className="h-5 w-5" />
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {firstname ? firstname.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <span className="hidden sm:block text-white text-sm font-medium">
              {firstname || 'User'}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white hover:bg-white/10 hover:border-red-500/50 transition-all duration-300"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Search (if needed) */}
      <div className="lg:hidden mt-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search doctors, appointments..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 text-sm"
          />
        </div>
      </div>
    </div>
  )
}
