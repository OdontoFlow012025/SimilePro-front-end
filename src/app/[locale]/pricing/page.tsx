import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import { getDictionary } from "@/utils/get-dictionary";

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <main className="pt-16 min-h-screen flex flex-col justify-between">
      <Navbar dict={dict} locale={locale} />
      <div className="flex-1">
        <Pricing dict={dict} locale={locale} />
      </div>
      <Footer dict={dict} locale={locale} />
    </main>
  );
}
