'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="flex items-center justify-between py-8 px-4 relative bg-transparent max-w-7xl mx-auto w-full">
      
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <Image src="/logo.png" alt="Virtra Logo" width={70} height={70} />
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4 bg-gray-100 bg-opacity-80 backdrop-blur-sm rounded-full px-4 py-1">
        <Link href="/" className="px-3 py-1 rounded-full hover:bg-gray-50">Home</Link>
        <Link href="/signup" className="px-3 py-1 rounded-full hover:bg-gray-50">Sign Up</Link>
        <Link href="/login" className="px-3 py-1 rounded-full hover:bg-gray-50">Login</Link>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg w-40 flex flex-col items-start p-4 md:hidden z-40">
          <Link href="/" className="py-2 w-full">Home</Link>
          <Link href="/signup" className="py-2 w-full">Sign Up</Link>
          <Link href="/login" className="py-2 w-full">Login</Link>
        </div>
      )}
    </nav>
  )
}
