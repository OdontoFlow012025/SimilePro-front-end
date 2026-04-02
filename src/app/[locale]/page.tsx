import CTABanner from "@/components/CTABanner";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import RoleSection from "@/components/RoleSection";
import SecuritySection from "@/components/SecuritySection";
import Stats from "@/components/Stats";
import { getDictionary } from "@/utils/get-dictionary";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <main className="pt-16">
      <Navbar dict={dict} locale={locale} />
      <Hero dict={dict} locale={locale} />
      <Stats dict={dict} />
      <Features dict={dict} />
      <SecuritySection dict={dict} />
      <RoleSection dict={dict} />
      <CTABanner dict={dict} locale={locale} />
      <Footer dict={dict} locale={locale} />
    </main>
  );
}
