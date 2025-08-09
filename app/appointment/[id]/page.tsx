'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import Image from 'next/image'

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

  if (!doctor) return <p className="p-6">Loading doctor info...</p>

  return (
    <div className="min-h-screen bg-[#f9f9f0] flex flex-col px-6 py-8 md:px-20">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-white p-4 rounded-lg shadow-md text-center">
          <div className="relative w-full h-80">
            <Image
              src={doctor.image_url}
              alt={doctor.name}
              fill
              className="object-cover rounded"
            />
          </div>
          <h2 className="text-xl font-bold mt-4">{doctor.name}</h2>
          <p className="text-gray-500">{doctor.speciality}</p>
          <div className="text-yellow-500 mt-2 text-sm">
            {'★'.repeat(Math.round(doctor.rating || 4))}
          </div>
        </div>

        <div className="flex-1 bg-white p-6 rounded-lg shadow-md space-y-6">
          <h3 className="text-lg font-semibold">Available Slots</h3>
          <div className="flex flex-wrap gap-2">
            {['9:00 AM', '10:00 AM', '11:00 AM'].map((time) => (
              <button
                key={time}
                onClick={() => setSlot(time)}
                className={`border px-4 py-2 rounded-lg text-sm ${
                  slot === time ? 'bg-blue-100 border-blue-400' : ''
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-gray-500">Patients</p>
              <p className="font-semibold">{doctor.patients || '1.4K'}</p>
            </div>
            <div>
              <p className="text-gray-500">Experience</p>
              <p className="font-semibold">{doctor.experience || '5 yr'}</p>
            </div>
            <div>
              <p className="text-gray-500">Rating</p>
              <p className="font-semibold">{doctor.rating || 4.0}</p>
            </div>
          </div>

          <div>
            <label className="text-sm mb-1 block">Leave a message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              rows={4}
              placeholder="E.g. Please confirm my visit, I have a recurring headache."
            />
          </div>

          <button
            onClick={bookAppointment}
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </div>
    </div>
  )
}
