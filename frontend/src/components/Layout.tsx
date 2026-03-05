import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Radio, Users, BarChart3,
  Shield, LogOut, Activity, Bell, ChevronRight,
  Waves
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/detection', label: 'Detection Feed', icon: Radio, badge: '3 new' },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/cases', label: 'Active Cases', icon: Shield },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('goldie_auth');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col" style={{ background: '#1a1a2e' }}>
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#D4A843' }}>
              <Waves className="w-5 h-5 text-[#1a1a2e]" />
            </div>
            <div>
              <div className="font-bold text-white text-lg leading-none">Goldie</div>
              <div className="text-xs text-white/40 mt-0.5">Care Intelligence</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative',
                  isActive
                    ? 'text-white font-medium'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                )
              }
              style={({ isActive }) => isActive ? { background: 'rgba(212, 168, 67, 0.15)' } : {}}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style={{ background: '#D4A843' }} />
                  )}
                  <Icon className={cn('w-4 h-4', isActive ? 'text-[#D4A843]' : '')} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: '#D4A843', color: '#1a1a2e' }}>
                      {badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3 h-3 text-white/30" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 space-y-0.5">
          {/* Alert indicator */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50">
            <Bell className="w-4 h-4" />
            <span className="flex-1">Alerts</span>
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">4</span>
          </div>
          
          {/* System status */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <Activity className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-white/30">DART Engine Active</span>
          </div>

          {/* User */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-white/80 cursor-pointer"
            onClick={handleLogout}>
            <div className="w-6 h-6 rounded-full bg-[#D4A843]/20 flex items-center justify-center">
              <span className="text-xs text-[#D4A843] font-medium">D</span>
            </div>
            <span className="text-sm flex-1">Demo User</span>
            <LogOut className="w-3.5 h-3.5" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
