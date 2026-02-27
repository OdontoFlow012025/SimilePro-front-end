import FinanceiroTabs from '@/components/dashboard/financial/FinanceiroTabs';
import { getDictionary } from '@/utils/get-dictionary';

export default async function FinanceiroPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#111518] dark:text-white mb-2">Gestão Financeira</h1>
        <p className="text-gray-500 dark:text-gray-400">Controle completo de caixa, faturamentos e estoque.</p>
      </div>

      <FinanceiroTabs dictionary={dict} locale={locale} />
    </div>
  );
}
