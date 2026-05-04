import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getDictionary } from "@/utils/get-dictionary";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SupportArticlePage({ 
  params 
}: { 
  params: Promise<{ locale: string; article: string }> 
}) {
  const { locale, article } = await params;
  const dict = await getDictionary(locale);
  const supportArticles = dict.supportArticles as Record<string, any>;
  
  const content = supportArticles[article];

  if (!content) {
    return notFound();
  }

  return (
    <main className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar dict={dict} locale={locale} />
      
      {/* Header */}
      <section className="bg-blue-600 dark:bg-blue-900 text-white pt-20 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href={`/${locale}/support`} className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6 font-bold">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Central de Ajuda
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            {content.title}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            {content.subtitle}
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xl shadow-slate-200/20 dark:shadow-none">
            
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-a:text-blue-600">
              {content.sections.map((sec: any, idx: number) => (
                <div key={idx} className="mb-10 last:mb-0">
                  <h2 className="text-2xl text-slate-900 dark:text-white mb-4">{sec.h}</h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{sec.p}</p>
                </div>
              ))}
            </div>

            <hr className="my-12 border-slate-200 dark:border-slate-800" />
            
            {/* Pagination */}
            <div className="flex justify-end">
              <Link 
                href={`/${locale}/support/${content.nextSlug}`}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group"
              >
                {content.nextTitle}
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      <Footer dict={dict} locale={locale} />
    </main>
  );
}
