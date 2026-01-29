"use client";

import { JWTPayload } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import DentistDashboard from "./DentistDashboard";

// Helper function to read cookie
function getRoleFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )auth_token=([^;]+)"));
  if (match) {
    try {
      const decoded = jwtDecode<JWTPayload>(match[2]);
      return decoded.tipoUsuario || decoded.role || null;
    } catch (e) {
      console.error("Invalid token", e);
      return null;
    }
  }
  return null;
}

interface ClientDashboardWrapperProps {
  locale: string;
  dictionary: any;
}

export default function ClientDashboardWrapper({ locale, dictionary }: ClientDashboardWrapperProps) {
  const [role, setRole] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const roleFromCookie = getRoleFromCookie();
    setRole(roleFromCookie);
  }, []);

  if (!isMounted) {
    return <DentistDashboard locale={locale} dictionary={dictionary} />;
  }

  if (role === "ADMIN" || role === "ADMIN_TOTAL") {
    // Pass dictionary to AdminDashboard
    return <AdminDashboard dictionary={dictionary} />;
  }

  // Pass dictionary to DentistDashboard (even if not fully used yet)
  return <DentistDashboard locale={locale} dictionary={dictionary} />;
}
