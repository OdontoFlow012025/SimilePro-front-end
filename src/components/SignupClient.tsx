"use client";

import { api } from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

interface SignupClientProps {
  dict: any;
  locale: string;
}

export default function SignupClient({ dict, locale }: SignupClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    user: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      cpf: "",
      cro: "",
    },
    clinic: {
      fantasyName: "",
      companyName: "",
      cnpj: "",
      address: "",
      phone: "",
    }
  });

  const formatValue = (name: string, value: string) => {
    if (name === "cnpj") {
      return value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    }
    if (name === "cpf") {
      return value
        .replace(/\D/g, "")
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    }
    if (name === "phone") {
      let v = value.replace(/\D/g, "");
      v = v.slice(0, 11);
      
      if (v.length > 10) {
        // Mobile 11 digit: (XX) XXXXX-XXXX
        v = v.replace(/^(\d{2})(\d)/, "($1) $2");
        v = v.replace(/(\d{5})(\d)/, "$1-$2");
      } else {
        // Landline 10 digit: (XX) XXXX-XXXX
        v = v.replace(/^(\d{2})(\d)/, "($1) $2");
        v = v.replace(/(\d{4})(\d)/, "$1-$2");
      }
      return v;
    }
    return value;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, dataset } = e.target;
    const group = dataset.group || "user";
    const formattedValue = formatValue(name, value);
    
    setFormData((prev) => ({
      ...prev,
      // @ts-ignore
      [group]: {
        // @ts-ignore
        ...prev[group],
        [name]: formattedValue,
      },
    }));
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Payload plano conforme esperado pelo backend
    // Validar se as senhas coincidem
    if (formData.user.password !== formData.user.confirmPassword) {
      setError(dict.signup.passwordsNotMatch || "As senhas não coincidem.");
      setLoading(false);
      return;
    }

    // Payload plano conforme esperado pelo backend
    const payload = {
      nome: formData.user.name,
      email: formData.user.email,
      senha: formData.user.password,
      telefone: formData.user.phone,
      cpf: formData.user.cpf,
      cro: formData.user.cro,
      nomeFantasia: formData.clinic.fantasyName,
      razaoSocial: formData.clinic.companyName,
      cnpj: formData.clinic.cnpj,
      enderecoClinica: formData.clinic.address,
      telefoneClinica: formData.clinic.phone,
      tipoUsuario: "ADMIN", // Adding default user type for clinic registration
    };

    // Log do payload para verificação


    try {
      await api.auth.signup(payload);
      router.push(`/${locale}/dashboard`);
    } catch (err: any) {
      console.error("Erro detalhado do signup:", err);
      // Tenta mostrar a mensagem vinda do JSON stringify se for o caso
      setError(err.message || dict.signup.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-900">
      {/* Left Side - Form Area (Scrollable) */}
      <div className="flex w-full flex-col overflow-y-auto p-6 transition-all duration-700 ease-in-out lg:w-5/12 lg:p-12 xl:p-16">
        
        {/* Header (Logo + Title) */}
        <div className="mb-10">
          <Link href={`/${locale}`} className="mb-6 flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
              <span className="material-symbols-outlined text-lg">dentistry</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">Simile Pro</span>
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">{dict.signup.title}</h1>
          <p className="text-slate-500 dark:text-slate-400">{dict.signup.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="flex-1 space-y-8">
          {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Section 1: Professional Data */}
          <div>
            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="material-symbols-outlined text-blue-600">person</span>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{dict.signup.userData.title}</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.userData.nameLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.user.name}
                  onChange={handleChange}
                  required
                  placeholder={dict.signup.userData.namePlaceholder}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.userData.emailLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.user.email}
                  onChange={handleChange}
                  required
                  placeholder={dict.signup.userData.emailPlaceholder}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.userData.phoneLabel}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.user.phone}
                  onChange={handleChange}
                  placeholder={dict.signup.userData.phonePlaceholder}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.userData.passwordLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.user.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder={dict.signup.userData.passwordPlaceholder}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.userData.confirmPasswordLabel || "Confirmar Senha"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.user.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder={dict.signup.userData.confirmPasswordPlaceholder || "Confirme sua senha"}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.userData.cpfLabel}
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.user.cpf}
                  onChange={handleChange}
                  placeholder={dict.signup.userData.cpfPlaceholder}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.userData.croLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cro"
                  value={formData.user.cro}
                  onChange={handleChange}
                  required
                  placeholder={dict.signup.userData.croPlaceholder}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinic Data */}
          <div>
            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="material-symbols-outlined text-blue-600">domain</span>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{dict.signup.clinicData.title}</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="col-span-2 md:col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.clinicData.fantasyNameLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fantasyName"
                  data-group="clinic"
                  value={formData.clinic.fantasyName}
                  onChange={handleChange}
                  required
                  placeholder={dict.signup.clinicData.fantasyNamePlaceholder}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.clinicData.companyNameLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  data-group="clinic"
                  value={formData.clinic.companyName}
                  onChange={handleChange}
                  required
                  placeholder={dict.signup.clinicData.companyNamePlaceholder}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.clinicData.cnpjLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cnpj"
                  data-group="clinic"
                  value={formData.clinic.cnpj}
                  onChange={handleChange}
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
                    name="address"
                    data-group="clinic"
                    value={formData.clinic.address}
                    onChange={handleChange}
                    placeholder={dict.signup.clinicData.addressPlaceholder}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 pl-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dict.signup.clinicData.phoneLabel}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">call</span>
                  <input
                    type="text"
                    name="phone"
                    data-group="clinic"
                    value={formData.clinic.phone}
                    onChange={handleChange}
                    placeholder={dict.signup.clinicData.phonePlaceholder}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 pl-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-4 text-center font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-75 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {loading ? dict.signup.loading : dict.signup.submitButton}
            {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
          </button>
          
          {/* Terms Footer */}
            <div className="text-center text-xs text-slate-500 dark:text-slate-400">
              {dict.signup.termsAgreement.replace('{submitButton}', dict.signup.submitButton)} <a href="#" className="text-blue-600 hover:underline">{dict.signup.termsLink}</a> & <a href="#" className="text-blue-600 hover:underline">{dict.signup.privacyLink}</a>.
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
               <h2 className="mb-6 text-5xl font-black leading-tight text-white lg:text-6xl tracking-tight">
                 {dict.signup.hero.title}
               </h2>
               <p className="text-xl text-white/90 leading-relaxed max-w-xl font-medium">
                 {dict.signup.hero.subtitle}
               </p>
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
