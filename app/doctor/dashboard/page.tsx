'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import DoctorSidebar from '../../../components/DoctorSidebar'
import DoctorTopbar from '../../../components/DoctorTopbar'
import Footer from '../../../components/Footer'
import { Calendar, Users, Clock, Star, Activity, TrendingUp, AlertCircle, CheckCircle, Clock as ClockIcon } from 'lucide-react'

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

type DashboardStats = {
  totalAppointments: number
  todayAppointments: number
  completedToday: number
  pendingAppointments: number
  totalPatients: number
  averageRating: number
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    todayAppointments: 0,
    completedToday: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    averageRating: 4.8
  })
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true)
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.error('No authenticated user')
          return
        }

        // Get doctor ID
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (!doctorData) {
          console.error('Doctor not found')
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
          // Get unique patient IDs from appointments
          const patientIds = [...new Set((appointmentsData || []).map(apt => apt.user_id))]
          
          // Fetch patient profiles
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

          // Calculate stats
          const today = new Date().toISOString().split('T')[0]
          const todayAppointments = transformedAppointments.filter(apt => 
            apt.created_at.startsWith(today)
          )
          const completedToday = todayAppointments.filter(apt => apt.status === 'completed')
          const pendingAppointments = transformedAppointments.filter(apt => apt.status === 'pending')
          const uniquePatients = new Set(patientIds)

          setStats({
            totalAppointments: transformedAppointments.length,
            todayAppointments: todayAppointments.length,
            completedToday: completedToday.length,
            pendingAppointments: pendingAppointments.length,
            totalPatients: uniquePatients.size,
            averageRating: 4.8 // This would come from a ratings table
          })
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorData()
  }, [])

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
        return <ClockIcon className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <ClockIcon className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
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
              <h1 className="text-3xl font-bold text-white mb-2">Doctor Dashboard</h1>
                                   <p className="text-gray-400">Welcome back! Here&apos;s your practice overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Today&apos;s Appointments</p>
                    <p className="text-2xl font-bold text-white">{stats.todayAppointments}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Patients</p>
                    <p className="text-2xl font-bold text-white">{stats.totalPatients}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending Appointments</p>
                    <p className="text-2xl font-bold text-white">{stats.pendingAppointments}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Average Rating</p>
                    <p className="text-2xl font-bold text-white">{stats.averageRating}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Appointments</h2>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {appointments.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {appointment.patient?.name || 'Unknown Patient'}
                        </p>
                        <p className="text-gray-400 text-sm">{appointment.slot}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(appointment.status)}
                          <span className="capitalize">{appointment.status}</span>
                        </div>
                      </span>
                      
                      <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <Activity className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-blue-400 hover:text-blue-300 transition-all duration-300">
                    <Calendar className="w-5 h-5" />
                    <span>Schedule New Appointment</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl text-purple-400 hover:text-purple-300 transition-all duration-300">
                    <Activity className="w-5 h-5" />
                    <span>View Patient Records</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl text-green-400 hover:text-green-300 transition-all duration-300">
                    <TrendingUp className="w-5 h-5" />
                    <span>Analytics Report</span>
                  </button>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Practice Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Patients</span>
                    <span className="text-white font-semibold">{stats.totalPatients}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Appointments</span>
                    <span className="text-white font-semibold">{stats.totalAppointments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Avg. Appointments/Patient</span>
                    <span className="text-white font-semibold">
                      {stats.totalPatients > 0 
                        ? Math.round((stats.totalAppointments / stats.totalPatients) * 10) / 10
                        : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Patients This Month</span>
                    <span className="text-white font-semibold">
                      {appointments.filter(apt => {
                        const aptDate = new Date(apt.created_at)
                        const thisMonth = new Date()
                        return aptDate.getMonth() === thisMonth.getMonth() && 
                               aptDate.getFullYear() === thisMonth.getFullYear()
                      }).length}
                    </span>
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
