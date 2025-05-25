
'use client';

import { X, LayoutDashboard, Calendar, UserCircle, Settings, LogOut, Hospital } from 'lucide-react'; // Added Hospital, Settings, LogOut
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // To highlight active link
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Assuming tooltip component exists

// Define navigation items structure
interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/prediction', icon: Calendar, label: 'Prédiction' },
  { href: '/profile', icon: UserCircle, label: 'Profil' },
  { href: '/settings', icon: Settings, label: 'Paramètres' }, // Example additional item
];

// Define props for the Sidebar component
interface SidebarProps {
  isExpanded: boolean; // Accept the expansion state from the parent
}

export default function Sidebar({ isExpanded }: SidebarProps) {
  // Removed local state for isExpanded, now controlled by parent
  // const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname(); // Get current path

  // Placeholder logout function - replace with actual logic
  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    window.location.href = '/auth/login'; // Redirect to login
  };

  return (
    <TooltipProvider delayDuration={100}>
      {/* The parent div in layout.tsx now handles hover and width */}
      <aside
        className={`
          h-full 
          bg-gradient-to-b from-blue-700 to-blue-900 text-white shadow-lg
          flex flex-col 
          overflow-y-auto overflow-x-hidden /* Prevent scrollbars due to transition */
        `}
        // Hover handlers are now in layout.tsx
        // onMouseEnter={() => setIsExpanded(true)}
        // onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} h-16 px-4 border-b border-blue-600/50 flex-shrink-0`}>
          <Link href="/" className={`flex items-center gap-2 font-bold text-xl transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            <Hospital size={24} />
            <span>Santé+</span>
          </Link>
          {/* Show logo only when collapsed */}
          <Link href="/" className={`flex items-center justify-center transition-opacity duration-200 ${!isExpanded ? 'opacity-100' : 'opacity-0 w-0 h-0 overflow-hidden'}`}>
             <Hospital size={28} />
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow mt-6 px-3 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center h-11 rounded-md 
                      ${isExpanded ? 'px-3 gap-3' : 'justify-center'} 
                      text-sm font-medium 
                      transition-colors duration-150 ease-in-out 
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-inner' 
                        : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'}
                    `}
                  >
                    <item.icon className={`flex-shrink-0 ${isExpanded ? 'h-5 w-5' : 'h-6 w-6'}`} />
                    <span className={`whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                      {item.label}
                    </span>
                  </Link>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right" className="bg-gray-800 text-white border-none rounded px-2 py-1 text-xs">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Sidebar Footer (e.g., Logout) */}
        <div className="mt-auto border-t border-blue-600/50 p-3 flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className={`
                  flex items-center w-full h-11 rounded-md 
                  ${isExpanded ? 'px-3 gap-3' : 'justify-center'} 
                  text-sm font-medium text-blue-100 
                  hover:bg-red-600/80 hover:text-white transition-colors duration-150 ease-in-out
                `}
              >
                <LogOut className={`flex-shrink-0 ${isExpanded ? 'h-5 w-5' : 'h-6 w-6'}`} />
                <span className={`whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                  Déconnexion
                </span>
              </button>
            </TooltipTrigger>
            {!isExpanded && (
              <TooltipContent side="right" className="bg-gray-800 text-white border-none rounded px-2 py-1 text-xs">
                <p>Déconnexion</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}

