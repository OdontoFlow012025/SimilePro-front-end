"use client";

import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import { api } from "@/services/api";

interface ClientDashboardWrapperProps {
  locale: string;
  dictionary: any;
}

export default function ClientDashboardWrapper({ locale, dictionary }: ClientDashboardWrapperProps) {
  const [role, setRole] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await api.auth.me();
        const userRole = userData.tipoUsuario || userData.role || null;
        setRole(userRole);
        if (userRole === "ADMIN_TOTAL") {
          setSubscriptionStatus(await api.subscription.getStatus());
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-4xl text-blue-500">autorenew</span>
          <p className="text-gray-500 font-medium animate-pulse">Identificando perfil de acesso...</p>
        </div>
      </div>
    );
  }

  if (role === "ADMIN_TOTAL") {
    return <AdminDashboard dictionary={dictionary} subscriptionStatus={subscriptionStatus} locale={locale} />;
  }

  return <div className="p-8 text-gray-500">O painel geral é exclusivo do administrador total da rede.</div>;
}
