import ClientDashboardWrapper from '@/components/dashboard/ClientDashboardWrapper';
import { getDictionary } from '@/utils/get-dictionary';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Fetch dictionary server-side
  const dict = await getDictionary(locale);

  return <ClientDashboardWrapper locale={locale} dictionary={dict} />;
}

