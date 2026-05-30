import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTABanner from "@/components/CTABanner";
import { getDictionary } from "@/utils/get-dictionary";
import FeaturesList from "@/components/FeaturesList";

export default async function FeaturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <main className="pt-16 min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar dict={dict} locale={locale} />
      <div className="flex-1">
        <FeaturesList dict={dict} />
      </div>
      <CTABanner dict={dict} locale={locale} />
      <Footer dict={dict} locale={locale} />
    </main>
  );
}
