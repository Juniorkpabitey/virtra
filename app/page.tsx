import Image from 'next/image'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9f9f0] flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col-reverse md:flex-row items-center justify-center gap-25 px-4 sm:px-6 md:px-10 py-8 md:py-16 text-center md:text-left">
        {/* Text Section */}
        <div className="space-y-3 max-w-sm sm:max-w-md md:max-w-lg py-5">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">VIRTRA</h1>
          <p className="text-sm sm:text-base md:text-lg">Consult Specialist And Diagnostics</p>
          <p className="text-sm sm:text-base md:text-lg">Your all in One Health Application</p>
          <button className="bg-gray-300 px-5 py-2 rounded-full mt-4 text-sm sm:text-base hover:bg-gray-400 transition">
            Get started
          </button>
        </div>

        {/* Image Section */}
        <div className="w-[200px] sm:w-[250px] md:w-[400px] mb-2 md:mb-0">
          <Image
            src="/hero_img.png"
            width={400}
            height={400}
            alt="Doctor"
            className="rounded-lg w-full h-auto"
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
