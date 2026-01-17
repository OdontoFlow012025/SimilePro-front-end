import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar({ dict, locale }: { dict: any, locale: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-900 bg-(--navbar-bg) backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center text-(--primary) dark:text-white">
            <span className="material-symbols-outlined text-3xl">dentistry</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-(--primary) dark:text-white">OdontoFlow</h2>
        </div>
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          <Link className="text-sm font-semibold hover:text-primary transition-colors text-slate-500 dark:text-slate-600 dark:hover:text-primary" href={`/${locale}#features`}>{dict.navbar.features}</Link>
          <Link className="text-sm font-semibold hover:text-primary transition-colors text-slate-500 dark:text-slate-600 dark:hover:text-primary" href={`/${locale}#solutions`}>{dict.navbar.solutions}</Link>
          <Link className="text-sm font-semibold hover:text-primary transition-colors text-slate-500 dark:text-slate-600 dark:hover:text-primary" href={`/${locale}#pricing`}>{dict.navbar.pricing}</Link>
          <Link className="text-sm font-semibold hover:text-primary transition-colors text-slate-500 dark:text-slate-600 dark:hover:text-primary" href={`/${locale}#resources`}>{dict.navbar.resources}</Link>
        </nav>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-6">
            <Link href={`/${locale}/login`} className="text-sm font-bold hover:text-primary transition-colors text-slate-500 dark:text-gray-100 dark:hover:text-primary">
              {dict.navbar.login}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
