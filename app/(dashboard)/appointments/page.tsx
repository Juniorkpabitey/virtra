'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'

// Type for the doctor details
type Doctor = {
  name: string
  speciality: string
}

// Type for the appointment including doctor
type Appointment = {
  id: string
  slot: string
  message: string
  created_at: string
  doctor: Doctor | null
}

export default function UserAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data: sessionData } = await supabase.auth.getUser()
      const userId = sessionData?.user?.id
      if (!userId) return

      // Fetch appointments with doctor info
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          slot,
          message,
          created_at,
          doctor:doctor_id (
            name,
            speciality
          )
        `)
        .eq('user_id', userId)

      if (error) {
        console.error('Fetch error:', error)
        setLoading(false)
        return
      }

      // Sanitize and parse doctor relation
      type RawAppointment = {
        id: string
        slot: string
        message: string
        created_at: string
        doctor: Doctor[] | Doctor | null
      }

      const sanitized: Appointment[] = (data || []).map((appt: RawAppointment) => ({
        id: appt.id,
        slot: appt.slot,
        message: appt.message,
        created_at: appt.created_at,
        doctor: Array.isArray(appt.doctor) ? appt.doctor[0] : appt.doctor ?? null,
      }))

      setAppointments(sanitized)
      setLoading(false)
    }

    fetchAppointments()
  }, [])

  return (
    <div className="min-h-screen bg-[#f9f9f0] px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">My Appointments</h1>
      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-600">You have no booked appointments.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white p-4 rounded shadow border-l-4 border-blue-500"
            >
              <h2 className="text-lg font-semibold">
                {appt.doctor?.name || 'Unknown Doctor'}
              </h2>
              <p className="text-sm text-gray-500">
                {appt.doctor?.speciality || 'N/A'}
              </p>
              <p className="mt-2 text-sm">
                <strong>Time Slot:</strong> {appt.slot}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Message:</strong> {appt.message || 'N/A'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                <strong>Booked On:</strong>{' '}
                {new Date(appt.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
