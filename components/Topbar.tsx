'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useUserStore } from '../stores/userStore'

export default function Topbar() {
  const { firstname, setFirstname } = useUserStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data?.session?.user

      if (user?.user_metadata?.firstname) {
        setFirstname(user.user_metadata.firstname)
      }

      setLoading(false)
    }

    fetchUser()
  }, [setFirstname])

  return (
    <div className="flex justify-between items-center px-4 py-4 bg-[#f9f9f0] flex-wrap">
      {/* Greeting Left */}
      <div className="text-sm text-gray-700 font-medium mb-2 md:mb-0">
        {!loading && firstname && <span>👋 Hi, {firstname}</span>}
      </div>

      {/* Logo and Search Right */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search health professionals"
          className="px-4 py-2 rounded-full bg-gray-200 text-sm focus:outline-none w-60 sm:w-80"
        />
        <Image src="/logo.png" alt="Virtra Logo" width={45} height={45} />
      </div>
    </div>
  )
}
