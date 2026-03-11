import AttendanceRoom from "@/components/dashboard/medical/AttendanceRoom";
import { getDictionary } from "@/utils/get-dictionary";

export default async function AttendancePage({ 
  params 
}: { 
  params: Promise<{ locale: string; id: string }> 
}) {
  const { locale, id } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <div className="h-full flex flex-col">
        <AttendanceRoom dictionary={dictionary} appointmentId={id} locale={locale} />
    </div>
  );
}
