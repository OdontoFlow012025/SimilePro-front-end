"use client";

import { api } from "@/services/api";
import { useEffect, useState } from "react";

export default function InventoryStock({ dictionary }: { dictionary: any }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNFForm, setShowNFForm] = useState(false);

  // Form State
  const [nfNumber, setNfNumber] = useState("");
  const [provider, setProvider] = useState("");
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.inventory.listProducts();
      setProducts(data || []);
    } catch (e: any) {
      console.error("Inventory error:", e.message || e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNF = async (e: React.FormEvent) => {
     e.preventDefault();
     try {
        await api.inventory.createInvoice({
           numero: nfNumber,
           fornecedor: provider,
           valorTotal: Number(totalValue),
           dataEmissao: new Date().toISOString(),
           itens: [] // Simplified for now
        });
        alert("Nota Fiscal lançada com sucesso!");
        setShowNFForm(false);
        loadProducts();
     } catch (e: any) {
        alert("Erro ao lançar NF: " + e.message);
     }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
       <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold dark:text-white">Estoque e Lançamento de NFs</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Controle de insumos e entrada de mercadorias.</p>
          </div>
          <button 
            onClick={() => setShowNFForm(!showNFForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined">{showNFForm ? 'close' : 'add'}</span>
            {showNFForm ? 'Cancelar' : 'Nova NF'}
          </button>
       </div>

       {showNFForm && (
         <form onSubmit={handleSubmitNF} className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Dados da Nota Fiscal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Número da NF</label>
                  <input 
                    type="text" required value={nfNumber} onChange={e => setNfNumber(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none focus:ring-2 ring-blue-500"
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Fornecedor</label>
                  <input 
                    type="text" required value={provider} onChange={e => setProvider(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none focus:ring-2 ring-blue-500"
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Valor Total</label>
                  <input 
                    type="number" step="0.01" required value={totalValue} onChange={e => setTotalValue(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none focus:ring-2 ring-blue-500"
                  />
               </div>
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition-colors shadow-sm">
               Salvar e Gerar Despesa
            </button>
         </form>
       )}

       <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                   <th className="py-4 text-xs font-bold text-gray-400 uppercase">Produto</th>
                   <th className="py-4 text-xs font-bold text-gray-400 uppercase">SKU</th>
                   <th className="py-4 text-xs font-bold text-gray-400 uppercase">Estoque Atual</th>
                   <th className="py-4 text-xs font-bold text-gray-400 uppercase">Unid.</th>
                   <th className="py-4 text-xs font-bold text-gray-400 uppercase text-right">Status</th>
                </tr>
             </thead>
             <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-500">Carregando estoque...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-500">Nenhum produto cadastrado.</td></tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                       <td className="py-4 font-medium dark:text-white">{p.nome}</td>
                       <td className="py-4 text-gray-500">{p.sku || '-'}</td>
                       <td className="py-4 font-bold dark:text-gray-300">{p.estoqueAtual}</td>
                       <td className="py-4 text-gray-500">{p.unidadeMedida}</td>
                       <td className="py-4 text-right">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.estoqueAtual <= p.estoqueMinimo ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                             {p.estoqueAtual <= p.estoqueMinimo ? 'BAIXO' : 'OK'}
                          </span>
                       </td>
                    </tr>
                  ))
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
}
