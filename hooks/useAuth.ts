'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { User, Session } from '@supabase/supabase-js'
import { logoutUser } from '@/utils/authHelpers'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Handle sign out event
        if (event === 'SIGNED_OUT') {
          // Clear any cached data
          if (typeof window !== 'undefined') {
            localStorage.clear()
            sessionStorage.clear()
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    setLoading(true)
    await logoutUser()
  }

  const isAuthenticated = !!session

  return {
    user,
    session,
    loading,
    isAuthenticated,
    logout,
  }
}
