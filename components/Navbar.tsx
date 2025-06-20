'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="flex items-center justify-between py-4 px-6 relative bg-transparent">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Image src="/logo.png" alt="Virtra Logo" width={40} height={40} />
        <span className="font-bold text-xl">Virtra</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4 bg-gray-100 bg-opacity-80 backdrop-blur-sm z-50 rounded-full px-4 py-2">
        <Link href="/" className="px-4 py-1 rounded-full hover:bg-gray-50">Home</Link>
        <Link href="/signup" className="px-4 py-1 rounded-full hover:bg-gray-50">Sign Up</Link>
        <Link href="/login" className="px-4 py-1 rounded-full hover:bg-gray-50">Login</Link>
      </div>

      {/* Hamburger Menu (Mobile) */}
      <div className="md:hidden z-50">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-16 right-6 bg-white shadow-lg rounded-lg w-40 flex flex-col items-start p-4 md:hidden z-40">
          <Link href="/" className="py-2 w-full">Home</Link>
          <Link href="/signup" className="py-2 w-full">Sign Up</Link>
          <Link href="/login" className="py-2 w-full">Login</Link>
        </div>
      )}
    </nav>
  )
}
