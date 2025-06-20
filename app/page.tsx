import Image from 'next/image'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9f9f0] flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-10 py-10 text-center md:text-left">
        <div className="space-y-4 max-w-md">
          <h1 className="text-5xl md:text-6xl font-bold">VIRTRA</h1>
          <p className="text-base md:text-lg">Consult Specialist And Diagnostics</p>
          <p className="text-base md:text-lg">Your all in One Health Application</p>
          <button className="bg-gray-300 px-6 py-2 rounded-full mt-4 text-base">Get started</button>
        </div>

        <div className="w-[250px] md:w-[400px] mt-10 md:mt-0">
          <Image
            src="/hero_img.png"
            width={400}
            height={400}
            alt="Doctor"
            className="rounded-lg"
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
