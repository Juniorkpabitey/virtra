'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Image from 'next/image'
import { Camera, User, Mail, Phone, Calendar, Save, Shield } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import Footer from '../../components/Footer'

export default function ProfilePage() {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState<number | ''>('')
  const [gender, setGender] = useState('')
  const [contact, setContact] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Fetch user profile
  const loadProfile = async () => {
    try {
      setLoading(true)
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError

      const uid = authData?.user?.id
      if (!uid) {
        setUserId(null)
        setLoading(false)
        return
      }
      setUserId(uid)

      const { data, error } = await supabase
        .from('profiles')
        .select('firstname, lastname, email, avatar_url, age, gender, contact')
        .eq('id', uid)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setFirstname(data.firstname ?? '')
        setLastname(data.lastname ?? '')
        setEmail(data.email ?? authData?.user?.email ?? '')
        setAvatarUrl(data.avatar_url ?? null)
        setAge(data.age ?? '')
        setGender(data.gender ?? '')
        setContact(data.contact ?? '')
      } else {
        setFirstname('')
        setLastname('')
        setEmail(authData?.user?.email ?? '')
        setAvatarUrl(null)
        setAge('')
        setGender('')
        setContact('')
      }
    } catch (err) {
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  // Upload avatar to Supabase Storage
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!event.target.files?.length) throw new Error('No file selected')
      if (!userId) throw new Error('User not logged in')

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `avatar-${userId}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = publicUrlData.publicUrl
      setAvatarUrl(publicUrl)

      // Persist new avatar to DB immediately
      await supabase.from('profiles').upsert({
        id: userId,
        avatar_url: publicUrl,
        updated_at: new Date(),
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload avatar.')
    } finally {
      setUploading(false)
    }
  }

  // Save profile updates
  const handleSave = async () => {
    if (!userId) {
      alert('No user session found.')
      return
    }

    try {
      setSaving(true)
      interface ProfileUpdate {
        id: string
        firstname: string
        lastname: string
        email: string
        avatar_url: string | null
        gender: string
        contact: string
        updated_at: Date
        age: number | null
      }

      const updates: ProfileUpdate = {
        id: userId,
        firstname,
        lastname,
        email,
        avatar_url: avatarUrl ?? null,
        gender,
        contact,
        updated_at: new Date(),
        age: age === '' ? null : Number(age),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) throw error

      await loadProfile()
      alert('Profile updated successfully!')
    } catch (err) {
      console.error('Error saving profile:', err)
      alert('Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="fixed inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-green-600/5"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <Topbar />
        
        <div className="flex flex-1 flex-col lg:flex-row gap-6 px-4 lg:px-8 py-6">
          <Sidebar />
          
          <main className="flex-1">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold">
                      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Profile
                      </span>{' '}
                      Settings
                    </h1>
                    <p className="text-gray-300 text-lg">
                      Manage your personal information and preferences
                    </p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400">Loading your profile...</p>
                  </div>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Avatar Section */}
                  <div className="lg:col-span-1">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                      <div className="text-center space-y-4">
                        <div className="relative mx-auto w-32 h-32">
                          <Image
                            src={avatarUrl || '/default-user.png'}
                            alt="Profile"
                            width={128}
                            height={128}
                            className="rounded-full object-cover border-4 border-white/10"
                          />
                          <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full cursor-pointer hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
                            title="Upload avatar"
                          >
                            {uploading ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                              <Camera className="w-4 h-4" />
                            )}
                            <input
                              id="avatar-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleUpload}
                              disabled={uploading}
                            />
                          </label>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-white">
                            {firstname} {lastname}
                          </h3>
                          <p className="text-gray-400 text-sm">{email}</p>
                        </div>

                        {/* Profile Stats */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">
                              {age || 'N/A'}
                            </p>
                            <p className="text-gray-400 text-xs">Age</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">
                              {gender || 'N/A'}
                            </p>
                            <p className="text-gray-400 text-xs">Gender</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Section */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                      <h2 className="text-xl font-semibold text-white mb-6">Personal Information</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>First Name</span>
                          </label>
                          <input
                            type="text"
                            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            placeholder="Enter your first name"
                          />
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Last Name</span>
                          </label>
                          <input
                            type="text"
                            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            placeholder="Enter your last name"
                          />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Email Address</span>
                          </label>
                          <input
                            type="email"
                            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                          />
                          <p className="text-xs text-gray-400">
                            Changing this will not update your login email.
                          </p>
                        </div>

                        {/* Contact */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>Contact Number</span>
                          </label>
                          <input
                            type="text"
                            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Enter your contact number"
                          />
                        </div>

                        {/* Age */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Age</span>
                          </label>
                          <input
                            type="number"
                            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                            value={age}
                            onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Enter your age"
                          />
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Gender</span>
                          </label>
                          <select
                            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                          >
                            <option value="" className="bg-gray-800">Select Gender</option>
                            <option value="Male" className="bg-gray-800">Male</option>
                            <option value="Female" className="bg-gray-800">Female</option>
                            <option value="Other" className="bg-gray-800">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSave}
                        disabled={saving || uploading}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Security Info */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-300">
                          <p className="font-medium text-blue-400 mb-1">Your data is secure</p>
                          <p>All your personal information is encrypted and stored securely. We never share your data with third parties.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  )
}
