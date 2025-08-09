'use client'

import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import Footer from '@/components/Footer'
import HealthCard from '@/components/HealthCard'
import Link from 'next/link'

const healthSections = [
  {
    title: 'NUTRITION',
    image: '/images/nutrition.png',
    href: '/health-bits/nutrition',
  },
  {
    title: 'WORKOUTS',
    image: '/images/workout.png',
    href: '/health-bits/workouts',
  },
  {
    title: 'ARTICLES',
    image: '/images/articles.png',
    href: '/health-bits/articles',
  },
  {
    title: 'HEALTH TREND',
    image: '/images/trends.png',
    href: '/health-bits/trends',
  },
]

export default function HealthBitsDashboard() {
  return (
    <div className="min-h-screen bg-[#f9f9f0] flex flex-col">
      <Topbar />
      <div className="flex flex-1 flex-col md:flex-row gap-4 px-2 md:px-6 mt:py-4">
        <Sidebar />

        {/* Main centered content */}
        <main className="flex-1 flex justify-center py-2">
          <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Explore Health Bits
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {healthSections.map((item) => (
                <Link key={item.title} href={item.href}>
                  <HealthCard title={item.title} image={item.image} />
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
