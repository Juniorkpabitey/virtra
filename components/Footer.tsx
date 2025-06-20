import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-200 py-6 mt-10 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo bottom-left */}
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Virtra Logo" width={100} height={100} />
        </div>

        {/* Footer Nav */}
        <div className="flex space-x-6 text-sm">
          <span className="cursor-pointer hover:text-gray-600">Home</span>
          <span className="cursor-pointer hover:text-gray-600">Login</span>
          <span className="cursor-pointer hover:text-gray-600">Sign Up</span>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/twitter.svg" alt="Twitter" width={24} height={24} />
          </a>
        </div>
      </div>

      <p className="text-center text-xs mt-4">Copyright Virtra 2025. All rights reserved.</p>
    </footer>
  )
}
