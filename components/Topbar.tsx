'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Topbar() {
  const [firstname, setFirstname] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <div className="flex justify-between items-center px-10 py-3 bg-[#f9f9f0] border-b border-gray-200 w-full">
      {/* Left: Logo + Greeting */}
      <div className="flex items-center space-x-3">
        <Image
          src="/logo.png"
          alt="Virtra Logo"
          width={40}
          height={40}
          className="w-10 h-10 object-contain"
        />
        {!loading && firstname && (
          <span className="text-sm md:text-base text-gray-700 font-medium truncate max-w-[150px] sm:max-w-[200px]">
            👋 Welcome, {firstname}
          </span>
        )}
      </div>

      {/* Right: Logout */}
      <div className="flex items-center">
        <button
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-gray-300 transition-colors"
          title="Logout"
        >
          <LogOut size={22} className="text-gray-700" />
        </button>
      </div>
    </div>
  )
}
