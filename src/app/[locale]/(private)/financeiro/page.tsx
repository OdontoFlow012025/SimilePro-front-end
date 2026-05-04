import FinanceiroTabs from '@/components/dashboard/financial/FinanceiroTabs';
import { getDictionary } from '@/utils/get-dictionary';
import { Suspense } from 'react';

export default async function FinanceiroPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#111518] dark:text-white mb-2">{dict?.financial?.title || "Financeiro"}</h1>
        <p className="text-gray-500 dark:text-gray-400">{dict?.financial?.subtitle || "Gestão financeira"}</p>
      </div>

      <Suspense fallback={<div>Carregando...</div>}>
        <FinanceiroTabs dictionary={dict} locale={locale} />
      </Suspense>
    </div>
  );
}
