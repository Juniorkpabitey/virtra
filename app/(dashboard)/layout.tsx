// app/(dashboard)/layout.tsx
'use client'

import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import Footer from '@/components/Footer'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f9f9f0] flex flex-col">
      <Topbar />
      <div className="flex flex-1 flex-col md:flex-row gap-4 px-2 md:px-6">
        <Sidebar />
        <main className="flex-1 px-4 py-8">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
