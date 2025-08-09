'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Menu } from 'lucide-react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const menus = [
    { label: 'Doctors', path: '/dashboard' },
    { label: 'Appointments', path: '/appointment' },
    { label: 'Health Bits', path: '/health-bits' },
    { label: 'Virtra AI', path: '/virtra-ai' },
    { label: 'Profile', path: '/profile' },
  ]

  const handleNavigate = (path: string) => {
    router.push(path)
    setIsOpen(false) // close sidebar on mobile after navigation
  }

  return (
    <>
      {/* Hamburger menu for mobile */}
      <div className="md:hidden px-4 py-2">
        <button onClick={() => setIsOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar overlay on mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-200 shadow-lg z-50 p-4 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:translate-x-0 md:w-60 md:h-auto md:block`}
      >
        {/* Close button (mobile only) */}
        <div className="flex justify-end md:hidden">
          <button onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu list */}
        <div className="mt-6 space-y-3">
          {menus.map((menu, index) => (
            <button
              key={index}
              onClick={() => handleNavigate(menu.path)}
              className="w-full py-2 px-4 rounded-md bg-white text-black font-medium hover:bg-gray-100 transition"
            >
              {menu.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
