'use client'

import Link from 'next/link'
import { CheckCircle, Calendar, Clock, Video, ArrowRight, Home, FileText } from 'lucide-react'

export default function AppointmentConfirmation() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="fixed inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-green-600/5"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
          <div className="max-w-2xl mx-auto w-full">
            {/* Success Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 lg:p-12 text-center space-y-8">
              
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  Appointment Confirmed!
                </h1>
                <p className="text-lg text-gray-300 max-w-md mx-auto">
                  Your appointment has been successfully booked. We&apos;ve sent you a confirmation email with all the details.
                </p>
              </div>

              {/* Appointment Details */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Appointment Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <div className="text-left">
                      <p className="text-gray-400 text-sm">Date</p>
                      <p className="text-white font-medium">Today</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Clock className="w-5 h-5 text-green-400" />
                    <div className="text-left">
                      <p className="text-gray-400 text-sm">Time</p>
                      <p className="text-white font-medium">30 minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Video className="w-5 h-5 text-purple-400" />
                    <div className="text-left">
                      <p className="text-gray-400 text-sm">Type</p>
                      <p className="text-white font-medium">Video Call</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <FileText className="w-5 h-5 text-orange-400" />
                    <div className="text-left">
                      <p className="text-gray-400 text-sm">Status</p>
                      <p className="text-green-400 font-medium">Confirmed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">What&apos;s Next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">You&apos;ll receive a video call link 15 minutes before your appointment</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">Prepare your medical history and any questions you have</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">Ensure you have a stable internet connection for the call</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/dashboard"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 border border-blue-500/20"
                >
                  <Home className="w-5 h-5" />
                  <span>Back to Dashboard</span>
                </Link>
                
                <Link
                  href="/appointments"
                  className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>View Appointments</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Additional Info */}
              <div className="pt-6 border-t border-white/10">
                <p className="text-gray-400 text-sm">
                  Need to reschedule? You can modify your appointment up to 2 hours before the scheduled time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
