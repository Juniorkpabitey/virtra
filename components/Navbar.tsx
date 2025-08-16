'use client'
import { useState } from 'react'
//import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, User, ArrowRight } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              VIRTRA
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white font-medium transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-gray-300 hover:text-white font-medium transition-colors">
              Features
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white font-medium transition-colors">
              Contact
            </Link>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-300 hover:text-white font-medium transition-colors flex items-center">
              <User className="w-4 h-4 mr-2" />
              Login
            </Link>
            <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center border border-blue-500/20">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="px-4 py-6 space-y-4">
              <Link 
                href="/" 
                className="block py-3 text-gray-300 hover:text-white font-medium transition-colors border-b border-white/10"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/features" 
                className="block py-3 text-gray-300 hover:text-white font-medium transition-colors border-b border-white/10"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/about" 
                className="block py-3 text-gray-300 hover:text-white font-medium transition-colors border-b border-white/10"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="block py-3 text-gray-300 hover:text-white font-medium transition-colors border-b border-white/10"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 space-y-3">
                <Link 
                  href="/login" 
                  className="block w-full text-center py-3 text-gray-300 hover:text-white font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 border border-blue-500/20"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
