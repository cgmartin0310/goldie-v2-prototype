import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProviderLayout from './components/ProviderLayout';
import PayerLayout from './components/PayerLayout';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';

// County pages
import Dashboard from './pages/Dashboard';
import DetectionFeed from './pages/DetectionFeed';
import Patients from './pages/Patients';
import PatientProfile from './pages/PatientProfile';
import Cases from './pages/Cases';
import Analytics from './pages/Analytics';

// Provider pages
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderReferrals from './pages/provider/ProviderReferrals';
import ProviderOutcomes from './pages/provider/ProviderOutcomes';

// Payer pages
import PayerDashboard from './pages/payer/PayerDashboard';
import PayerPopulation from './pages/payer/PayerPopulation';
import PayerROI from './pages/payer/PayerROI';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCounties from './pages/admin/AdminCounties';
import AdminRevenue from './pages/admin/AdminRevenue';
import AdminMetrics from './pages/admin/AdminMetrics';
import AdminExpansion from './pages/admin/AdminExpansion';

function getRole(): string | null {
  return localStorage.getItem('goldie_role');
}

function isAuthed(): boolean {
  return !!localStorage.getItem('goldie_auth');
}

// County private route
function CountyRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthed()) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

// Provider private route
function ProviderRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthed()) return <Navigate to="/" replace />;
  if (getRole() !== 'provider') return <Navigate to="/dashboard" replace />;
  return <ProviderLayout>{children}</ProviderLayout>;
}

// Payer private route
function PayerRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthed()) return <Navigate to="/" replace />;
  if (getRole() !== 'payer') return <Navigate to="/dashboard" replace />;
  return <PayerLayout>{children}</PayerLayout>;
}

// Admin private route
function AdminRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthed()) return <Navigate to="/" replace />;
  if (getRole() !== 'admin') return <Navigate to="/dashboard" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

// Root redirect based on role
function RootRedirect() {
  if (!isAuthed()) return <Login />;
  const role = getRole();
  if (role === 'provider') return <Navigate to="/provider/dashboard" replace />;
  if (role === 'payer') return <Navigate to="/payer/dashboard" replace />;
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
}

// Catch-all based on role
function DefaultRedirect() {
  if (!isAuthed()) return <Navigate to="/" replace />;
  const role = getRole();
  if (role === 'provider') return <Navigate to="/provider/dashboard" replace />;
  if (role === 'payer') return <Navigate to="/payer/dashboard" replace />;
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<RootRedirect />} />

        {/* County portal */}
        <Route path="/dashboard" element={<CountyRoute><Dashboard /></CountyRoute>} />
        <Route path="/detection" element={<CountyRoute><DetectionFeed /></CountyRoute>} />
        <Route path="/patients" element={<CountyRoute><Patients /></CountyRoute>} />
        <Route path="/patients/:id" element={<CountyRoute><PatientProfile /></CountyRoute>} />
        <Route path="/cases" element={<CountyRoute><Cases /></CountyRoute>} />
        <Route path="/analytics" element={<CountyRoute><Analytics /></CountyRoute>} />

        {/* Provider portal */}
        <Route path="/provider/dashboard" element={<ProviderRoute><ProviderDashboard /></ProviderRoute>} />
        <Route path="/provider/referrals" element={<ProviderRoute><ProviderReferrals /></ProviderRoute>} />
        <Route path="/provider/outcomes" element={<ProviderRoute><ProviderOutcomes /></ProviderRoute>} />
        <Route path="/provider/settings" element={<ProviderRoute><ProviderDashboard /></ProviderRoute>} />

        {/* Payer portal */}
        <Route path="/payer/dashboard" element={<PayerRoute><PayerDashboard /></PayerRoute>} />
        <Route path="/payer/population" element={<PayerRoute><PayerPopulation /></PayerRoute>} />
        <Route path="/payer/roi" element={<PayerRoute><PayerROI /></PayerRoute>} />

        {/* Admin portal */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/counties" element={<AdminRoute><AdminCounties /></AdminRoute>} />
        <Route path="/admin/revenue" element={<AdminRoute><AdminRevenue /></AdminRoute>} />
        <Route path="/admin/metrics" element={<AdminRoute><AdminMetrics /></AdminRoute>} />
        <Route path="/admin/expansion" element={<AdminRoute><AdminExpansion /></AdminRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
