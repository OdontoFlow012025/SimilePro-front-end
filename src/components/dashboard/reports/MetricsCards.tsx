"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";

interface MetricsCardsProps {
  dict: any;
  clinicaId: string;
  isRede: boolean;
}

export default function MetricsCards({ dict, clinicaId, isRede }: MetricsCardsProps) {
  const [kpis, setKpis] = useState({
    revenue: 0,
    patients: 0,
    appointments: 0,
    pending: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const queryParams = new URLSearchParams();
    if (isRede) queryParams.append("rede", "true");
    if (clinicaId) queryParams.append("clinica_id", clinicaId);
    
    api.accounting.getBIDashboard(queryParams.toString())
      .then(data => {
        if (data?.metrics) {
          setKpis(data.metrics);
        }
      })
      .catch(err => console.error("Error fetching BI metrics:", err))
      .finally(() => setIsLoading(false));
  }, [clinicaId, isRede]);

  const valueFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const metrics = [
    {
      title: dict?.reports?.metrics?.revenue || "Receita Total",
      value: isLoading ? "---" : valueFormatter.format(kpis.revenue),
      change: "+12%",
      isPositive: true,
      icon: "payments",
      color: "blue"
    },
    {
      title: dict?.reports?.metrics?.patients || "Pacientes Ativos",
      value: isLoading ? "---" : kpis.patients.toString(),
      change: "+5%",
      isPositive: true,
      icon: "personal_injury",
      color: "emerald"
    },
    {
      title: dict?.reports?.metrics?.appointments || "Consultas Realizadas",
      value: isLoading ? "---" : kpis.appointments.toString(),
      change: "-2%",
      isPositive: false,
      icon: "event_available",
      color: "indigo"
    },
    {
      title: dict?.reports?.metrics?.pending || "Inadimplência",
      value: isLoading ? "---" : valueFormatter.format(kpis.pending),
      change: "-8%",
      isPositive: true, // A decrease in pending payments is good
      icon: "money_off",
      color: "rose"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const colorClasses: Record<string, string> = {
          blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
          emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
          indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
          rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
        };

        return (
          <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className={`size-12 rounded-xl flex items-center justify-center ${colorClasses[metric.color]}`}>
                <span className="material-symbols-outlined text-2xl">{metric.icon}</span>
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                metric.isPositive 
                  ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' 
                  : 'text-rose-700 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400'
              }`}>
                <span className="material-symbols-outlined text-[14px]">
                  {metric.change.startsWith('+') ? 'trending_up' : 'trending_down'}
                </span>
                {metric.change}
              </span>
            </div>
            
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                {metric.title}
              </p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                {metric.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
