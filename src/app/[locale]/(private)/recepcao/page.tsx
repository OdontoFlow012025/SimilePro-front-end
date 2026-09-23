import ReceptionBoard from "@/components/dashboard/reception/ReceptionBoard";
import { getDictionary } from "@/utils/get-dictionary";

export default async function ReceptionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  // Format date for header
  const today = new Date().toLocaleDateString(locale, { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="p-6 md:p-8 h-full flex flex-col">
        <ReceptionBoard dictionary={dictionary} dateDisplay={todayCapitalized} />
    </div>
  );
}
