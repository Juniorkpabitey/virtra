'use client'

import { useState, useEffect, Suspense } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

function LoginForm() {
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
        console.log('Login page - Session check:', session)
        if (session) {
          // Redirect to dashboard or the original requested page
          const redirectTo = searchParams.get('redirectTo') || '/dashboard'
          console.log('Login page - Redirecting to:', redirectTo)
          // Use window.location for more reliable redirect
          if (typeof window !== 'undefined') {
            window.location.href = redirectTo
          }
        }
      } catch (error) {
        console.error('Login page - Auth check error:', error)
      }
    }
    checkAuth()
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('Login attempt with email:', email)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Login response - data:', data)
      console.log('Login response - error:', error)

      if (error) {
        console.error('Login error:', error)
        setError(error.message)
      } else if (data.session) {
        console.log('Login successful - session:', data.session)
        // Redirect to dashboard or the original requested page
        const redirectTo = searchParams.get('redirectTo') || '/dashboard'
        console.log('Login successful - redirecting to:', redirectTo)
        // Use window.location for more reliable redirect
        if (typeof window !== 'undefined') {
          window.location.href = redirectTo
        }
      } else {
        console.error('Login failed - no session returned')
        setError('Login failed. Please try again.')
      }
    } catch (error) {
      console.error('Login exception:', error)
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
                    <h1 className="text-3xl lg:text-4xl font-bold">
                      Welcome Back to{' '}
                      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        VIRTRA
                      </span>
                    </h1>
                    <p className="text-base text-gray-300">
                      Sign in to access your personalized healthcare dashboard
                    </p>
                  </div>

                  <form className="space-y-5" onSubmit={handleLogin}>
                    {/* Email Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 text-sm"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-10 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 text-sm"
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-white transition-colors" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400 hover:text-white transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    {/* Login Button */}
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-base hover:shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center border border-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  </form>

                  {/* Additional Links */}
                  <div className="space-y-3 text-center">
                    <p className="text-sm text-gray-400">
                      Don&apos;t have an account?{' '}
                      <a href="/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Create Account
                      </a>
                    </p>
                    <p className="text-sm text-gray-400">
                      <a href="/doctor/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Login as Doctor
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div className="relative">
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl w-fit">
                  <div className="relative group">
                    <Image
                      src="/doctor.jpg"
                      width={400}
                      height={400}
                      alt="Healthcare Professional"
                      className="rounded-2xl w-full h-auto max-w-sm shadow-lg group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Status indicators */}
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-600"></div>
                  </div>
                  
                  {/* Floating info cards */}
                  <div className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white font-medium">Secure Login</span>
                    </div>
                  </div>
                  
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white font-medium">HIPAA Compliant</span>
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

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
