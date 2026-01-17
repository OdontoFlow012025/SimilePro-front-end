import LoginClient from "@/components/LoginClient";
import { getDictionary } from "@/utils/get-dictionary";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <LoginClient dict={dict} locale={locale} />;
}
