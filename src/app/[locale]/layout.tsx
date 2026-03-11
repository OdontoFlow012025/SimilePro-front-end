import i18nConfig from "@/../i18nConfig"; // Import from root
import ScrollToTop from "@/components/ScrollToTop";
import SystemAlert from "@/components/SystemAlert";
import TransitionProvider from "@/components/TransitionProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { getDictionary } from "@/utils/get-dictionary";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "../globals.css";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OdontoFlow - Modern Dental Clinic Management",
  description: "The Complete Operating System for Modern Dental Clinics",
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  // Fetch dictionary for current locale
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${manrope.className} bg-background text-text-main antialiased transition-colors duration-200`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange storageKey="odontoflow-theme">
          <TransitionProvider locale={locale} dict={dictionary.auth}>
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                {children}
            </div>
          </TransitionProvider>
          {dictionary.systemAlert && <SystemAlert dict={dictionary.systemAlert} />}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
