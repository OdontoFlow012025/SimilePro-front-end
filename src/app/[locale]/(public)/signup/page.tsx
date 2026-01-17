import SignupClient from "@/components/SignupClient";
import { getDictionary } from "@/utils/get-dictionary";

export default async function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <SignupClient dict={dict} locale={locale} />;
}
