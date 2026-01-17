"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

interface LoginClientProps {
  dict: any;
  locale: string;
}

export default function LoginClient({ dict, locale }: LoginClientProps) {
  const router = useRouter();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    // Simulate login logic
    console.log("Logging in...");
    // Set mock cookie
    document.cookie = "auth_token=true; path=/; max-age=86400";
    // Redirect
    router.refresh();
    router.push(`/${locale}/dashboard`);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      
      {/* Background - RAW IMAGE with Overlay */}
      <div className="fixed inset-0 -z-10 bg-slate-900">
        <img 
          src="/images/login-bg.png"
          alt="Background" 
          className="h-full w-full scale-110 object-cover"
        />
        {/* Blue Overlay (40%) with Blur */}
        <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm"></div>
      </div>

      {/* Login Card (Full screen on mobile, floating on desktop) */}
      <div className="relative z-10 flex min-h-screen w-full max-w-[100vw] flex-col justify-center bg-white p-6 shadow-none transition-all duration-700 ease-in-out dark:bg-slate-900 md:min-h-0 md:max-w-md md:rounded-2xl md:bg-white/95 md:p-12 md:shadow-2xl md:backdrop-blur-md md:dark:bg-slate-900/95">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center justify-center gap-4 text-center">
          <Link href={`/${locale}`} className="flex flex-col items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
              <span className="material-symbols-outlined text-3xl">dentistry</span>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">OdontoFlow</span>
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">{dict.auth.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{dict.auth.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {dict.auth.emailLabel}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-slate-400 text-lg">person</span>
              </div>
              <input
                type="text"
                id="email"
                required
                className="block w-full rounded-lg border border-slate-300 bg-white p-2.5 pl-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500"
                placeholder={dict.auth.emailPlaceholder}
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {dict.auth.passwordLabel}
              </label>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-slate-400 text-lg">lock</span>
              </div>
              <input
                type="password"
                id="password"
                required
                className="block w-full rounded-lg border border-slate-300 bg-white p-2.5 pl-10 pr-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500"
                placeholder={dict.auth.passwordPlaceholder}
              />
              <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <span className="material-symbols-outlined text-lg">visibility</span>
              </button>
            </div>
            <div className="mt-2 text-right">
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                {dict.auth.forgotPassword}
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-800"
          >
            {dict.auth.loginButton}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
          <span className="px-4 text-xs font-medium uppercase text-slate-400">{dict.auth.or}</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
        </div>

        {/* Sign Up Link */}
        <p className="relative z-20 text-center text-sm text-slate-500 dark:text-slate-400">
          {dict.auth.noAccount}{' '}
          <Link href={`/${locale}/signup`} className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            {dict.auth.signUp}
          </Link>
        </p>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-xs text-slate-400">
           <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Termos</a>
           <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Privacidade</a>
           <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Ajuda</a>
        </div>
      </div>
    </div>
  );
}
