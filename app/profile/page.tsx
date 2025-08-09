'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Image from 'next/image'
import { Camera } from 'lucide-react'
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
    <div className="min-h-screen bg-[#f9f9f0] flex flex-col">
      <Topbar />
      <div className="flex flex-1 flex-col md:flex-row gap-4 px-2 md:px-6">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                  <p className="mt-3 text-gray-600">Loading profile...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-40 h-40 mb-4">
                    <Image
                      src={avatarUrl || '/default-user.png'}
                      alt="Profile"
                      width={160}
                      height={160}
                      className="rounded-full object-cover border border-gray-300"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded-full cursor-pointer"
                      title="Upload avatar"
                    >
                      <Camera size={18} />
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
                  {uploading && <p className="text-sm text-gray-500">Uploading avatar...</p>}
                </div>

                <div className="w-full max-w-md mx-auto space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg border border-gray-300"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg border border-gray-300"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-3 rounded-lg border border-gray-300"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Changing this will not update your login email.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg border border-gray-300"
                      value={age}
                      onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select
                      className="w-full p-3 rounded-lg border border-gray-300"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Number</label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg border border-gray-300"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving || uploading}
                    className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
