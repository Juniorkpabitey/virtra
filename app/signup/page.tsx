import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function SignUp() {
  return (
    <div className="min-h-screen bg-[#f9f9f0] flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-10">
        {/* Image section */}
        <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
          <Image
            src="/hero_img.png"
            alt="Doctor"
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>

        {/* Form section */}
        <div className="w-full md:w-1/2 max-w-md space-y-6">
          <h2 className="text-3xl font-semibold">Create an account</h2>
          <p className="text-sm text-gray-600">Enter your details below</p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Firstname</label>
              <input type="text" className="w-full border-b border-gray-400 focus:outline-none py-1 bg-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium">Lastname</label>
              <input type="text" className="w-full border-b border-gray-400 focus:outline-none py-1 bg-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium">Email or Phone Number</label>
              <input type="email" className="w-full border-b border-gray-400 focus:outline-none py-1 bg-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input type="password" className="w-full border-b border-gray-400 focus:outline-none py-1 bg-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium">Confirm Password</label>
              <input type="password" className="w-full border-b border-gray-400 focus:outline-none py-1 bg-transparent" />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-300 text-black py-2 rounded-md font-semibold hover:bg-gray-400 transition"
            >
              Create Account
            </button>
          </form>

          <p className="text-sm text-center">
            Already have account?{' '}
            <Link href="/login" className="font-medium text-black hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
