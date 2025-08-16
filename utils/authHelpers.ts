import { supabase } from '@/lib/supabaseClient'
import { redirect } from 'next/navigation'

export const requireAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login') // Forces navigation to login page
  }

  return session
}

export const checkAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export const logoutUser = async () => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut()
    
    // Clear any local storage or session storage
    if (typeof window !== 'undefined') {
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      })
      
      // Force a hard redirect to prevent back navigation
      window.location.replace('/login')
    }
  } catch (error) {
    console.error('Error during logout:', error)
    // Force redirect even if there's an error
    if (typeof window !== 'undefined') {
      window.location.replace('/login')
    }
  }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const refreshSession = async () => {
  const { data: { session }, error } = await supabase.auth.refreshSession()
  if (error) throw error
  return session
}
