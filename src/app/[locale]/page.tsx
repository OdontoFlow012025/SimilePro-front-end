import CTABanner from "@/components/CTABanner";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import RoleSection from "@/components/RoleSection";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import { getDictionary } from "@/utils/get-dictionary";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <main>
      <Navbar dict={dict} locale={locale} />
      <Hero dict={dict} locale={locale} />
      <Stats dict={dict} />
      <Features dict={dict} />
      <RoleSection dict={dict} />
      <Testimonials dict={dict} />
      <CTABanner dict={dict} locale={locale} />
      <Footer dict={dict} locale={locale} />
    </main>
  );
}
