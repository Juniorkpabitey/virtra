'use client'

import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import DoctorCard from '../../components/DoctorCard'
import Topbar from '../../components/Topbar'
import Footer from '../../components/Footer'
import { supabase } from '../../lib/supabaseClient'

// ✅ Define a Doctor type
type Doctor = {
  id: string
  name: string
  speciality: string
  rating: number
  experience?: string
  patients?: string
  image_url: string
}

export default function Dashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from('doctors').select('*')

      if (error) {
        console.error('Error fetching doctors:', error)
      } else {
        setDoctors((data as Doctor[]) || [])
      }

      setLoading(false)
    }

    fetchDoctors()
  }, [])

  return (
    <div className="min-h-screen bg-[#f9f9f0] flex flex-col">
      <Topbar />

      <div className="flex flex-1 flex-col md:flex-row gap-4 px-2 md:px-6">
        <Sidebar />

        <main className="flex-1 px-4 py-8">
          {loading ? (
            <p className="text-center text-gray-500">Loading doctors...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {doctors.map((doc) => (
                <div key={doc.id} className="w-full max-w-sm mx-auto">
                  <DoctorCard
                    id={doc.id}
                    name={doc.name}
                    speciality={doc.speciality}
                    image={doc.image_url}
                    rating={doc.rating}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
