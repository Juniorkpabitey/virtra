import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-3 px-6">
  <div className="flex items-center space-x-2">
    <Image src="/logo.png" alt="Virtra Logo" width={100} height={100} />
  </div>

  {/* Menu */}
  <div className="space-x-3  bg-gray-100 bg-opacity-80 backdrop-blur-sm z-50 rounded-full px-3 py-2">
    <Link href="/" className="bg-white px-4 py-1 rounded-full border border-white hover:bg-gray-50 transition">Home</Link>
    <Link href="/signup" className="bg-white px-4 py-1 rounded-full border border-white hover:bg-gray-50 transition">Sign Up</Link>
    <Link href="/login" className="bg-white px-4 py-1 rounded-full border border-white hover:bg-gray-50 transition">Login</Link>
  </div>
</nav>
  )
}
