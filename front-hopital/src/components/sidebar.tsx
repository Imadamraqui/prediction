'use client'

import { X } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  return (
    <aside
      className={`h-screen w-64 bg-blue-800 text-white p-4 shadow transition-transform duration-300 ease-in-out
      fixed top-0 left-0 z-50
      ${isOpen ? 'translate-x-0' : '-translate-x-64'}`}
    >
      {/* 🔁 Bouton de fermeture dans le coin */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Menu</h2>
        <button onClick={toggleSidebar} className="text-white hover:text-blue-300">
          <X size={24} />
        </button>
      </div>

      <ul className="space-y-4">
        <li className="hover:text-blue-200 cursor-pointer">Dashboard</li>
        <li className="hover:text-blue-200 cursor-pointer">Rendez-vous</li>
        <li className="hover:text-blue-200 cursor-pointer">Profil</li>
      </ul>
    </aside>
  )
}
