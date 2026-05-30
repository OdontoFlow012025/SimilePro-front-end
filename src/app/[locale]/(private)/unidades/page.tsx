import UnitsDashboard from "@/components/dashboard/units/UnitsDashboard";
import { getDictionary } from '@/utils/get-dictionary';

export default async function UnitsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <UnitsDashboard dictionary={dict} locale={locale} />;
}
