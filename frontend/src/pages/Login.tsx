import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));

    if (email === 'demo@goldie.health' && password === 'goldie2026') {
      localStorage.setItem('goldie_auth', 'demo');
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#1a1a2e' }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        
        <div className="flex items-center gap-3">
          <img src="/logo-goldie.svg" alt="Goldie Health" className="h-10 w-auto" />
          <span className="text-white text-2xl font-bold">Goldie</span>
        </div>

        <div>
          <div className="space-y-6 mb-12">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Connecting every<br />
              touchpoint in the<br />
              <span style={{ color: '#D4A843' }}>recovery journey.</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed">
              Care intelligence platform for substance use disorder — 
              detecting patients, assessing risk, and closing the loop 
              on every intervention.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '50%', label: 'of OD victims refuse transport' },
              { value: '6.4%', label: 'initiate treatment in 30 days' },
              { value: '73%', label: 'repeat OD risk without intervention' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: '#D4A843' }}>{stat.value}</div>
                <div className="text-xs text-white/40 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-white/20 text-xs">
          CARESTREAM™ and DART™ are patent-pending technologies of Goldie Health, Inc.
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src="/logo-goldie.svg" alt="Goldie Health" className="h-10 w-auto" />
            <span className="text-white text-2xl font-bold">Goldie</span>
          </div>

          <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-[#D4A843]" />
                <span className="text-xs font-medium text-[#D4A843] uppercase tracking-wider">Secure Access</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Sign In</h2>
              <p className="text-white/40 text-sm mt-1">Investor demo environment</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white bg-white/5 border border-white/10 focus:border-[#D4A843] focus:outline-none focus:ring-1 focus:ring-[#D4A843] placeholder-white/20 transition-colors"
                  placeholder="Email address"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white bg-white/5 border border-white/10 focus:border-[#D4A843] focus:outline-none focus:ring-1 focus:ring-[#D4A843] placeholder-white/20 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="text-xs text-red-400">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-sm font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#1a1a2e]/30 border-t-[#1a1a2e] rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </Button>
            </form>

            <div className="mt-5 p-3 rounded-lg" style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)' }}>
              <p className="text-xs text-white/30">Authorized personnel only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
