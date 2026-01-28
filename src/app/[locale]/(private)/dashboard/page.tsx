'use client';

import AdminDashboard from '@/components/dashboard/AdminDashboard';
import DentistDashboard from '@/components/dashboard/DentistDashboard';
import { JWTPayload } from '@/types/auth'; // Ensure this type exists as per previous steps
import { jwtDecode } from 'jwt-decode';
import { use, useEffect, useState } from 'react';

// Client component to safely access cookies (since we are in 'use client')
function getRoleFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'));
  if (match) {
    try {
      const decoded = jwtDecode<JWTPayload>(match[2]);
      // console.log("Decoded Token:", decoded); 
      // console.log("Role/Tipo detected:", decoded.tipoUsuario || decoded.role);
      
      // Return the available role field
      return decoded.tipoUsuario || decoded.role || null;
    } catch (e) {
      console.error("Invalid token", e);
      return null;
    }
  }
  return null;
}

export default function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [role, setRole] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const roleFromCookie = getRoleFromCookie();
    setRole(roleFromCookie);
  }, []);

  // Prevent hydration mismatch by defining a consistent server/client initial state
  if (!isMounted) {
    return <DentistDashboard locale={locale} />;
  }

  // Check for both legacy "ADMIN" and actual backend "ADMIN_TOTAL"
  if (role === 'ADMIN' || role === 'ADMIN_TOTAL') {
    return <AdminDashboard />;
  }
 
  return <DentistDashboard locale={locale} />;
}
