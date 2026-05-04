"use client";

import { api } from "@/services/api";
import { useEffect, useState } from "react";

export default function BIIndicators({ dictionary }: { dictionary?: any }) {
  const [indicators, setIndicators] = useState({
      occupancy: 0,
      occupancyDelta: 0,
      newPatients: 0
  });

  useEffect(() => {
    const fetchIndicators = async () => {
        try {
            const data = await api.admin.getStats();
            if (data) {
                setIndicators({
                    occupancy: data.occupancyRate || 0,
                    occupancyDelta: data.occupancyDelta || 0,
                    newPatients: data.newPatientsCount || 0
                });
            }
        } catch (error) {
            console.error("Failed to fetch BI stats:", error);
        }
    };
    fetchIndicators();
  }, []);

  const getDeltaColor = (delta: number) => {
      if (delta > 0) return "text-green-500";
      if (delta < 0) return "text-red-500";
      return "text-gray-500";
  };

  const getDeltaSign = (delta: number) => {
      if (delta > 0) return "+";
      return "";
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-6">
      <h3 className="text-lg font-bold dark:text-white">{dictionary?.dashboard?.bi?.title || "Indicadores BI"}</h3>
      
      {/* Ocupação */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="size-12 rounded-full border-4 border-blue-500 border-r-transparent flex items-center justify-center font-bold text-sm dark:text-white">
          {indicators.occupancy}%
        </div>
        <div>
          <p className="text-sm font-bold dark:text-white">{dictionary?.dashboard?.attendance?.occupancy || "Ocupação das Salas"}</p>
          <p className={`text-xs ${getDeltaColor(indicators.occupancyDelta)}`}>
            {getDeltaSign(indicators.occupancyDelta)}{indicators.occupancyDelta}% {dictionary?.dashboard?.bi?.vsPrevMonth || "vs mês anterior"}
          </p>
        </div>
      </div>

      {/* Novos Pacientes */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="size-12 rounded-full border-4 border-green-600 flex items-center justify-center font-bold text-sm dark:text-white">
          {indicators.newPatients}
        </div>
        <div>
          <p className="text-sm font-bold dark:text-white">{dictionary?.dashboard?.bi?.newPatients || "Novos Pacientes"}</p>
          <p className="text-xs text-gray-500">{dictionary?.dashboard?.bi?.currentMonth || "Mês Atual"}</p>
        </div>
      </div>
    </div>
  );
}
