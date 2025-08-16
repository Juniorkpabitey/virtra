'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { Calendar, Clock, User, MessageCircle, Search, Filter, Video, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react'

// Type for the doctor details
type Doctor = {
  name: string
  speciality: string
  image_url?: string
}

// Type for the appointment including doctor
type Appointment = {
  id: string
  slot: string
  message: string
  created_at: string
  doctor: Doctor | null
}

type AppointmentStatus = 'all' | 'upcoming' | 'completed' | 'cancelled'

export default function UserAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus>('all')

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
            speciality,
            image_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

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

  // Filter appointments based on search and status
  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch = appt.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appt.doctor?.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appt.slot.toLowerCase().includes(searchTerm.toLowerCase())
    
    // For now, all appointments are considered "upcoming" since we don't have status field
    const matchesStatus = statusFilter === 'all' || statusFilter === 'upcoming'
    
    return matchesSearch && matchesStatus
  })

  const getAppointmentStatus = (appointment: Appointment) => {
    // This is a simplified status logic - you can enhance this based on your needs
    const appointmentDate = new Date(appointment.created_at)
    const now = new Date()
    
    if (appointmentDate > now) {
      return { status: 'upcoming', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' }
    } else {
      return { status: 'completed', color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
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
        <div className="px-4 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="space-y-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-3xl lg:text-4xl font-bold">
                    My{' '}
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Appointments
                    </span>
                  </h1>
                  <p className="text-gray-300 text-lg">
                    Manage and track your healthcare appointments
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{appointments.length}</p>
                      <p className="text-gray-400 text-sm">Total</p>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">
                        {appointments.filter(a => getAppointmentStatus(a).status === 'upcoming').length}
                      </p>
                      <p className="text-gray-400 text-sm">Upcoming</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search appointments by doctor name, speciality, or time..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus)}
                    className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                  >
                    <option value="all">All Appointments</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-400">Loading your appointments...</p>
                </div>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">No appointments found</h3>
                    <p className="text-gray-400">
                      {appointments.length === 0 
                        ? "You haven't booked any appointments yet."
                        : "No appointments match your search criteria."
                      }
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredAppointments.map((appt) => {
                  const status = getAppointmentStatus(appt)
                  return (
                    <div
                      key={appt.id}
                      className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 ${status.borderColor}`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Doctor Info */}
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xl font-semibold text-white">
                              Dr. {appt.doctor?.name || 'Unknown Doctor'}
                            </h3>
                            <p className="text-blue-400 font-medium">
                              {appt.doctor?.speciality || 'N/A'}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(appt.created_at).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{appt.slot}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                          {/* Status */}
                          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${status.bgColor} ${status.borderColor} border`}>
                            {getStatusIcon(status.status)}
                            <span className={`text-sm font-medium capitalize ${status.color}`}>
                              {status.status}
                            </span>
                          </div>

                          {/* Message Preview */}
                          {appt.message && (
                            <div className="flex items-center space-x-2 text-gray-400">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm truncate max-w-48">
                                {appt.message}
                              </span>
                            </div>
                          )}

                          {/* Action Button */}
                          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                            <Video className="w-4 h-4" />
                            <span>Join Call</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
