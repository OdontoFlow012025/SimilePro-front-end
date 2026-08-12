import ConfiguracoesClient from './_components/ConfiguracoesClient';
import { getDictionary } from '@/utils/get-dictionary';

export default async function ConfiguracoesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Fetch dictionary server-side
  const dict = await getDictionary(locale);

  return <ConfiguracoesClient dict={dict} />;
}
