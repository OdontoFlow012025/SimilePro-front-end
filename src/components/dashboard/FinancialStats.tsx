"use client";

import { useEffect, useState } from "react";

export default function FinancialStats() {
  const [data, setData] = useState({
    dailyRevenue: { value: 4500, growth: 8.2 },
    monthlyExpenses: { value: 12300, growth: 2.4 },
    netProfit: { value: 8200, growth: 15 }
  });

  useEffect(() => {
    // Placeholder for actual API integration
    // const fetchData = async () => {
    //   const summary = await api.billing.getSummary();
    //   const balance = await api.accounting.getBalance();
    //   ... update state
    // };
    // fetchData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <section>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
        <span className="material-symbols-outlined text-blue-500">account_balance_wallet</span> Saúde Financeira
      </h3>
      <div className="flex flex-col md:flex-row overflow-x-auto gap-4 pb-2 snap-x scrollbar-hide">
        
        {/* Faturamento */}
        <div className="min-w-[280px] flex-1 bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm snap-start">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Faturamento do Dia</p>
          <div className="flex items-end gap-2">
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white">{formatCurrency(data.dailyRevenue.value)}</h4>
            <span className="text-green-600 text-xs font-bold mb-1.5">+{data.dailyRevenue.growth}%</span>
          </div>
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-green-600 h-full w-3/4"></div>
          </div>
        </div>

        {/* Despesas */}
        <div className="min-w-[280px] flex-1 bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm snap-start">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Despesas do Mês</p>
          <div className="flex items-end gap-2">
            <h4 className="text-2xl font-extrabold text-red-500">{formatCurrency(data.monthlyExpenses.value)}</h4>
            <span className="text-red-500 text-xs font-bold mb-1.5">+{data.monthlyExpenses.growth}%</span>
          </div>
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full w-1/2"></div>
          </div>
        </div>

        {/* Lucro */}
        <div className="min-w-[280px] flex-1 bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm snap-start">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Lucro Líquido Real</p>
          <div className="flex items-end gap-2">
            <h4 className="text-2xl font-extrabold text-green-600">{formatCurrency(data.netProfit.value)}</h4>
            <span className="text-green-600 text-xs font-bold mb-1.5">+{data.netProfit.growth}%</span>
          </div>
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-2/3"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
