import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Building2, Heart, Shield, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CREDENTIALS: Record<string, { role: string; redirect: string }> = {
  'demo@goldie.health':    { role: 'county',    redirect: '/dashboard' },
  'county@goldie.health':  { role: 'county',    redirect: '/dashboard' },
  'provider@goldie.health':{ role: 'provider',  redirect: '/provider/dashboard' },
  'payer@goldie.health':   { role: 'payer',     redirect: '/payer/dashboard' },
  'admin@goldie.health':   { role: 'admin',     redirect: '/admin/dashboard' },
};

const PORTAL_LABELS: Record<string, { name: string; sub: string; letter: string }> = {
  county:   { name: 'Catawba County Health Department', sub: 'County Public Health Portal', letter: 'C' },
  provider: { name: 'Alliance Health — Provider Network', sub: 'Treatment Provider Portal', letter: 'P' },
  payer:    { name: 'Blue Cross NC — Payer Analytics', sub: 'Insurance & Payer Portal', letter: 'B' },
  admin:    { name: 'Goldie HQ — Platform Administration', sub: 'Goldie HQ Portal', letter: 'G' },
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Derive which portal is being targeted based on typed email
  const matchedCred = CREDENTIALS[email.toLowerCase()];
  const detectedRole = matchedCred?.role;
  const portalLabel = detectedRole ? PORTAL_LABELS[detectedRole] : null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));

    const cred = CREDENTIALS[email.toLowerCase()];
    if (cred && password === 'goldie2026') {
      localStorage.setItem('goldie_auth', email.toLowerCase());
      localStorage.setItem('goldie_role', cred.role);
      navigate(cred.redirect);
    } else {
      setError('Invalid credentials. Contact your Goldie administrator.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#1a1a2e' }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>

        <div className="flex items-center">
          <img src="/goldie-logo-full.png" alt="Goldie Health" className="h-12 w-auto" />
        </div>

        <div>
          <div className="space-y-4 mb-12">
            <p className="text-[#D4A843] text-sm font-semibold uppercase tracking-widest">
              Transforming Crisis into Care
            </p>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Connecting every<br />
              touchpoint in the<br />
              <span style={{ color: '#D4A843' }}>care journey.</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed">
              Real-time detection, risk stratification, and care coordination
              across the conditions that drive the highest costs.
            </p>
          </div>

          {/* Three stakeholder cards */}
          <div className="space-y-3">
            {[
              {
                icon: Building2,
                title: 'Public Health',
                desc: 'Detect high-risk patients before the next crisis',
                color: '#3b82f6',
              },
              {
                icon: Heart,
                title: 'Treatment Providers',
                desc: 'Receive qualified referrals at the moment of highest motivation',
                color: '#D4A843',
              },
              {
                icon: Shield,
                title: 'Insurance & Payers',
                desc: 'Measurable cost reduction through coordinated intervention',
                color: '#22c55e',
              },
              {
                icon: LayoutDashboard,
                title: 'Goldie HQ',
                desc: 'Full platform view — revenue, pipeline, and network health',
                color: '#D4A843',
              },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-xl px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}22` }}>
                    <Icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{item.title}</div>
                    <div className="text-xs text-white/40 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              );
            })}
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
          <div className="lg:hidden flex items-center mb-8">
            <img src="/goldie-logo-full.png" alt="Goldie Health" className="h-10 w-auto" />
          </div>

          <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-[#D4A843]" />
                <span className="text-xs font-medium text-[#D4A843] uppercase tracking-wider">Secure Access</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Sign In</h2>

              {/* Dynamic portal indicator */}
              <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg transition-all"
                style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)' }}>
                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(212,168,67,0.15)' }}>
                  <span className="text-[#D4A843] text-xs font-bold">
                    {portalLabel?.letter ?? 'G'}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    {portalLabel?.name ?? 'Goldie Health Platform'}
                  </div>
                  <div className="text-[10px] text-white/40">
                    {portalLabel?.sub ?? 'Goldie NC Network · Investor Demo'}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  name="goldie-email-new"
                  autoComplete="new-password"
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
                  name="goldie-pass-new"
                  autoComplete="new-password"
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
              <p className="text-xs text-white/30">Authorized personnel only · Goldie NC Network · 9 Counties</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
