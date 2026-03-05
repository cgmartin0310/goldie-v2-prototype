import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DetectionFeed from './pages/DetectionFeed';
import Patients from './pages/Patients';
import PatientProfile from './pages/PatientProfile';
import Cases from './pages/Cases';
import Analytics from './pages/Analytics';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const auth = localStorage.getItem('goldie_auth');
  if (!auth) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/detection" element={<PrivateRoute><DetectionFeed /></PrivateRoute>} />
        <Route path="/patients" element={<PrivateRoute><Patients /></PrivateRoute>} />
        <Route path="/patients/:id" element={<PrivateRoute><PatientProfile /></PrivateRoute>} />
        <Route path="/cases" element={<PrivateRoute><Cases /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
