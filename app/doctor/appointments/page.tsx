'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import DoctorSidebar from '../../../components/DoctorSidebar'
import DoctorTopbar from '../../../components/DoctorTopbar'
import Footer from '../../../components/Footer'
import { Calendar, Clock, User, MessageCircle, Search, Filter, CheckCircle, XCircle, AlertCircle, Phone, Mail } from 'lucide-react'

// Types
type Appointment = {
  id: string
  slot: string
  message: string
  created_at: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  patient: {
    name: string
    email: string
  } | null
}

type AppointmentStatus = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus>('all')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.error('No authenticated user')
          return
        }

        // Get doctor ID
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (doctorError) {
          console.error('Error fetching doctor:', doctorError)
          return
        }

        if (!doctorData) {
          console.error('Doctor not found for user:', user.id)
          return
        }

        // Fetch appointments with patient info
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select(`
            id,
            slot,
            message,
            created_at,
            user_id
          `)
          .eq('doctor_id', doctorData.id)
          .order('created_at', { ascending: false })

        if (appointmentsError) {
          console.error('Error fetching appointments:', appointmentsError)
        } else {
          // Fetch patient profiles separately for better reliability
          const patientIds = [...new Set((appointmentsData || []).map(apt => apt.user_id))]
          
          const patientProfiles: Record<string, { id: string; firstName: string; lastName: string; email: string }> = {}
          if (patientIds.length > 0) {
            const { data: profilesData, error: profilesError } = await supabase
              .from('profiles')
              .select('id, firstName, lastName, email')
              .in('id', patientIds)
            
            if (!profilesError && profilesData) {
              profilesData.forEach(profile => {
                patientProfiles[profile.id] = profile
              })
            } else if (profilesError) {
              console.error('Error fetching profiles:', profilesError)
            }
          }

          // Transform the data
          const transformedAppointments: Appointment[] = (appointmentsData || []).map((apt: { id: string; slot: string; message: string; created_at: string; user_id: string }) => {
            const patientProfile = patientProfiles[apt.user_id]
            return {
              id: apt.id,
              slot: apt.slot,
              message: apt.message,
              created_at: apt.created_at,
              status: 'pending', // Default status since column doesn't exist
              patient: patientProfile ? {
                name: `${patientProfile.firstName} ${patientProfile.lastName}`,
                email: patientProfile.email
              } : null
            }
          })

          setAppointments(transformedAppointments)
        }
      } catch (error) {
        console.error('Error fetching appointments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  // Filter appointments based on search and status
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.slot.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      // Since status column doesn't exist, we'll just update local state for now
      // You can add a status column to your appointments table if you want to persist status changes
      
      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus as 'pending' | 'confirmed' | 'completed' | 'cancelled' } : apt
      ))
    } catch (error) {
      console.error('Error updating appointment status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'cancelled':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      default:
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Clock className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusCount = (status: AppointmentStatus) => {
    if (status === 'all') return appointments.length
    return appointments.filter(apt => apt.status === status).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading appointments...</p>
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
              <h1 className="text-3xl font-bold text-white mb-2">Appointments</h1>
              <p className="text-gray-400">Manage your patient appointments and schedules.</p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by patient name or time slot..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus)}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  >
                    <option value="all">All ({getStatusCount('all')})</option>
                    <option value="pending">Pending ({getStatusCount('pending')})</option>
                    <option value="confirmed">Confirmed ({getStatusCount('confirmed')})</option>
                    <option value="completed">Completed ({getStatusCount('completed')})</option>
                    <option value="cancelled">Cancelled ({getStatusCount('cancelled')})</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No appointments found</h3>
                  <p className="text-gray-400">Try adjusting your search criteria or filters</p>
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {appointment.patient?.name || 'Unknown Patient'}
                          </h3>
                          <p className="text-gray-400">{appointment.patient?.email}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1 text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">{appointment.slot}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">
                                {new Date(appointment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(appointment.status)}
                            <span className="capitalize">{appointment.status}</span>
                          </div>
                        </span>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment)
                              setShowDetails(true)
                            }}
                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            title="View Details"
                          >
                            <MessageCircle className="w-4 h-4 text-gray-400" />
                          </button>
                          
                          {appointment.status === 'pending' && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                                className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-xs font-medium transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-xs font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          )}

                          {appointment.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                              className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 text-xs font-medium transition-colors"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {appointment.message && (
                      <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-gray-300 text-sm">{appointment.message}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </main>
        </div>

        {/* Appointment Details Modal */}
        {showDetails && selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Appointment Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Patient Information</h3>
                  <div className="bg-white/5 rounded-xl p-4 space-y-2">
                    <p className="text-gray-300">
                      <span className="text-gray-400">Name:</span> {selectedAppointment.patient?.name}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">Email:</span> {selectedAppointment.patient?.email}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-2">Appointment Details</h3>
                  <div className="bg-white/5 rounded-xl p-4 space-y-2">
                    <p className="text-gray-300">
                      <span className="text-gray-400">Time:</span> {selectedAppointment.slot}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedAppointment.status)}`}>
                        {selectedAppointment.status}
                      </span>
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">Booked:</span> {new Date(selectedAppointment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedAppointment.message && (
                  <div>
                    <h3 className="text-white font-medium mb-2">Patient Message</h3>
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-gray-300 text-sm">{selectedAppointment.message}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3 pt-4">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>Call Patient</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 transition-colors">
                    <Mail className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  )
}
