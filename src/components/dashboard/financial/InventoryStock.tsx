"use client";

import { api } from "@/services/api";
import { useEffect, useState } from "react";

export default function InventoryStock({ dictionary }: { dictionary: any }) {
  const [products, setProducts] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNFForm, setShowNFForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"produtos" | "nfs">("produtos");

  // Form State
  const [nfNumber, setNfNumber] = useState("");
  const [provider, setProvider] = useState("");
  
  // Items State
  const [nfItems, setNfItems] = useState<{ produtoId: number, quantidade: number, precoUnitario: number }[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [itemPrice, setItemPrice] = useState<number>(0);

  const totalValue = nfItems.reduce((acc, item) => acc + (item.quantidade * item.precoUnitario), 0);

  const handleAddItem = () => {
    if (!selectedProductId || itemQuantity <= 0 || itemPrice < 0) return;
    setNfItems([...nfItems, {
      produtoId: Number(selectedProductId),
      quantidade: Number(itemQuantity),
      precoUnitario: Number(itemPrice)
    }]);
    setSelectedProductId("");
    setItemQuantity(1);
    setItemPrice(0);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch Products
      try {
        const prodsData = await api.inventory.listProducts();
        setProducts(prodsData || []);
      } catch (err: any) {
        console.error("Failed to load products:", err.message);
        setProducts([]);
      }

      // Fetch Invoices
      try {
        const invsData = await api.inventory.listInvoices();
        setInvoices(invsData || []);
      } catch (err: any) {
        console.error("Failed to load invoices:", err.message);
        setInvoices([]);
      }
      
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNF = async (e: React.FormEvent) => {
     e.preventDefault();
     if (nfItems.length === 0) {
       alert(dictionary.inventory.errors.emptyNf);
       return;
     }

     try {
        await api.inventory.createInvoice({
           numero: nfNumber,
           fornecedor: provider,
           valorTotal: totalValue,
           dataEmissao: new Date().toISOString(),
           itens: nfItems
        });
        alert(dictionary.inventory.errors.successNf);
        setShowNFForm(false);
        setNfItems([]);
        setNfNumber("");
        setProvider("");
        setActiveTab("nfs");
        loadData();
     } catch (e: any) {
        alert(dictionary.inventory.errors.failNf + e.message);
     }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
       <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold dark:text-white">{dictionary.inventory.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{dictionary.inventory.subtitle}</p>
          </div>
          <button 
            onClick={() => setShowNFForm(!showNFForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined">{showNFForm ? 'close' : 'add'}</span>
            {showNFForm ? dictionary.inventory.cancelBtn : dictionary.inventory.newNfBtn}
          </button>
       </div>

       {showNFForm && (
         <form onSubmit={handleSubmitNF} className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{dictionary.inventory.nfDataTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{dictionary.inventory.nfNumberLabel}</label>
                   <input 
                     type="text" required value={nfNumber} onChange={e => setNfNumber(e.target.value)}
                     className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none focus:ring-2 ring-blue-500"
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{dictionary.inventory.providerLabel}</label>
                   <input 
                     type="text" required value={provider} onChange={e => setProvider(e.target.value)}
                     className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none focus:ring-2 ring-blue-500"
                   />
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-3">{dictionary.inventory.addProductsTitle}</h4>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-5">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{dictionary.inventory.productLabel}</label>
                        <select 
                            value={selectedProductId} 
                            onChange={e => {
                                const pid = e.target.value;
                                setSelectedProductId(pid ? Number(pid) : "");
                                const prod = products.find(p => p.id === Number(pid));
                                if (prod) setItemPrice(prod.precoCusto || 0);
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none focus:ring-2 ring-blue-500"
                        >
                            <option value="">{dictionary.inventory.selectProduct}</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{dictionary.inventory.quantityLabel}</label>
                        <input 
                            type="number" min="0.01" step="0.01" value={itemQuantity} onChange={e => setItemQuantity(Number(e.target.value))}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none focus:ring-2 ring-blue-500"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{dictionary.inventory.unitPriceLabel}</label>
                        <input 
                            type="number" min="0" step="0.01" value={itemPrice} onChange={e => setItemPrice(Number(e.target.value))}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none focus:ring-2 ring-blue-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button 
                            type="button" 
                            onClick={handleAddItem}
                            disabled={!selectedProductId}
                            className="w-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {dictionary.inventory.addBtn}
                        </button>
                    </div>
                </div>
            </div>

            {nfItems.length > 0 && (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4 animate-in fade-in pb-1">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-4 py-2 font-bold text-gray-500 dark:text-gray-400 uppercase text-xs">{dictionary.inventory.productLabel}</th>
                                <th className="px-4 py-2 font-bold text-gray-500 dark:text-gray-400 uppercase text-xs">{dictionary.inventory.quantityLabel}</th>
                                <th className="px-4 py-2 font-bold text-gray-500 dark:text-gray-400 uppercase text-xs">{dictionary.inventory.unitPriceLabel}</th>
                                <th className="px-4 py-2 font-bold text-gray-500 dark:text-gray-400 uppercase text-xs text-right">{dictionary.inventory.subtotalLabel}</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {nfItems.map((item, idx) => {
                                const prod = products.find(p => p.id === item.produtoId);
                                return (
                                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                                        <td className="px-4 py-2 dark:text-gray-300">{prod?.nome}</td>
                                        <td className="px-4 py-2 dark:text-gray-300">{item.quantidade}</td>
                                        <td className="px-4 py-2 dark:text-gray-300">R$ {item.precoUnitario.toFixed(2)}</td>
                                        <td className="px-4 py-2 dark:text-gray-300 text-right font-medium">R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right">
                                            <button type="button" onClick={() => setNfItems(nfItems.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 material-symbols-outlined text-sm">
                                                delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <td colSpan={3} className="px-4 py-2 text-right font-bold dark:text-white text-xs uppercase">{dictionary.inventory.totalValueLabel}</td>
                                <td className="px-4 py-2 text-right font-bold text-emerald-600 dark:text-emerald-400">R$ {totalValue.toFixed(2)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors shadow-sm">
                {dictionary.inventory.saveBtn}
            </button>
         </form>
       )}

        <div className="flex border-b border-gray-100 dark:border-gray-800 mb-6 gap-6">
           <button 
             onClick={() => setActiveTab("produtos")}
             className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === "produtos" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
           >
             {dictionary.inventory.tabs.products}
             {activeTab === "produtos" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>}
           </button>
           <button 
             onClick={() => setActiveTab("nfs")}
             className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === "nfs" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
           >
             {dictionary.inventory.tabs.invoices}
             {activeTab === "nfs" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>}
           </button>
        </div>

       <div className="overflow-x-auto">
          {activeTab === "produtos" ? (
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                       <th className="py-4 text-xs font-bold text-gray-400 uppercase">{dictionary.inventory.productsTable.product}</th>
                       <th className="py-4 text-xs font-bold text-gray-400 uppercase">{dictionary.inventory.productsTable.sku}</th>
                       <th className="py-4 text-xs font-bold text-gray-400 uppercase">{dictionary.inventory.productsTable.currentStock}</th>
                       <th className="py-4 text-xs font-bold text-gray-400 uppercase">{dictionary.inventory.productsTable.unit}</th>
                       <th className="py-4 text-xs font-bold text-gray-400 uppercase text-right">{dictionary.inventory.productsTable.status}</th>
                    </tr>
                 </thead>
                 <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="py-8 text-center text-gray-500">{dictionary.inventory.productsTable.loading}</td></tr>
                    ) : products.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-gray-500">{dictionary.inventory.productsTable.empty}</td></tr>
                    ) : (
                      products.map((p) => (
                        <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                           <td className="py-4 font-medium dark:text-white">{p.nome}</td>
                           <td className="py-4 text-gray-500">{p.sku || '-'}</td>
                           <td className="py-4 font-bold dark:text-gray-300">{p.estoqueAtual}</td>
                           <td className="py-4 text-gray-500">{p.unidadeMedida}</td>
                           <td className="py-4 text-right">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.estoqueAtual <= p.estoqueMinimo ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                 {p.estoqueAtual <= p.estoqueMinimo ? dictionary.inventory.productsTable.lowStatus : dictionary.inventory.productsTable.okStatus}
                              </span>
                           </td>
                        </tr>
                      ))
                    )}
                 </tbody>
              </table>
          ) : (
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                       <th className="py-4 text-xs font-bold text-gray-400 uppercase">{dictionary.inventory.invoicesTable.nfNumber}</th>
                       <th className="py-4 text-xs font-bold text-gray-400 uppercase">{dictionary.inventory.invoicesTable.provider}</th>
                       <th className="py-4 text-xs font-bold text-gray-400 uppercase">{dictionary.inventory.invoicesTable.issueDate}</th>
                       <th className="py-4 text-xs font-bold text-gray-400 uppercase">{dictionary.inventory.invoicesTable.items}</th>
                       <th className="py-4 text-xs font-bold text-gray-400 uppercase text-right">{dictionary.inventory.invoicesTable.totalValue}</th>
                    </tr>
                 </thead>
                 <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="py-8 text-center text-gray-500">{dictionary.inventory.invoicesTable.loading}</td></tr>
                    ) : invoices.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-gray-500">{dictionary.inventory.invoicesTable.empty}</td></tr>
                    ) : (
                      invoices.map((inv) => (
                        <tr key={inv.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                           <td className="py-4 font-bold dark:text-white">{inv.numero}</td>
                           <td className="py-4 text-gray-500 dark:text-gray-400">{inv.fornecedor}</td>
                           <td className="py-4 text-gray-500">{new Date(inv.dataEmissao).toLocaleDateString('pt-BR')}</td>
                           <td className="py-4 text-gray-500 text-sm">
                             {inv.itens && inv.itens.length > 0 ? (
                               <div className="flex flex-col gap-1">
                                  {inv.itens.slice(0, 2).map((i: any) => (
                                    <span key={i.id} className="truncate max-w-[200px]" title={`${i.produto?.nome} (${i.quantidade} un)`}>
                                      • {i.produto?.nome} ({i.quantidade} un)
                                    </span>
                                  ))}
                                  {inv.itens.length > 2 && <span className="text-xs text-blue-500 font-medium">+{inv.itens.length - 2} {dictionary.inventory.invoicesTable.items.toLowerCase()}</span>}
                               </div>
                             ) : '-'}
                           </td>
                           <td className="py-4 text-right font-medium text-emerald-600 dark:text-emerald-400">
                             R$ {inv.valorTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                           </td>
                        </tr>
                      ))
                    )}
                 </tbody>
              </table>
          )}
       </div>
    </div>
  );
}
