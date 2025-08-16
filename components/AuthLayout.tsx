'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Shield } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('AuthLayout - Session check:', session)
        
        if (!session) {
          setIsAuthenticated(false)
          // Clear any cached data
          if (typeof window !== 'undefined') {
            localStorage.clear()
            sessionStorage.clear()
          }
          router.replace('/login')
        } else {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('AuthLayout - Auth check error:', error)
        setIsAuthenticated(false)
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthLayout - Auth state change:', event, session)
        if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false)
          // Clear all data and redirect
          if (typeof window !== 'undefined') {
            localStorage.clear()
            sessionStorage.clear()
            // Force hard redirect to prevent back navigation
            window.location.replace('/login')
          }
        } else if (session) {
          setIsAuthenticated(true)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Access Denied</h2>
            <p className="text-gray-400">
              You need to be authenticated to access this page. Please sign in to continue.
            </p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  // Render authenticated content
  return <>{children}</>
}
