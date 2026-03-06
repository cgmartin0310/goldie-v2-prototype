import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MapPin, DollarSign, BarChart3, TrendingUp,
  LogOut, Activity, ChevronRight, Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/counties', label: 'Counties', icon: MapPin },
  { to: '/admin/revenue', label: 'Revenue', icon: DollarSign },
  { to: '/admin/metrics', label: 'Platform Metrics', icon: BarChart3 },
  { to: '/admin/expansion', label: 'Expansion', icon: TrendingUp },
];

export default function AdminLayout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('goldie_auth');
    localStorage.removeItem('goldie_role');
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0d0d1a' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0f1120 100%)', borderRight: '1px solid rgba(212,168,67,0.15)' }}>
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center">
            <img src="/goldie-logo-full.png" alt="Goldie Health" className="h-9 w-auto" />
          </div>
        </div>

        {/* Admin identity */}
        <div className="px-4 py-3 border-b border-white/5" style={{ background: 'rgba(212,168,67,0.08)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #D4A843 0%, #b8892e 100%)' }}>
              <Building2 className="w-4 h-4 text-[#1a1a2e]" />
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-white truncate">Goldie HQ</div>
              <div className="text-[10px] text-[#D4A843]/70 truncate">Platform Administration</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
            <span className="text-[10px] text-white/40">9 Counties · Live Network</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
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
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                      style={{ background: '#D4A843' }} />
                  )}
                  <Icon className={cn('w-4 h-4', isActive ? 'text-[#D4A843]' : '')} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 text-white/30" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 space-y-0.5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <Activity className="w-3.5 h-3.5 text-[#D4A843]" />
            <span className="text-xs text-white/30">All Systems Operational</span>
          </div>

          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-white/80 cursor-pointer transition-colors"
            onClick={handleLogout}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,168,67,0.2)' }}>
              <span className="text-xs text-[#D4A843] font-bold">G</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/60 truncate">admin@goldie.health</div>
            </div>
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
          </div>
          <div className="px-3 py-1">
            <div className="text-[9px] text-white/20">Goldie Health, Inc. · Internal</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        {children}
      </main>
    </div>
  );
}
