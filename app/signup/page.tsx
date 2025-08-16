'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import Image from 'next/image'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, UserCheck } from 'lucide-react'

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { firstname, lastname, email, password, confirmPassword } = formData

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    // Step 1: Create Auth Account WITH metadata
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstname,
          lastname,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const userId = signUpData.user?.id

    // Step 2: Insert into 'profiles' table (for structured querying)
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: userId,
        firstName: firstname,
        lastName: lastname,
        email,
      },
    ])

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    router.push('/login')
    setLoading(false)
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
              
              {/* Signup Form */}
              <div className="max-w-md mx-auto lg:mx-0">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h1 className="text-3xl lg:text-4xl font-bold">
                      Join{' '}
                      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        VIRTRA
                      </span>
                    </h1>
                    <p className="text-base text-gray-300">
                      Create your account and start your healthcare journey
                    </p>
                  </div>

                  <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* First Name Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">First Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            name="firstname"
                            placeholder="First Name"
                            className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 text-sm"
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      {/* Last Name Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Last Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserCheck className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            name="lastname"
                            placeholder="Last Name"
                            className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 text-sm"
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 text-sm"
                          onChange={handleChange}
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
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="w-full pl-10 pr-10 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 text-sm"
                          onChange={handleChange}
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

                    {/* Confirm Password Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="w-full pl-10 pr-10 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 text-sm"
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
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

                    {/* Signup Button */}
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-base hover:shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center border border-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  </form>

                  {/* Additional Links */}
                  <div className="space-y-3 text-center">
                    <p className="text-sm text-gray-400">
                      Already have an account?{' '}
                      <a href="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Sign In
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
                      alt="Healthcare Platform"
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
                      <span className="text-xs text-white font-medium">Secure Signup</span>
                    </div>
                  </div>
                  
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white font-medium">Free Trial</span>
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
