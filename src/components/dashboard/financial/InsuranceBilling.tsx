"use client";

import PlaceholderPage from "../PlaceholderPage";

export default function InsuranceBilling({ dictionary }: { dictionary: any }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
       <h2 className="text-xl font-bold mb-4 dark:text-white">Faturamento de Convênios</h2>
       <p className="text-gray-500 dark:text-gray-400 mb-6">Gestão de guias, lotes de faturamento e repasses de operadoras de saúde.</p>
       <PlaceholderPage title="Módulo de Convênios" />
    </div>
  );
}
