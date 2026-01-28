"use client";

import { useEffect, useState } from "react";

export default function CriticalPendencies() {
  // Placeholder data
  const [pendencies, setPendencies] = useState([
    { id: 1, name: "Dental Cremer Ltda.", desc: "Fornecedor • Vence hoje", value: 1450, type: "PAYMENT" },
    { id: 2, name: "Mariana Costa", desc: "Inadimplente • 5 dias", value: 380, type: "RECEIVABLE" }
  ]);

  useEffect(() => {
    // const fetchPendencies = async () => {
    //   const data = await api.billing.getOverdueInvoices();
    //   setPendencies(data...);
    // };
    // fetchPendencies();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
        <span className="material-symbols-outlined text-red-500">warning</span> Pendências Críticas
      </h3>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-800">
        
        {pendencies.map((item) => (
          <div key={item.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
                <span className="material-symbols-outlined">
                  {item.type === 'PAYMENT' ? 'local_shipping' : 'person_pin'}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold dark:text-white">{item.name}</p>
                <p className={`text-xs font-medium ${item.type === 'RECEIVABLE' ? 'text-red-500' : 'text-gray-500'}`}>
                  {item.desc}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-bold ${item.type === 'PAYMENT' ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                {formatCurrency(item.value)}
              </p>
              <button className="text-[10px] font-bold text-blue-500 uppercase hover:underline">
                {item.type === 'PAYMENT' ? 'Pagar' : 'Cobrar'}
              </button>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
