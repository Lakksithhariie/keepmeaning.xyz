import React from 'react';
import Logo from './Logo';
import { User, Settings, LogOut, Sparkles } from 'lucide-react';
import { UserPlan } from '../types';

interface NavBarProps {
  onLogout: () => void;
  userEmail?: string;
  currentPage: string;
  onNavigate: (page: string) => void;
  userPlan: UserPlan;
}

const NavBar: React.FC<NavBarProps> = ({ onLogout, userEmail, currentPage, onNavigate, userPlan }) => {
  const links = [
    { id: 'write', label: 'Write' },
    { id: 'history', label: 'History' },
    { id: 'settings', label: 'Settings' },
  ];

  const isPro = userPlan === 'pro';

  return (
    <nav className="bg-white border-b border-iceBlue sticky top-0 z-40 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="cursor-pointer" onClick={() => onNavigate('write')}>
             <Logo state="idle" size="small" />
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === link.id
                    ? 'text-deepOcean bg-iceBlue/50'
                    : 'text-gray-600 hover:text-deepOcean hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 pr-4 border-r border-iceBlue">
            {isPro ? (
                 <span className="flex items-center gap-1 text-xs font-bold text-white bg-oceanBlue px-2 py-1 rounded-full shadow-sm">
                    <Sparkles size={10} /> Pro Plan
                </span>
            ) : (
                <span className="text-xs font-medium text-oceanBlue bg-iceBlue px-2 py-1 rounded-full">
                Free Plan
                </span>
            )}
          </div>
          
          <div className="relative group">
            <button className="flex items-center gap-2 text-sm font-medium text-deepOcean hover:text-oceanBlue transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${isPro ? 'bg-deepOcean' : 'bg-oceanBlue'}`}>
                <User size={16} />
              </div>
              <span className="hidden sm:inline-block">{userEmail?.split('@')[0]}</span>
            </button>
            
            {/* Simple Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-iceBlue opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 transform origin-top-right">
                <div className="py-1">
                    <button onClick={() => onNavigate('settings')} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-iceBlue text-left">
                        <Settings size={14} /> Settings
                    </button>
                    <button onClick={onLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;