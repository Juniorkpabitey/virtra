'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import Image from 'next/image'
import { Star, Clock, Users, Calendar, MessageCircle, ArrowLeft, CheckCircle } from 'lucide-react'

// Type definition for Doctor
interface Doctor {
  id: string
  name: string
  speciality: string
  rating: number
  experience: string
  patients: string
  image_url: string
}

export default function AppointmentPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [message, setMessage] = useState<string>('')
  const [slot, setSlot] = useState<string>('9:00 AM')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!params?.id) return

      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Doctor fetch error:', error)
      } else {
        setDoctor(data)
      }
    }

    fetchDoctor()
  }, [params?.id])

  const bookAppointment = async () => {
    if (!doctor) return
    setLoading(true)

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData?.user?.id) {
      alert('User not authenticated')
      setLoading(false)
      return
    }

    const userId = userData.user.id

    const { error } = await supabase.from('appointments').insert({
      user_id: userId,
      doctor_id: doctor.id,
      slot,
      message,
    })

    setLoading(false)
    if (error) {
      alert(`❌ ${error.message}`)
      return
    }

    router.push('/appointment/confirmation')
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading doctor information...</p>
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
        {/* Header */}
        <div className="px-4 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="px-4 lg:px-8 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Doctor Profile Card */}
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                  <div className="text-center space-y-4">
                                         {/* Doctor Image */}
                     <div className="relative mx-auto w-full max-w-80 h-80 rounded-2xl overflow-hidden">
                       <Image
                         src={doctor.image_url}
                         alt={doctor.name}
                         fill
                         className="object-cover object-center"
                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                       
                       {/* Rating Badge */}
                       <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                         <Star className="w-3 h-3 text-yellow-400 fill-current" />
                         <span className="text-white text-xs font-medium">{doctor.rating}</span>
                       </div>
                     </div>

                    {/* Doctor Info */}
                    <div className="space-y-2">
                      <h1 className="text-2xl font-bold text-white">Dr. {doctor.name}</h1>
                      <p className="text-blue-400 font-medium">{doctor.speciality}</p>
                      
                      {/* Rating Stars */}
                      <div className="flex items-center justify-center space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(doctor.rating)
                                ? 'text-yellow-400 fill-current'
                                : i < doctor.rating
                                ? 'text-yellow-400 fill-current opacity-60'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                        <span className="text-gray-400 text-sm ml-2">({doctor.rating})</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
                          <Users className="w-4 h-4" />
                        </div>
                        <p className="text-2xl font-bold text-white">{doctor.patients || '1.4K'}</p>
                        <p className="text-gray-400 text-xs">Patients</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
                          <Clock className="w-4 h-4" />
                        </div>
                        <p className="text-2xl font-bold text-white">{doctor.experience || '5'}</p>
                        <p className="text-gray-400 text-xs">Years</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <p className="text-2xl font-bold text-white">24/7</p>
                        <p className="text-gray-400 text-xs">Available</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Book Your Appointment</h2>
                  
                  {/* Time Slots */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <h3 className="text-white font-medium">Select Time Slot</h3>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time) => (
                        <button
                          key={time}
                          onClick={() => setSlot(time)}
                          className={`p-3 rounded-xl border transition-all duration-300 text-sm font-medium ${
                            slot === time
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500/50 text-white shadow-lg shadow-blue-500/25'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-4 pt-6">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5 text-blue-400" />
                      <h3 className="text-white font-medium">Additional Message (Optional)</h3>
                    </div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 resize-none"
                      rows={4}
                      placeholder="Please describe your symptoms or any specific concerns you'd like to discuss..."
                    />
                  </div>

                  {/* Booking Button */}
                  <button
                    onClick={bookAppointment}
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 border border-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Booking Appointment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Book Appointment</span>
                      </>
                    )}
                  </button>

                  {/* Additional Info */}
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm text-gray-300">
                        <p className="font-medium text-blue-400 mb-1">Appointment Details</p>
                        <p>• Consultation duration: 30 minutes</p>
                        <p>• Video call link will be sent 15 minutes before</p>
                        <p>• You can reschedule up to 2 hours before</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
