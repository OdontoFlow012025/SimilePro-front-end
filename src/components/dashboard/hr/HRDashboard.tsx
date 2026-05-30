"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import AddEmployeeModal from "./AddEmployeeModal";
import DismissEmployeeModal from "./DismissEmployeeModal";
import RubricasConfig from "./RubricasConfig";

export default function HRDashboard({ dict }: { dict: any }) {
  const hrDict = dict.hr;
  const [activeTab, setActiveTab] = useState<"payroll" | "employees" | "dismissals" | "rubrics">("payroll");

  // Payroll State
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [payrollData, setPayrollData] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [error, setError] = useState<string | null>(null);

   const tabs = [
    { id: "payroll", label: hrDict.tabs.payroll },
    { id: "employees", label: hrDict.tabs.employees },
    { id: "dismissals", label: hrDict.tabs.dismissals },
    { id: "rubrics", label: "Rubricas" },
  ] as const;

  // Employees State
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);

  const fetchPayroll = async (month: number, year: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.hr.getPayroll(month, year);
      setPayrollData(data);
    } catch (err: any) {
      if (err.message?.includes("não encontrada")) {
        setPayrollData(null); // Just empty
      } else {
        setError(typeof err === 'object' ? err.message || JSON.stringify(err) : String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
      setLoadingEmployees(true);
      setError(null);
      try {
          const data = await api.employees.list();
          setEmployees(data || []);
      } catch (err: any) {
          setError(typeof err === 'object' ? err.message || JSON.stringify(err) : String(err));
      } finally {
          setLoadingEmployees(false);
      }
  }

  useEffect(() => {
    if (activeTab === "payroll") {
      fetchPayroll(selectedMonth, selectedYear);
    } else if (activeTab === "employees") {
      fetchEmployees();
    }
  }, [activeTab, selectedMonth, selectedYear]);

  const handleProcessPayroll = async () => {
    setProcessing(true);
    setError(null);
    try {
      await api.hr.processPayroll({ mes: selectedMonth, ano: selectedYear });
      await fetchPayroll(selectedMonth, selectedYear);
    } catch (err: any) {
      setError(typeof err === 'object' ? err.message || JSON.stringify(err) : String(err));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111518] dark:text-white mb-2">
            {hrDict.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {hrDict.subtitle}
          </p>
        </div>

        {activeTab === "payroll" && (
            <div className="flex items-center gap-3">
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
                onClick={handleProcessPayroll}
                disabled={processing || (payrollData && payrollData.competencia?.status === 'PAGA')}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
            >
                {processing ? (
                    <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                ) : (
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                )}
                {hrDict.runPayrollBtn}
            </button>
            </div>
        )}
        
        {activeTab === "employees" && (
            <button 
                onClick={() => setIsAddEmployeeOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
            >
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                {hrDict.employees.admitBtn}
            </button>
        )}
      </div>

      {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex gap-2 items-center break-words max-w-full">
              <span className="material-symbols-outlined">error</span> 
              <span className="select-text">{String(error)}</span>
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
         {activeTab === 'payroll' && (
             <div>
                {loading ? (
                    <div className="flex justify-center items-center h-64"><span className="material-symbols-outlined animate-spin text-4xl text-gray-300">autorenew</span></div>
                ) : payrollData && payrollData.holerites && payrollData.holerites.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                <p className="text-sm text-gray-500">{hrDict.payroll.base}</p>
                                <p className="text-xl font-bold dark:text-white">R$ {(payrollData.competencia.totalBase).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600">
                                <p className="text-sm opacity-80">{hrDict.payroll.inss}</p>
                                <p className="text-xl font-bold">R$ {(payrollData.competencia.totalInss).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600">
                                <p className="text-sm opacity-80">{hrDict.payroll.irrf}</p>
                                <p className="text-xl font-bold">R$ {(payrollData.competencia.totalIrrf).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 text-green-600">
                                <p className="text-sm opacity-80">{hrDict.payroll.net}</p>
                                <p className="text-xl font-bold">R$ {(payrollData.competencia.totalLiq).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-3">{hrDict.employees.table.employee}</th>
                                        <th className="px-6 py-3">{hrDict.payroll.status}</th>
                                        <th className="px-6 py-3 text-right">{hrDict.payroll.table.base}</th>
                                        <th className="px-6 py-3 text-right text-red-500">{hrDict.payroll.table.discounts}</th>
                                        <th className="px-6 py-3 text-right text-green-600">{hrDict.payroll.table.net}</th>
                                        <th className="px-6 py-3 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payrollData.holerites.map((h: any) => (
                                        <tr key={h.id} className="border-b dark:border-gray-800">
                                            <td className="px-6 py-4 font-medium dark:text-white">
                                                {h.funcionario?.usuario?.nome || `${hrDict.payroll.matricula}${h.funcionarioId}`}
                                                <div className="text-xs text-gray-500">{h.funcionario?.cargo || hrDict.payroll.admin}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                                    {hrDict.payroll.processed}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">R$ {(h.salarioBase||0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                                            <td className="px-6 py-4 text-right text-red-500">- R$ {(h.totalDescontos||0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                                            <td className="px-6 py-4 text-right text-green-600 font-bold">R$ {(h.salarioLiquido||0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button className="text-blue-600 hover:text-blue-800 p-1" title="Editar Lançamentos">
                                                    <span className="material-symbols-outlined text-[20px]">edit_note</span>
                                                </button>
                                                <button className="text-gray-600 hover:text-gray-800 p-1" title="Gerar PDF">
                                                    <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center pt-16 pb-12">
                        <div className="size-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mb-4">
                            <span className="material-symbols-outlined text-[32px]">manage_accounts</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{hrDict.tabs.payroll}</h3>
                        <p className="text-gray-500 max-w-sm mb-6">{hrDict.payroll.empty}</p>
                        <button 
                            onClick={handleProcessPayroll}
                            disabled={processing}
                            className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-bold rounded-lg transition-colors"
                        >
                            {processing ? hrDict.payroll.processing : hrDict.payroll.generate}
                        </button>
                    </div>
                )}
             </div>
         )}
         
         {activeTab === 'employees' && (
             <div>
                {loadingEmployees ? (
                    <div className="flex justify-center items-center h-64"><span className="material-symbols-outlined animate-spin text-4xl text-gray-300">autorenew</span></div>
                ) : employees && employees.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">{hrDict.employees.table.employee}</th>
                                    <th className="px-6 py-3">{hrDict.employees.table.role}</th>
                                    <th className="px-6 py-3">{hrDict.employees.table.admission}</th>
                                    <th className="px-6 py-3">{hrDict.employees.table.salary}</th>
                                    <th className="px-6 py-3">{hrDict.employees.table.status}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.filter((e:any) => e.status !== "DEMITIDO").map((e: any) => (
                                    <tr key={e.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium dark:text-white flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold">
                                                {e.usuario?.nome?.charAt(0) || "F"}
                                            </div>
                                            <div>
                                                {e.usuario?.nome || hrDict.employees.noName}
                                                <div className="text-xs text-gray-500">{e.usuario?.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{e.cargo}</td>
                                        <td className="px-6 py-4">{new Date(e.dataAdmissao).toLocaleDateString('pt-BR')}</td>
                                        <td className="px-6 py-4">R$ {(e.salario || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${e.status === 'ATIVO' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                                {e.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center pt-16 pb-12">
                        <div className="size-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-4">
                            <span className="material-symbols-outlined text-[32px]">groups</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{hrDict.employees.emptyTitle}</h3>
                        <p className="text-gray-500 max-w-sm mb-6">{hrDict.employees.emptyDesc}</p>
                    </div>
                )}
             </div>
         )}

         {activeTab === 'dismissals' && (
             <div>
                <div className="flex justify-end mb-4">
                    <button 
                        onClick={() => setIsDismissModalOpen(true)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-sm text-sm"
                    >
                        <span className="material-symbols-outlined text-[18px]">block</span>
                        {hrDict.dismissals.registerBtn}
                    </button>
                </div>

                {loadingEmployees ? (
                    <div className="flex justify-center items-center h-64"><span className="material-symbols-outlined animate-spin text-4xl text-gray-300">autorenew</span></div>
                ) : employees.filter((e:any) => e.status === "DEMITIDO").length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">{hrDict.dismissals.table.exEmployee}</th>
                                    <th className="px-6 py-3">{hrDict.dismissals.table.role}</th>
                                    <th className="px-6 py-3">{hrDict.dismissals.table.date}</th>
                                    <th className="px-6 py-3">{hrDict.dismissals.table.reason}</th>
                                    <th className="px-6 py-3">{hrDict.dismissals.table.status}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.filter((e:any) => e.status === "DEMITIDO").map((e: any) => (
                                    <tr key={e.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium dark:text-white flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center font-bold">
                                                {e.usuario?.nome?.charAt(0) || "F"}
                                            </div>
                                            <div>
                                                {e.usuario?.nome || hrDict.employees.noName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{e.cargo}</td>
                                        <td className="px-6 py-4">{e.dataDemissao ? new Date(e.dataDemissao).toLocaleDateString('pt-BR') : '-'}</td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={e.motivoDemissao}>{e.motivoDemissao}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                                {e.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                     <div className="text-gray-500 flex flex-col items-center justify-center pt-16 pb-12 text-center">
                         <span className="material-symbols-outlined text-4xl mb-4 text-gray-300">receipt_long</span>
                         <p className="font-bold text-gray-700 dark:text-gray-300">{hrDict.dismissals.emptyTitle}</p>
                         <p className="text-sm mt-2 max-w-sm">{hrDict.dismissals.emptyDesc}</p>
                     </div>
                )}
             </div>
         )}
         {activeTab === 'rubrics' && (
             <RubricasConfig dict={dict} />
         )}
      </div>

      <DismissEmployeeModal
          isOpen={isDismissModalOpen}
          onClose={() => setIsDismissModalOpen(false)}
          employees={employees}
          onSuccess={() => {
              fetchEmployees();
          }}
          dict={hrDict}
      />

      <AddEmployeeModal 
          isOpen={isAddEmployeeOpen} 
          onClose={() => setIsAddEmployeeOpen(false)} 
          onSuccess={() => {
              fetchEmployees();
          }}
          dict={hrDict}
      />
    </div>
  );
}
