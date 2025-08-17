'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import DoctorSidebar from '../../../components/DoctorSidebar'
import DoctorTopbar from '../../../components/DoctorTopbar'
import Footer from '../../../components/Footer'
import { Users, Search, Filter, User, Calendar, Activity, FileText, Phone, Mail } from 'lucide-react'

type Patient = {
  id: string
  name: string
  email: string
  phone: string
  age: number
  gender: string
  lastVisit: string
  totalAppointments: number
  status: 'active' | 'inactive'
  medicalHistory: string[]
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchPatients = async () => {
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

        // Fetch patients who have appointments with this doctor
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select(`
            user_id,
            created_at
          `)
          .eq('doctor_id', doctorData.id)

        if (appointmentsError) {
          console.error('Error fetching appointments:', appointmentsError)
        } else {
          // Get unique patient IDs and their appointment counts
          const patientMap = new Map<string, { count: number; lastVisit: string }>()
          
          appointmentsData?.forEach((apt: { user_id: string; created_at: string }) => {
            const patientId = apt.user_id
            
            if (patientMap.has(patientId)) {
              const existing = patientMap.get(patientId)!
              existing.count += 1
              if (new Date(apt.created_at) > new Date(existing.lastVisit)) {
                existing.lastVisit = apt.created_at
              }
            } else {
              patientMap.set(patientId, {
                count: 1,
                lastVisit: apt.created_at
              })
            }
          })

          // Fetch patient profiles for the unique patients
          const patientIds = Array.from(patientMap.keys())
          const patientProfiles: Record<string, { id: string; firstName: string; lastName: string; email: string; age: number; gender: string; contact: string }> = {}
          
          if (patientIds.length > 0) {
            const { data: profilesData, error: profilesError } = await supabase
              .from('profiles')
              .select('id, firstName, lastName, email, age, gender, contact')
              .in('id', patientIds)
            
            if (!profilesError && profilesData) {
              profilesData.forEach(profile => {
                patientProfiles[profile.id] = profile
              })
            }
          }

          // Create patient objects
          const patientsList: Patient[] = Array.from(patientMap.entries()).map(([patientId, data]) => {
            const profile = patientProfiles[patientId]
            return {
              id: patientId,
              name: profile ? `${profile.firstName} ${profile.lastName}` : 'Unknown Patient',
              email: profile?.email || '',
              phone: profile?.contact || '',
              age: profile?.age || 0,
              gender: profile?.gender || '',
              lastVisit: data.lastVisit,
              totalAppointments: data.count,
              status: 'active',
              medicalHistory: []
            }
          })

          setPatients(patientsList)
        }
      } catch (error) {
        console.error('Error fetching patients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  // Filter patients based on search and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'text-green-400 bg-green-500/10 border-green-500/20'
      : 'text-red-400 bg-red-500/10 border-red-500/20'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading patients...</p>
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
              <h1 className="text-3xl font-bold text-white mb-2">Patients</h1>
              <p className="text-gray-400">Manage your patient information and medical records.</p>
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
                    placeholder="Search by patient name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                                     <select
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  >
                    <option value="all">All Patients</option>
                    <option value="active">Active Patients</option>
                    <option value="inactive">Inactive Patients</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Patients</p>
                    <p className="text-2xl font-bold text-white">{patients.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Patients</p>
                    <p className="text-2xl font-bold text-white">
                      {patients.filter(p => p.status === 'active').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">This Month</p>
                    <p className="text-2xl font-bold text-white">
                      {patients.filter(p => {
                        const lastVisit = new Date(p.lastVisit)
                        const thisMonth = new Date()
                        return lastVisit.getMonth() === thisMonth.getMonth() && 
                               lastVisit.getFullYear() === thisMonth.getFullYear()
                      }).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg. Appointments</p>
                    <p className="text-2xl font-bold text-white">
                      {patients.length > 0 
                        ? Math.round(patients.reduce((sum, p) => sum + p.totalAppointments, 0) / patients.length)
                        : 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Patients List */}
            <div className="space-y-4">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No patients found</h3>
                  <p className="text-gray-400">Try adjusting your search criteria or filters</p>
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{patient.name}</h3>
                          <p className="text-gray-400">{patient.email}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1 text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">
                                {new Date(patient.lastVisit).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-400">
                              <Activity className="w-4 h-4" />
                              <span className="text-sm">{patient.totalAppointments} visits</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-400">
                              <span className="text-sm">{patient.age} years, {patient.gender}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedPatient(patient)
                              setShowDetails(true)
                            }}
                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            title="View Details"
                          >
                            <FileText className="w-4 h-4 text-gray-400" />
                          </button>
                          
                          <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <Phone className="w-4 h-4 text-gray-400" />
                          </button>
                          
                          <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <Mail className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>

        {/* Patient Details Modal */}
        {showDetails && selectedPatient && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Patient Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-gray-400">×</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-white font-medium mb-3">Basic Information</h3>
                  <div className="bg-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-medium">{selectedPatient.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white">{selectedPatient.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Age:</span>
                      <span className="text-white">{selectedPatient.age} years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Gender:</span>
                      <span className="text-white">{selectedPatient.gender}</span>
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div>
                  <h3 className="text-white font-medium mb-3">Medical History</h3>
                  <div className="bg-white/5 rounded-xl p-4">
                    {selectedPatient.medicalHistory.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedPatient.medicalHistory.map((item, index) => (
                          <li key={index} className="text-gray-300 text-sm">• {item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm">No medical history available</p>
                    )}
                  </div>
                </div>

                {/* Visit History */}
                <div>
                  <h3 className="text-white font-medium mb-3">Visit History</h3>
                  <div className="bg-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Total Visits:</span>
                      <span className="text-white font-medium">{selectedPatient.totalAppointments}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Last Visit:</span>
                      <span className="text-white">
                        {new Date(selectedPatient.lastVisit).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-4">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors">
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Appointment</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 transition-colors">
                    <FileText className="w-4 h-4" />
                    <span>View Records</span>
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
