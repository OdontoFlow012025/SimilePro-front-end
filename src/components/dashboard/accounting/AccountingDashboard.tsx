"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import IssueNfseModal from "./IssueNfseModal";
import PrintNfseModal from "./PrintNfseModal";

export default function AccountingDashboard({ dict }: { dict: any }) {
  const accDict = dict.accounting;
  const [activeTab, setActiveTab] = useState<"dre" | "nfse" | "taxes">("dre");

  const [loading, setLoading] = useState(false);
  const [dreData, setDreData] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [error, setError] = useState<string | null>(null);

  const [nfseData, setNfseData] = useState<any[]>([]);
  const [loadingNfse, setLoadingNfse] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedNfToPrint, setSelectedNfToPrint] = useState<any>(null);

  const tabs = [
    { id: "dre", label: accDict.tabs.dre },
    { id: "nfse", label: accDict.tabs.nfse },
    { id: "taxes", label: accDict.tabs.taxes },
  ] as const;

  const fetchDRE = async (month: number, year: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.accounting.getDREMensal(month, year);
      setDreData(data);
    } catch (err: any) {
      setError(err.message || "Erro ao gerar DRE.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "dre") {
      fetchDRE(selectedMonth, selectedYear);
    }
  }, [activeTab, selectedMonth, selectedYear]);

  const handleGenerateDRE = () => {
    fetchDRE(selectedMonth, selectedYear);
  };

  const fetchNfse = async () => {
    setLoadingNfse(true);
    try {
      const data = await api.fiscal.listInvoices();
      setNfseData(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNfse(false);
    }
  };

  useEffect(() => {
    if (activeTab === "nfse") {
      fetchNfse();
    }
  }, [activeTab]);

  const formatCurrency = (val: number) => {
      if (typeof val !== 'number') return "R$ 0,00";
      return "R$ " + val.toLocaleString('pt-BR', {minimumFractionDigits:2});
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111518] dark:text-white mb-2">
            {accDict.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {accDict.subtitle}
          </p>
        </div>

        <div className="flex gap-3 items-center">
            {activeTab === 'dre' && (
                <>
                <div className="flex items-center bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 shadow-sm">
                    <select 
                        value={selectedMonth} 
                        onChange={e => setSelectedMonth(Number(e.target.value))}
                        className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none w-14 cursor-pointer text-gray-700 dark:text-gray-300"
                    >
                        {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                        ))}
                    </select>
                    <span className="text-gray-400 mx-1">/</span>
                    <select 
                        value={selectedYear} 
                        onChange={e => setSelectedYear(Number(e.target.value))}
                        className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none cursor-pointer text-gray-700 dark:text-gray-300"
                    >
                        {[2024, 2025, 2026, 2027].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <button 
                  onClick={handleGenerateDRE}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
                >
                   {loading ? <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span> : null}
                   {accDict.dre.generateBtn}
                </button>
                </>
            )}
            {activeTab === 'nfse' && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm whitespace-nowrap">
                   {accDict.nfse.issueBtn}
                </button>
            )}
        </div>
      </div>

      {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex gap-2 items-center">
              <span className="material-symbols-outlined">error</span> {error}
          </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 overflow-x-auto overflow-y-hidden scrollbar-hide">
        <ul className="flex flex-nowrap -mb-px text-sm font-medium text-center whitespace-nowrap" role="tablist">
          {tabs.map(tab => (
            <li className="mr-2" role="presentation" key={tab.id}>
              <button
                className={`inline-block px-4 py-3 rounded-t-lg border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 dark:text-gray-400 text-gray-500"
                }`}
                onClick={() => setActiveTab(tab.id as any)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden min-h-[400px] p-6">
         {activeTab === 'dre' && (
             <div className="w-full max-w-3xl mx-auto py-8">
                 {loading && !dreData ? (
                     <div className="flex justify-center items-center h-40"><span className="material-symbols-outlined animate-spin text-4xl text-gray-300">autorenew</span></div>
                 ) : (
                     <div className="bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
                         <div className="flex justify-between font-bold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700 pb-4 mb-4 text-lg">
                             <span>{accDict.dre.grossRevenue}</span>
                             <span>{formatCurrency(dreData?.grossRevenue)}</span>
                         </div>
                         <div className="flex justify-between text-red-500 border-b dark:border-gray-700 pb-3 mb-3 pl-4">
                             <span>(-) {accDict.dre.taxes}</span>
                             <span>{formatCurrency(dreData?.taxes)}</span>
                         </div>
                         <div className="flex justify-between font-bold text-blue-600 border-b dark:border-gray-700 pb-4 mb-4 text-lg">
                             <span>{accDict.dre.netRevenue}</span>
                             <span>{formatCurrency(dreData?.netRevenue)}</span>
                         </div>
                         <div className="flex justify-between text-orange-500 border-b dark:border-gray-700 pb-3 mb-3 pl-4">
                             <span>(-) {accDict.dre.costs}</span>
                             <span>{formatCurrency(dreData?.costs)}</span>
                         </div>
                         <div className="flex justify-between font-bold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700 pb-4 mb-4 text-lg">
                             <span>{accDict.dre.grossMargin}</span>
                             <span>{formatCurrency(dreData?.grossMargin)}</span>
                         </div>
                         <div className="flex justify-between text-red-400 border-b dark:border-gray-700 pb-3 mb-3 pl-4">
                             <span>(-) {accDict.dre.expenses}</span>
                             <span>{formatCurrency(dreData?.expenses)}</span>
                         </div>
                         <div className="flex justify-between font-extrabold text-[#00c02c] pt-4 text-2xl">
                             <span>{accDict.dre.netIncome}</span>
                             <span>{formatCurrency(dreData?.netIncome)}</span>
                         </div>
                     </div>
                 )}
             </div>
         )}
         {activeTab === 'nfse' && (
             <div className="pt-4">
                <div className="flex justify-end mb-6">
                    <button 
                        onClick={() => setIsIssueModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Nova Nota Fiscal
                    </button>
                </div>

                {loadingNfse ? (
                    <div className="flex justify-center items-center h-64"><span className="material-symbols-outlined animate-spin text-4xl text-gray-300">autorenew</span></div>
                ) : nfseData.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3 border-b dark:border-gray-700">RPS / Número</th>
                                    <th className="px-6 py-3 border-b dark:border-gray-700">Serviço</th>
                                    <th className="px-6 py-3 border-b dark:border-gray-700">Valor (R$)</th>
                                    <th className="px-6 py-3 border-b dark:border-gray-700">Imposto (ISS)</th>
                                    <th className="px-6 py-3 border-b dark:border-gray-700">Data</th>
                                    <th className="px-6 py-3 border-b dark:border-gray-700">Status</th>
                                    <th className="px-6 py-3 border-b dark:border-gray-700">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nfseData.map((nf: any) => (
                                    <tr key={nf.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                            {nf.rps || nf.numero}
                                            <div className="text-xs font-normal text-gray-500">Série {nf.serie}</div>
                                        </td>
                                        <td className="px-6 py-4 truncate max-w-[200px]" title={nf.descricao}>{nf.descricao}</td>
                                        <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(nf.valorTotal)}</td>
                                        <td className="px-6 py-4 text-red-500">{formatCurrency(nf.valorIss)} ({nf.aliquota}%)</td>
                                        <td className="px-6 py-4">{new Date(nf.createdAt).toLocaleDateString('pt-BR')}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                                {nf.status || "AUTORIZADO"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => setSelectedNfToPrint(nf)}
                                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                                title="Imprimir / Salvar PDF"
                                            >
                                                <span className="material-symbols-outlined">print</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center pt-16 pb-12">
                         <div className="size-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mb-4">
                             <span className="material-symbols-outlined text-[32px]">receipt_long</span>
                         </div>
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{accDict.tabs.nfse}</h3>
                         <p className="text-gray-500 max-w-sm mb-6">{accDict.nfse.empty}</p>
                    </div>
                )}
             </div>
         )}
         {activeTab === 'taxes' && (
             <div className="flex flex-col items-center justify-center text-center pt-16 pb-12 animate-in fade-in duration-300">
                  <div className="size-16 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-500 mb-4 border border-blue-100 dark:border-blue-800">
                      <span className="material-symbols-outlined text-[32px]">account_balance</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{accDict?.taxesTab?.title || "Central de Impostos e Guias"}</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                      {accDict?.taxesTab?.description || "A funcionalidade de geração automática e emissão de guias de impostos (DAS, DARF) integradas diretamente da plataforma está sendo finalizada e lançada na próxima atualização."}
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-left text-gray-600 dark:text-gray-300 max-w-md w-full shadow-sm">
                      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200"><span className="material-symbols-outlined text-[18px] text-gray-400">description</span> {accDict?.taxesTab?.das || "Simples Nacional (DAS)"}</span>
                          <span className="text-orange-600 dark:text-orange-400 font-bold text-[10px] uppercase bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 px-2 py-0.5 rounded">{accDict?.taxesTab?.comingSoon || "Em Breve"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200"><span className="material-symbols-outlined text-[18px] text-gray-400">assured_workload</span> {accDict?.taxesTab?.darf || "Guia DARF (IRPJ / CSLL)"}</span>
                          <span className="text-orange-600 dark:text-orange-400 font-bold text-[10px] uppercase bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 px-2 py-0.5 rounded">{accDict?.taxesTab?.comingSoon || "Em Breve"}</span>
                      </div>
                  </div>
             </div>
         )}
      </div>

      <IssueNfseModal
          isOpen={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
          onSuccess={() => {
              fetchNfse();
              if (activeTab === "dre") fetchDRE(selectedMonth, selectedYear);
          }}
      />

      <PrintNfseModal
          isOpen={!!selectedNfToPrint}
          onClose={() => setSelectedNfToPrint(null)}
          nf={selectedNfToPrint}
          dict={accDict}
      />
    </div>
  );
}
