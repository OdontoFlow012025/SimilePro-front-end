"use client";

import Link from 'next/link';

export default function Footer({ dict, locale }: { dict: any, locale: string }) {
  const alertMsg = locale === 'pt-BR' ? 'Página em construção' : locale === 'es' ? 'Página en construcción' : 'Page under construction';

  const handleUnderConstruction = (e: React.MouseEvent) => {
    e.preventDefault();
    alert(alertMsg);
  };

  return (
    <footer className="bg-slate-950 pt-24 pb-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          <div className="col-span-2 lg:col-span-2 flex flex-col gap-6">
            <Link href={`/${locale}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-blue-500 text-3xl">dentistry</span>
              <h2 className="text-2xl font-black text-white">Simile Pro</h2>
            </Link>
            <p className="text-slate-400 max-w-xs leading-relaxed">
              {dict.footer.description}
            </p>
            <div className="flex gap-4">
              <a className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-400 hover:bg-blue-600 hover:text-white transition-all" href="#">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6">{dict.footer.product}</h3>
            <ul className="flex flex-col gap-4">
              <li><Link className="text-sm text-slate-400 hover:text-blue-400 transition-colors" href={`/${locale}/features`}>{dict.footer.links.features}</Link></li>
              <li><Link className="text-sm text-slate-400 hover:text-blue-400 transition-colors" href={`/${locale}/pricing`}>{dict.footer.links.pricing}</Link></li>
              <li><a className="text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer" onClick={handleUnderConstruction}>{dict.footer.links.integrations}</a></li>
              <li><a className="text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer" onClick={handleUnderConstruction}>{dict.footer.links.enterprise}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6">{dict.footer.resources}</h3>
            <ul className="flex flex-col gap-4">
              <li><a className="text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer" onClick={handleUnderConstruction}>{dict.footer.links.blog}</a></li>
              <li><a className="text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer" onClick={handleUnderConstruction}>{dict.footer.links.caseStudies}</a></li>
              <li><Link className="text-sm text-slate-400 hover:text-blue-400 transition-colors" href={`/${locale}/support`}>{dict.footer.links.helpCenter}</Link></li>
              <li><Link className="text-sm text-slate-400 hover:text-blue-400 transition-colors" href={`/${locale}/api-docs`}>{dict.footer.links.apiDocs}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6">{dict.footer.company}</h3>
            <ul className="flex flex-col gap-4">
              <li><a className="text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer" onClick={handleUnderConstruction}>{dict.footer.links.aboutUs}</a></li>
              <li><a className="text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer" onClick={handleUnderConstruction}>{dict.footer.links.careers}</a></li>
              <li><Link className="text-sm text-slate-400 hover:text-blue-400 transition-colors" href={`/${locale}/compliance`}>{dict.footer.links.legal}</Link></li>
              <li><Link className="text-sm text-slate-400 hover:text-blue-400 transition-colors" href={`/${locale}/support`}>{dict.footer.links.contact}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500">
            {dict.footer.legal.copyright}
          </p>
          <div className="flex gap-8">
            <a className="text-sm text-slate-500 hover:text-blue-400 transition-colors cursor-pointer" onClick={handleUnderConstruction}>{dict.footer.legal.privacy}</a>
            <a className="text-sm text-slate-500 hover:text-blue-400 transition-colors cursor-pointer" onClick={handleUnderConstruction}>{dict.footer.legal.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
