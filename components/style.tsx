'use client'

import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import Footer from '@/components/Footer'
import AIOptionCard from '@/components/AIOptionCard'
import { ArrowRight } from 'lucide-react'

export default function VirtraAIPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f0] flex flex-col">
      <Topbar />

      <div className="flex flex-1 flex-col md:flex-row gap-4 px-2 md:px-6 mt:py-2">
        <Sidebar />

        <main className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="flex flex-wrap justify-center gap-5 w-full py-4 px-4 mt:py-4">
            <AIOptionCard label="Your Health Assistant" />
            <AIOptionCard label="Talk to Virtra" />
          </div>

          <div className="w-full max-w-4xl py-10 px-4">
            <div className="flex items-center bg-gray-200 rounded-full px-4 py-3 shadow-md">
              <input
                type="text"
                placeholder="Ask Virtra"
                className="flex-1 bg-transparent outline-none text-lg"
              />
              <button className="text-black hover:text-gray-700">
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
