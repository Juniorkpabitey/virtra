'use client'

import Link from 'next/link'

export default function AppointmentConfirmation() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f0] px-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Appointment Confirmed!</h2>
        <p className="text-gray-600 mb-6">Your appointment has been successfully booked.</p>
        <Link
          href="/dashboard"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
