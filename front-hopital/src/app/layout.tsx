'use client'
import './globals.css'
import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

  return (
    <html lang="fr">
      <body className="flex min-h-screen">
        {/* Sidebar toggle desktop */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="flex-1 flex flex-col">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 p-4 bg-gray-50">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
