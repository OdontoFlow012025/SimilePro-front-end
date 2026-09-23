"use client";

import Link from "next/link";
import AttendanceFlow from "./AttendanceFlow";
import BIIndicators from "./BIIndicators";
import CashFlowChart from "./CashFlowChart";
import CriticalPendencies from "./CriticalPendencies";
import FinancialStats from "./FinancialStats";
import QuickActions from "./QuickActions";

export default function AdminDashboard({ dictionary, subscriptionStatus, locale }: { dictionary: any, subscriptionStatus: any, locale: string }) {
  const isExpired = subscriptionStatus && !subscriptionStatus.isActive;

  const wrapPremium = (children: React.ReactNode, title: string) => {
    if (!isExpired) return children;
    return (
      <div className="relative group cursor-not-allowed">
        <div className="blur-[2px] pointer-events-none opacity-50 grayscale transition-all group-hover:blur-[1px]">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center">
          <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-xl shadow-xl border border-amber-200 dark:border-amber-800/30 backdrop-blur-md">
            <span className="material-symbols-outlined text-amber-500 text-3xl mb-2">lock</span>
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Módulo Premium Bloqueado</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Sua assinatura expirou. Renove para acessar este recurso.</p>
            <Link href={`/${locale}/pricing`} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Ver Planos</Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
      {isExpired && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-4 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Assinatura Expirada</p>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/60">Sua clínica está operando no modo de segurança (Plano FREE). Recursos administrativos avançados foram suspensos.</p>
          </div>
          <Link href={`/${locale}/pricing`} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
            Renovar Agora
          </Link>
        </div>
      )}

      {wrapPremium(<FinancialStats dictionary={dictionary} />, "Financeiro")}
      <AttendanceFlow dictionary={dictionary} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {wrapPremium(<CashFlowChart dictionary={dictionary} />, "Fluxo de Caixa")}
        {wrapPremium(<BIIndicators dictionary={dictionary} />, "Indicadores BI")}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CriticalPendencies dictionary={dictionary} />
          <QuickActions dictionary={dictionary} />
      </div>
    </div>
  );
}
