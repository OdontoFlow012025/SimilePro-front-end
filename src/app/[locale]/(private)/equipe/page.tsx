import TeamDashboard from "@/components/dashboard/team/TeamDashboard";
import { getDictionary } from "@/utils/get-dictionary";

export default async function EquipePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="p-4 md:p-8">
      <TeamDashboard dict={dict} />
    </div>
  );
}
