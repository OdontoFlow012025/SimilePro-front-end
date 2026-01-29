"use client";

import { ThemeToggle } from "@/components/ThemeToggle";

import { api } from "@/services/api";
import { useEffect, useState } from "react";

export default function Header({ dictionary }: { dictionary: any }) {
  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>("");

  useEffect(() => {
    async function fetchUnits() {
        try {
            const data = await api.clinics.list();
            // If data is array and has items, use it
            if (Array.isArray(data) && data.length > 0) {
                setUnits(data);
                setSelectedUnit(data[0].nome || "Unidade Principal");
            } else {
                 // Fallback if empty array
                 setUnits([{ nome: "Unidade Principal" }]);
                 setSelectedUnit("Unidade Principal");
            }
        } catch (err) {
            console.warn("Failed to fetch clinics, using default.", err);
            // Safe fallback on error (401/400 etc)
            // For now, let's assume if it fails, we show at least one to not break layout. 
            // Or if you want to test the multi-unit logic, we can mock 3 here.
            // But for production, better to be safe.
            setUnits([{ nome: "Unidade Principal" }]); 
            setSelectedUnit("Unidade Principal");
        }
    }
    fetchUnits();
  }, []);

  const hasBranches = units.length > 1;

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 py-4 border-b border-gray-200 dark:border-gray-800">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{dictionary?.dashboard?.header?.title || "Visão Geral da Clínica"}</h2>
        <p className="text-sm text-gray-500">{dictionary?.dashboard?.header?.subtitle || "Monitoramento integrado: Administrativo e Operacional."}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative group z-50">
            {/* Trigger Button */}
            <div className={`hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors ${hasBranches ? 'cursor-pointer hover:border-blue-500 group' : 'cursor-default opacity-80'}`}>
                <span className="material-symbols-outlined text-blue-500 text-lg">location_on</span>
                <span className="text-sm font-medium dark:text-white min-w-[120px]">
                    {selectedUnit}
                </span>
                {hasBranches && (
                    <span className="material-symbols-outlined text-gray-400 text-lg group-hover:text-blue-500 transition-colors">expand_more</span>
                )}
            </div>

            {/* Dropdown Menu - Only if multiple units */}
            {hasBranches && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <ul className="py-1">
                        {units.map((unit, idx) => (
                            <li 
                                key={idx} 
                                onClick={() => setSelectedUnit(unit.nome)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl"
                            >
                                <span className={`size-1.5 rounded-full ${selectedUnit === unit.nome ? 'bg-blue-500' : 'bg-transparent'}`}></span>
                                {unit.nome}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        
        <ThemeToggle />
        
        <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 relative hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <span className="material-symbols-outlined">notifications</span>

        </button>
      </div>
    </header>
  );
}
