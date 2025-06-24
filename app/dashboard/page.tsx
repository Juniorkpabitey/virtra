'use client'

import Sidebar from '../../components/Sidebar'
import DoctorCard from '../../components/DoctorCard'
import Topbar from '../../components/Topbar'
import Footer from '../../components/Footer'

const doctors = [
  {
    name: 'Dr. Ama Asantwaa',
    title: 'Sr. Psychologist',
    image: '/doctors/dr_img.png',
    rating: 4.5,
  },
  {
    name: 'Dr. Asare Edo ah',
    title: 'Sr. Physician',
    image: '/doctors/dr_img1.png',
    rating: 4,
  },
  {
    name: 'Dr. Grace Nyarko',
    title: 'Dermatologist',
    image: '/doctors/dr_img.png',
    rating: 4.2,
  },
  {
    name: 'Dr. Michael Mensah',
    title: 'Cardiologist',
    image: '/doctors/dr_img1.png',
    rating: 4.8,
  },
  {
    name: 'Dr. Grace Nyarko',
    title: 'Dermatologist',
    image: '/doctors/dr_img.png',
    rating: 4.2,
  },
  {
    name: 'Dr. Michael Mensah',
    title: 'Cardiologist',
    image: '/doctors/dr_img1.png',
    rating: 4.8,
  },
 
 
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#f9f9f0] flex flex-col">
      <Topbar />

      <div className="flex flex-1 flex-col md:flex-row gap-4 px-2 md:px-6">
        {/* Sidebar (Responsive) */}
        <Sidebar />

        {/* Doctors Grid */}
        <main className="flex-1 px-4 py-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {doctors.slice(0, 6).map((doc, i) => (
             <div key={i} className="w-full max-w-sm mx-auto">
              <DoctorCard
             name={doc.name}
            title={doc.title}
            image={doc.image}
            rating={doc.rating}
        />
      </div>
    ))}
  </div>
</main>

      </div>

      <Footer />
    </div>
  )
}
