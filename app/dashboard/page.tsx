'use client'

import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import DoctorCard from '../../components/DoctorCard'
import Topbar from '../../components/Topbar'
import Footer from '../../components/Footer'
import { supabase } from '../../lib/supabaseClient'
import { Users, Clock, Star, Activity, Search, Filter } from 'lucide-react'

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
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

          <main className="flex-1 space-y-8">
            {/* Header Section */}
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-3xl lg:text-4xl font-bold">
                    Healthcare{' '}
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Dashboard
                    </span>
                  </h1>
                  <p className="text-gray-300 text-lg">
                    Find and connect with healthcare specialists
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Users className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{doctors.length}</p>
                        <p className="text-sm text-gray-400">Available Doctors</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Clock className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">24/7</p>
                        <p className="text-sm text-gray-400">Support</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Star className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">4.9</p>
                        <p className="text-sm text-gray-400">Avg Rating</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Activity className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">95%</p>
                        <p className="text-sm text-gray-400">Satisfaction</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filter Section */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search doctors by name or speciality..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
                <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300">
                  <Filter className="w-5 h-5" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">
                  Available Specialists
                </h2>
                <p className="text-gray-400">
                  {filteredDoctors.length} of {doctors.length} doctors
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="space-y-4 text-center">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400">Loading healthcare specialists...</p>
                  </div>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-white">No doctors found</h3>
                      <p className="text-gray-400">Try adjusting your search criteria</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredDoctors.map((doc) => (
                    <div key={doc.id} className="group">
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
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  )
}
