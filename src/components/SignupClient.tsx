"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

interface SignupClientProps {
  dict: any;
  locale: string;
}

export default function SignupClient({ dict, locale }: SignupClientProps) {
  const router = useRouter();

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    // Simulate signup logic
    console.log("Signing up...");
    // Redirect to dashboard or login
    router.push(`/${locale}/dashboard`);
  };

  return (
    <div className="fixed inset-0 flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-900">
      {/* Left Side - Form Area (Scrollable) */}
      <div className="flex w-full flex-col overflow-y-auto p-6 transition-all duration-700 ease-in-out lg:w-5/12 lg:p-12 xl:p-16">
        
        {/* Header (Logo + Title) */}
        <div className="mb-10">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
              <span className="material-symbols-outlined text-lg">dentistry</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">OdontoFlow</span>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">{dict.signup.title}</h1>
          <p className="text-slate-500 dark:text-slate-400">{dict.signup.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="flex-1 space-y-8">
          
          {/* Section 1: Clinic Data */}
          <div>
            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="material-symbols-outlined text-blue-600">domain</span>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{dict.signup.clinicData.title}</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="col-span-2 md:col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.clinicData.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={dict.signup.clinicData.namePlaceholder}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.clinicData.cnpjLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={dict.signup.clinicData.cnpjPlaceholder}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
              
              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.clinicData.addressLabel}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">location_on</span>
                  <input
                    type="text"
                    required
                    placeholder={dict.signup.clinicData.addressPlaceholder}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 pl-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.clinicData.phoneLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">call</span>
                  <input
                    type="text"
                    required
                    placeholder={dict.signup.clinicData.phonePlaceholder}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 pl-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Technical Responsible */}
          <div>
            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="material-symbols-outlined text-blue-600">person</span>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{dict.signup.technicalResponsible.title}</h2>
            </div>
            
            <div className="grid gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.technicalResponsible.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={dict.signup.technicalResponsible.namePlaceholder}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {dict.signup.technicalResponsible.croLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={dict.signup.technicalResponsible.croPlaceholder}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                 <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {dict.signup.technicalResponsible.specializationLabel}
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="">{dict.signup.technicalResponsible.specializationPlaceholder}</option>
                    <option value="orto">Ortodontia</option>
                    <option value="implante">Implantodontia</option>
                    <option value="clinico">Clínico Geral</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-4 text-center font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {dict.signup.submitButton}
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
          
          {/* Terms Footer */}
           <div className="text-center text-xs text-slate-500 dark:text-slate-400">
              Ao clicar em "{dict.signup.submitButton}", você concorda com nossos <a href="#" className="text-blue-600 hover:underline">Termos de Uso</a> e <a href="#" className="text-blue-600 hover:underline">Política de Privacidade</a>.
           </div>

        </form>
      </div>

      {/* Right Side - Image Area (Fixed) */}
      <div className="h-full w-0 bg-slate-900 opacity-0 transition-all duration-700 ease-in-out lg:w-7/12 lg:opacity-100">
        <div className="relative h-full w-full">
            <img 
              src="/images/signup-bg.png" 
              alt="Consultório Moderno" 
              className="h-full w-full object-cover"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-slate-900/10"></div>
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center p-12 translate-y-[10%] lg:p-16">
               <div className="mb-6 h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <span className="material-symbols-outlined text-3xl text-white">verified_user</span>
               </div>
               <h2 className="mb-6 text-4xl font-bold leading-tight text-white lg:text-5xl">
                 Gestão simplificada para sua clínica
               </h2>
               <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/20">
                  <p className="mb-4 text-lg text-slate-200 italic">
                     "O OdontoFlow mudou completamente a organização do meu consultório. Consigo ver minha agenda e faturamento de qualquer lugar."
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-full bg-slate-400 overflow-hidden">
                       {/* Placeholder for user avatar if available, otherwise gray circle */}
                     </div>
                     <div>
                        <div className="font-bold text-white">Dra. Ana Ferreira</div>
                        <div className="text-sm text-slate-300">Ortodontista</div>
                     </div>
                  </div>
               </div>
            </div>

        </div>
      </div>

      {/* Top Right Login Link (Floating & Persistent) */}
      <div className="absolute right-6 top-6 z-50">
          <div className="flex items-center gap-3 rounded-full bg-white/90 px-5 py-2.5 text-sm font-medium text-slate-900 shadow-lg backdrop-blur-xl transition hover:bg-white border border-slate-100 dark:border-slate-800 dark:bg-slate-800/90 dark:text-white dark:hover:bg-slate-800">
            {dict.signup.haveAccount}
            <Link href={`/${locale}/login`} className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              {dict.signup.loginLink}
            </Link>
          </div>
      </div>
    </div>
  );
}
