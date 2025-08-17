'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import DoctorSidebar from '../../../components/DoctorSidebar'
import DoctorTopbar from '../../../components/DoctorTopbar'
import Footer from '../../../components/Footer'
import { User, Camera, Save, Edit, Star, Settings, Shield, Bell, Globe } from 'lucide-react'

type DoctorProfile = {
  id: string
  name: string
  email: string
  speciality: string
  experience: string
  patients: string
  rating: number
  image_url: string
  bio: string
  phone: string
  location: string
  education: string
  certifications: string[]
  languages: string[]
  consultation_fee: number
  availability: string
}

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    speciality: '',
    experience: '',
    bio: '',
    phone: '',
    location: '',
    education: '',
    consultation_fee: 0,
    availability: ''
  })

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setLoading(true)
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.error('No authenticated user')
          return
        }

        // Get doctor profile
        const { data: doctorData, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error('Error fetching doctor profile:', error)
        } else if (doctorData) {
          setProfile(doctorData)
          setAvatarUrl(doctorData.image_url)
          setFormData({
            name: doctorData.name || '',
            speciality: doctorData.speciality || '',
            experience: doctorData.experience || '',
            bio: doctorData.bio || '',
            phone: doctorData.phone || '',
            location: doctorData.location || '',
            education: doctorData.education || '',
            consultation_fee: doctorData.consultation_fee || 0,
            availability: doctorData.availability || ''
          })
        }
      } catch (error) {
        console.error('Error fetching doctor profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorProfile()
  }, [])

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `doctor-avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrl)

      // Update profile with new avatar URL
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('doctors')
          .update({ image_url: publicUrl })
          .eq('user_id', user.id)
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('doctors')
        .update({
          name: formData.name,
          speciality: formData.speciality,
          experience: formData.experience,
          bio: formData.bio,
          phone: formData.phone,
          location: formData.location,
          education: formData.education,
          consultation_fee: formData.consultation_fee,
          availability: formData.availability
        })
        .eq('user_id', user.id)

      if (error) {
        console.error('Error updating profile:', error)
        return
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...formData } : null)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="fixed inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-green-600/5"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <DoctorTopbar />

        <div className="flex">
          <DoctorSidebar />

          <main className="flex-1 p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                  <p className="text-gray-400">Manage your professional profile and preferences</p>
                </div>
                <div className="flex items-center space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-white transition-colors flex items-center space-x-2"
                      >
                        {saving ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>Save Changes</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Basic Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                          placeholder="Dr. John Doe"
                        />
                      ) : (
                        <p className="text-white font-medium">{profile?.name || 'Not specified'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Speciality
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.speciality}
                          onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                          placeholder="Cardiology"
                        />
                      ) : (
                        <p className="text-white font-medium">{profile?.speciality || 'Not specified'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Experience
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                          placeholder="15+ years"
                        />
                      ) : (
                        <p className="text-white font-medium">{profile?.experience || 'Not specified'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                          placeholder="+1 (555) 123-4567"
                        />
                      ) : (
                        <p className="text-white font-medium">{profile?.phone || 'Not specified'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Location
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                          placeholder="New York, NY"
                        />
                      ) : (
                        <p className="text-white font-medium">{profile?.location || 'Not specified'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Consultation Fee ($)
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.consultation_fee}
                          onChange={(e) => setFormData({ ...formData, consultation_fee: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                          placeholder="150"
                        />
                      ) : (
                        <p className="text-white font-medium">${profile?.consultation_fee || 0}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Professional Bio</h3>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      placeholder="Tell patients about your expertise, experience, and approach to healthcare..."
                    />
                  ) : (
                    <p className="text-gray-300">{profile?.bio || 'No bio available'}</p>
                  )}
                </div>

                {/* Education */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Education & Certifications</h3>
                  {isEditing ? (
                    <textarea
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      placeholder="Medical School, Residency, Fellowships, Board Certifications..."
                    />
                  ) : (
                    <p className="text-gray-300">{profile?.education || 'No education information available'}</p>
                  )}
                </div>

                {/* Availability */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Availability</h3>
                  {isEditing ? (
                    <textarea
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      placeholder="Monday-Friday: 9 AM - 5 PM, Saturday: 9 AM - 1 PM..."
                    />
                  ) : (
                    <p className="text-gray-300">{profile?.availability || 'No availability information available'}</p>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Avatar */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-16 h-16 text-white" />
                        )}
                      </div>
                      {isEditing && (
                        <label className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                          <Camera className="w-5 h-5 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    {uploading && (
                      <p className="text-blue-400 text-sm">Uploading...</p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Profile Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Total Patients</span>
                      <span className="text-white font-semibold">{profile?.patients || '0'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold">{profile?.rating || '0'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Experience</span>
                      <span className="text-white font-semibold">{profile?.experience || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-300">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Account Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-300">
                      <Bell className="w-4 h-4" />
                      <span className="text-sm">Notification Preferences</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-300">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Privacy Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-300">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">Language Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  )
}
