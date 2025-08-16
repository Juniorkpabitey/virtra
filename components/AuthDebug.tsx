'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AuthDebug() {
  const [authState, setAuthState] = useState<{ session?: unknown; error?: unknown; event?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('Auth Debug - Session:', session)
        console.log('Auth Debug - Error:', error)
        setAuthState({ session, error })
      } catch (err) {
        console.error('Auth Debug - Exception:', err)
        setAuthState({ error: err })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth Debug - State Change:', event, session)
        setAuthState({ session, event })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div>Loading auth debug...</div>

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(authState, null, 2)}
      </pre>
    </div>
  )
}


