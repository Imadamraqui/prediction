'use client'
import { Menu } from 'lucide-react'

interface HeaderProps {
  toggleSidebar: () => void
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow">
      <button onClick={toggleSidebar} className="hover:text-blue-300 transition">
        <Menu size={28} />
      </button>
      <h1 className="text-xl font-bold">🏥 Santé+</h1>
    </header>
  )
}
