import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar({ dict, locale }: { dict: any, locale: string }) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center text-blue-600 dark:text-blue-400">
            <span className="material-symbols-outlined text-3xl">dentistry</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">OdontoFlow</h2>
        </div>
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          <Link className="text-sm font-bold hover:text-blue-600 transition-colors text-slate-600 dark:text-slate-400 dark:hover:text-blue-400" href={`/${locale}#features`}>{dict.navbar.features}</Link>
          <Link className="text-sm font-bold hover:text-blue-600 transition-colors text-slate-600 dark:text-slate-400 dark:hover:text-blue-400" href={`/${locale}/compliance`}>{dict.navbar.compliance}</Link>
          <Link className="text-sm font-bold hover:text-blue-600 transition-colors text-slate-600 dark:text-slate-400 dark:hover:text-blue-400" href={`/${locale}/pricing`}>{dict.navbar.pricing}</Link>
          <Link className="text-sm font-bold hover:text-blue-600 transition-colors text-slate-600 dark:text-slate-400 dark:hover:text-blue-400" href={`/${locale}/support`}>{dict.navbar.support}</Link>
        </nav>
        <div className="flex items-center gap-4 lg:gap-8">
          <ThemeToggle />
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href={`/${locale}/login`} className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors dark:text-white dark:hover:text-blue-400">
              {dict.navbar.login}
            </Link>
            <Link 
              href={`/${locale}/signup`} 
              className="hidden sm:inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
            >
              {dict.navbar.register}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
