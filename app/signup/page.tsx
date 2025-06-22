'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          firstname: formData.firstname,
          lastname: formData.lastname,
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/login')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f9f9f0] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-10">
        <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
          <Image src="/hero_img.png" alt="Doctor" width={400} height={400} className="rounded-lg" />
        </div>

        <div className="w-full md:w-1/2 max-w-md space-y-6">
          <h2 className="text-3xl font-semibold">Create an account</h2>
          <p className="text-sm text-gray-600">Enter your details below</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              name="firstname"
              placeholder="Firstname"
              className="w-full border-b border-gray-400 focus:outline-none py-1 bg-transparent"
              onChange={handleChange}
              required
            />
            <input
              name="lastname"
              placeholder="Lastname"
              className="w-full border-b border-gray-400 focus:outline-none py-1 bg-transparent"
              onChange={handleChange}
              required
            />
            <input
              name="email"
              placeholder="Email or Phone"
              className="w-full border-b border-gray-400 focus:outline-none py-1 bg-transparent"
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full border-b border-gray-400 focus:outline-none py-1 bg-transparent"
              onChange={handleChange}
              required
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="w-full border-b border-gray-400 focus:outline-none py-1 bg-transparent"
              onChange={handleChange}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gray-300 text-black py-2 rounded-md font-semibold hover:bg-gray-400 transition"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-center">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-black hover:underline">
              Log in
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
