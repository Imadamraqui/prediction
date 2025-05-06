'use client';

import { X, LayoutDashboard, Calendar, UserCircle } from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-screen w-64
        bg-blue-800 bg-opacity-95 text-white shadow-2xl
        p-6 transition-transform duration-500 ease-in-out
        transform ${isOpen ? 'translate-x-0' : '-translate-x-64'}
        will-change-transform backdrop-blur-md
      `}
    >
      {/* 🔁 En-tête avec bouton de fermeture */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-semibold tracking-wide">Santé+</h2>
        <button onClick={toggleSidebar} className="hover:text-blue-300 transition-colors">
          <X size={26} />
        </button>
      </div>

      {/* 🔗 Menu avec icônes */}
      <nav className="flex flex-col gap-6 text-lg">
        <Link href="/dashboard" className="flex items-center gap-3 hover:text-blue-300 transition">
          <LayoutDashboard size={20} />
          Tableau de bord
        </Link>
        <Link href="/appointments" className="flex items-center gap-3 hover:text-blue-300 transition">
          <Calendar size={20} />
          Rendez-vous
        </Link>
        <Link href="/profile" className="flex items-center gap-3 hover:text-blue-300 transition">
          <UserCircle size={20} />
          Profil
        </Link>
      </nav>
    </aside>
  );
}
