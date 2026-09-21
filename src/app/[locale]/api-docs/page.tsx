import { getDictionary } from "@/utils/get-dictionary";
import ApiDocsClient from "./ApiDocsClient";

export default async function ApiDocsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <ApiDocsClient locale={locale} dict={dict} />;
}
