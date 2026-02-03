import { api } from "@/services/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function CriticalPendencies({ dictionary }: { dictionary: any }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'pt-BR';
  const [pendencies, setPendencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendencies = async () => {
      try {
        const data = await api.billing.getOverdueInvoices();
        if (Array.isArray(data)) {
            // Mapping API data to UI structure
            // Assuming API returns { id, description, value, type, dueDate, ... }
            const mapped = data.map((item: any) => ({
                id: item.id,
                name: item.patientName || item.description || (dictionary?.dashboard?.pendencies?.defaultTitle || "Pendência"),
                desc: `${item.type === 'PAYMENT' ? (dictionary?.dashboard?.pendencies?.provider || 'Fornecedor') : (dictionary?.dashboard?.pendencies?.patient || 'Paciente')} • ${dictionary?.dashboard?.pendencies?.due || 'Venceu'} ${new Date(item.dueDate).toLocaleDateString(locale)}`,
                value: item.value,
                type: item.type // 'PAYMENT' or 'RECEIVABLE'
            }));
            setPendencies(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch pendencies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendencies();
  }, [dictionary, locale]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(val);
  };
  
  if (loading) return <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>;

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
        <span className="material-symbols-outlined text-red-500">warning</span> {dictionary?.dashboard?.pendencies?.title || "Pendências Críticas"}
      </h3>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-800">
        
        {pendencies.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">{dictionary?.dashboard?.pendencies?.noData || "Nenhuma pendência crítica encontrada."}</div>
        ) : pendencies.map((item) => (
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
              <Link href={`/${locale}/financeiro`} className="text-[10px] font-bold text-blue-500 uppercase hover:underline">
                {item.type === 'PAYMENT' 
                    ? (dictionary?.dashboard?.pendencies?.pay || "Pagar") 
                    : (dictionary?.dashboard?.pendencies?.charge || "Cobrar")}
              </Link>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
