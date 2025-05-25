
'use client'
import './globals.css'
import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // State to manage sidebar expansion, controlled by hover
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Keep track of the toggle state from the header button (if needed later)
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);

  // For now, expansion is purely based on hover
  const handleMouseEnterSidebar = () => {
    setIsSidebarExpanded(true);
  };

  const handleMouseLeaveSidebar = () => {
    // If pinned, it should stay open, otherwise close on mouse leave
    if (!isSidebarPinned) {
      setIsSidebarExpanded(false);
    }
  };

  // Toggle function for header button (can be used to pin/unpin later)
  const toggleSidebarPin = () => {
      // Simple toggle for now, could be enhanced to pin
      // setIsSidebarPinned(prev => !prev);
      // setIsSidebarExpanded(prev => !prev); // Example: toggle expansion too
      console.log("Header toggle clicked - Pinned state not fully implemented yet");
  };

  // Determine sidebar width class based on state
  const sidebarWidthClass = isSidebarExpanded ? 'w-64' : 'w-20';
  // Determine main content margin based on state
  const mainContentMarginClass = isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'; // Apply margin only on medium screens and up

  return (
    <html lang="fr">
      {/* Apply flex direction based on screen size if needed */}
      <body className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        
        {/* Sidebar Container - Handles hover */}
        <div 
          onMouseEnter={handleMouseEnterSidebar} 
          onMouseLeave={handleMouseLeaveSidebar}
          className={`fixed top-0 left-0 h-full z-50 transition-width duration-300 ease-in-out ${sidebarWidthClass}`}
        >
          <Sidebar isExpanded={isSidebarExpanded} />
        </div>

        {/* Main Content Area - Shifts based on sidebar state */}
        <div 
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${mainContentMarginClass}`}
        >
          {/* Header might need adjustment if it's part of the shifting content */}
          <Header toggleSidebar={toggleSidebarPin} /> 
          <main className="flex-1 p-4 md:p-6 lg:p-8"> {/* Adjusted padding */}
            {children}
          </main>
          <Footer />
        </div>

      </body>
    </html>
  );
}

