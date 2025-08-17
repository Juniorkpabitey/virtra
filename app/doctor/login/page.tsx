'use client'

import { useState, useEffect, Suspense } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useSearchParams } from 'next/navigation'

import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Stethoscope } from 'lucide-react'

function DoctorLoginForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
    
        if (session) {
          // Check if user is a doctor
          const { data: userData } = await supabase.auth.getUser()
          if (userData?.user) {
            const { data: doctorData } = await supabase
              .from('doctors')
              .select('id')
              .eq('user_id', userData.user.id)
              .single()
            
            if (doctorData) {
              const redirectTo = searchParams.get('redirectTo') || '/doctor/dashboard'
              if (typeof window !== 'undefined') {
                window.location.href = redirectTo
              }
            }
          }
        }
      } catch (error) {
        console.error('Doctor login page - Auth check error:', error)
      }
    }
    checkAuth()
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')



    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })



      if (error) {
        console.error('Doctor login error:', error)
        setError(error.message)
      } else if (data.session) {
        // Verify the user is a doctor
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', data.session.user.id)
          .single()

        if (doctorError || !doctorData) {
          setError('Access denied. This login is for doctors only.')
          await supabase.auth.signOut()
        } else {
          const redirectTo = searchParams.get('redirectTo') || '/doctor/dashboard'
          if (typeof window !== 'undefined') {
            window.location.href = redirectTo
          }
        }
      } else {
        console.error('Doctor login failed - no session returned')
        setError('Login failed. Please try again.')
      }
    } catch (error) {
      console.error('Doctor login exception:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="fixed inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-green-600/10"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-5xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Login Form */}
              <div className="max-w-md mx-auto lg:mx-0">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-white">Doctor Portal</h1>
                        <p className="text-gray-400">Access your medical dashboard</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Sign in to manage your appointments, access Virtra AI, and update your profile.
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-300">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-gray-300">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full pl-10 pr-12 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Additional Links */}
                  <div className="text-center space-y-4">
                    <p className="text-gray-400 text-sm">
                      Don&apos;t have a doctor account?{' '}
                      <a href="/doctor/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Contact support
                      </a>
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                      <div className="h-px bg-white/10 flex-1"></div>
                      <span className="text-gray-400 text-sm">or</span>
                      <div className="h-px bg-white/10 flex-1"></div>
                    </div>
                    <a
                      href="/login"
                      className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <span>Patient Login</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side - Image/Illustration */}
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                          <Stethoscope className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">VIRTRA Doctor Portal</h2>
                          <p className="text-gray-400">Professional Healthcare Management</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-blue-400 font-semibold">📅</span>
                          </div>
                          <div>
                            <h3 className="text-white font-medium">Appointment Management</h3>
                            <p className="text-gray-400 text-sm">View and manage patient appointments</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-purple-400 font-semibold">🤖</span>
                          </div>
                          <div>
                            <h3 className="text-white font-medium">Virtra AI Assistant</h3>
                            <p className="text-gray-400 text-sm">AI-powered medical assistance tools</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-green-400 font-semibold">👤</span>
                          </div>
                          <div>
                            <h3 className="text-white font-medium">Profile Settings</h3>
                            <p className="text-gray-400 text-sm">Manage your professional profile</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default function DoctorLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <DoctorLoginForm />
    </Suspense>
  )
}
