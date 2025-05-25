
'use client'

import { useState, useEffect } from 'react';
import { Menu, UserCircle, Bell, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming Button component exists

interface HeaderProps {
  // Keep toggleSidebar prop for potential future use (e.g., pinning the sidebar)
  toggleSidebar?: () => void; 
}

export default function Header({ toggleSidebar }: HeaderProps) {
  // Placeholder for authentication status - replace with actual logic
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate checking auth status on mount
  useEffect(() => {
    const token = localStorage.getItem('token'); // Example check
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    // Optionally redirect or refresh
    window.location.reload(); // Simple refresh for demo
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Section: Toggle Button and Logo */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button - Conditionally render if needed */}
          {toggleSidebar && (
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden" // Often hidden on larger screens if sidebar behavior changes
            >
              <Menu size={24} />
              <span className="sr-only">Ouvrir/Fermer le menu</span>
            </button>
          )}
          {/* Logo/Title */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            {/* Replace with actual SVG logo if available */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Santé+</span>
          </Link>
        </div>

        {/* Right Section: Navigation and User Actions */}
        <div className="flex items-center gap-4">
          {/* Placeholder for potential main navigation links */}
          {/* <nav className="hidden md:flex gap-4">
            <Link href="/features" className="text-gray-600 hover:text-blue-600 transition-colors">Fonctionnalités</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Tarifs</Link>
          </nav> */}

          {/* Notifications Icon */}
          {isAuthenticated && (
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Bell size={20} />
              <span className="sr-only">Notifications</span>
            </button>
          )}

          {/* User Profile/Login/Logout */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <UserCircle size={22} />
                <span className="sr-only">Profil</span>
              </Link>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-500 text-red-500 hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut size={16} className="mr-1.5"/>
                Déconnexion
              </Button>
            </div>
          ) : (
            <Button 
              asChild 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            >
              <Link href="/auth/login">
                <LogIn size={16} className="mr-1.5"/>
                Connexion
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

