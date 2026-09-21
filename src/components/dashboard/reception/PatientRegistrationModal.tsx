"use client";

import { GenderEnum, NationalityEnum, PatientRndsSchema, RaceColorEnum, type PatientRndsData } from "@/schemas/patient-rnds";
import { api } from "@/services/api";
import { useState } from "react";

interface Props {
  dictionary: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 1 | 2 | 3;

export default function PatientRegistrationModal({ dictionary, isOpen, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<Partial<PatientRndsData>>({
    nacionalidade: "BRASILEIRA",
    endereco: {
        uf: ""
    } as any
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error
    if (errors[field]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const handleAddressChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      endereco: { ...prev.endereco, [field]: value } as any
    }));
  };

  const validateStep = (currentStep: Step): boolean => {
    let result;
    if (currentStep === 1) {
       result = PatientRndsSchema.pick({ 
         nome: true, cpf: true, cns: true, dataNascimento: true, sexo: true 
       }).safeParse(formData);
    } else if (currentStep === 2) {
       result = PatientRndsSchema.pick({ 
         nomeMae: true, racaCor: true, nacionalidade: true 
       }).safeParse(formData);
    } else {
       result = PatientRndsSchema.safeParse(formData);
    }

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((err: any) => {
        const path = err.path.join(".");
        formattedErrors[path] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
        setStep(prev => (prev < 3 ? prev + 1 : prev) as Step);
    }
  };

  const regDict = dictionary?.dashboard?.receptionBoard?.patientRegistration;
  const labels = regDict?.labels;
  const steps = regDict?.steps;
  const buttons = regDict?.buttons;
  const msgs = regDict?.messages;

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
        let genero = "M"; 
        if (formData.sexo?.startsWith("F")) genero = "F";
        
        const end = formData.endereco;
        const cepLabel = msgs?.addressString?.cep || " - CEP: ";
        const enderecoCompleto = end 
            ? `${end.logradouro}, ${end.numero}${end.complemento ? ' - ' + end.complemento : ''} - ${end.bairro}, ${end.cidade}/${end.uf}${cepLabel}${end.cep}`
            : "";

        const payload = {
            nome: formData.nome,
            cpf: formData.cpf,
            dataNascimento: new Date(formData.dataNascimento!).toISOString(),
            genero: genero,
            telefonePrincipal: formData.telefonePrincipal,
            email: formData.email || undefined, 
            enderecoCompleto: enderecoCompleto,
        };

        const response = await api.patients.create(payload);
        if (response) {
            alert(msgs?.success || "Paciente cadastrado com sucesso!");
            onSuccess();
            onClose();
        }
    } catch (error: any) {
        console.error("Erro ao cadastrar:", error);
        const msg = error.response?.data?.mensagem;
        const finalMsg = Array.isArray(msg) ? msg.join(", ") : msg || error.message || "Erro desconhecido";
        alert((msgs?.error || "Erro ao cadastrar: ") + finalMsg);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{regDict?.title || "Novo Paciente"}</h2>
              <p className="text-sm text-gray-500">{regDict?.subtitle || "Cadastro padrão RNDS"}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Steps */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
            {[1, 2, 3].map(s => (
                <div 
                    key={s} 
                    className={`flex-1 p-3 text-center text-sm font-medium border-b-2 transition-colors ${
                        step === s 
                        ? "border-blue-600 text-blue-600" 
                        : "border-transparent text-gray-500 hover:text-gray-700" 
                    }`}
                >
                    {s === 1 && (steps?.identification || "1. Identificação")}
                    {s === 2 && (steps?.affiliation || "2. Filiação e Dados")}
                    {s === 3 && (steps?.contact || "3. Contato e Endereço")}
                </div>
            ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label={labels?.fullName || "Nome Completo *"} value={formData.nome} onChange={(v: string) => handleChange("nome", v)} error={errors.nome} />
                    <InputField label={labels?.socialName || "Nome Social"} value={formData.nomeSocial} onChange={(v: string) => handleChange("nomeSocial", v)} />
                    <InputField label={labels?.cpf || "CPF *"} mask="000.000.000-00" value={formData.cpf} onChange={(v: string) => handleChange("cpf", v)} error={errors.cpf} />
                    <InputField label={labels?.cns || "CNS (Cartão SUS) *"} mask="000 0000 0000 0000" value={formData.cns} onChange={(v: string) => handleChange("cns", v)} error={errors.cns} placeholder={regDict?.placeholders?.cns || "15 dígitos"} />
                    <InputField label={labels?.dob || "Data de Nascimento *"} type="date" value={formData.dataNascimento} onChange={(v: string) => handleChange("dataNascimento", v)} error={errors.dataNascimento} />
                    
                    <SelectField label={labels?.gender || "Sexo *"} value={formData.sexo} onChange={(v: string) => handleChange("sexo", v)} error={errors.sexo}>
                        <option value="">{regDict?.placeholders?.select || "Selecione"}</option>
                        {GenderEnum.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </SelectField>
                </div>
            )}

            {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label={labels?.motherName || "Nome da Mãe *"} value={formData.nomeMae} onChange={(v: string) => handleChange("nomeMae", v)} error={errors.nomeMae} className="md:col-span-2" />
                    <InputField label={labels?.fatherName || "Nome do Pai"} value={formData.nomePai} onChange={(v: string) => handleChange("nomePai", v)} className="md:col-span-2" />
                    <SelectField label={labels?.race || "Raça/Cor *"} value={formData.racaCor} onChange={(v: string) => handleChange("racaCor", v)} error={errors.racaCor}>
                        <option value="">{regDict?.placeholders?.select || "Selecione"}</option>
                        {RaceColorEnum.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </SelectField>
                    <SelectField label={labels?.nationality || "Nacionalidade *"} value={formData.nacionalidade} onChange={(v: string) => handleChange("nacionalidade", v)}>
                        {NationalityEnum.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </SelectField>
                    <InputField label={labels?.birthCity || "Município de Nascimento"} value={formData.municipioNascimento} onChange={(v: string) => handleChange("municipioNascimento", v)} />
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label={labels?.phone || "Telefone Principal *"} mask="(00) 00000-0000" value={formData.telefonePrincipal} onChange={(v: string) => handleChange("telefonePrincipal", v)} error={errors.telefonePrincipal} />
                        <InputField label={labels?.email || "Email"} type="email" value={formData.email} onChange={(v: string) => handleChange("email", v)} error={errors.email} />
                    </div>
                    
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{labels?.addressTitle || "Endereço Residencial"}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                            <InputField className="md:col-span-2" label={labels?.zip || "CEP *"} mask="00000-000" value={formData.endereco?.cep} onChange={(v: string) => handleAddressChange("cep", v)} error={errors["endereco.cep"]} />
                            <InputField className="md:col-span-3" label={labels?.street || "Rua/Logradouro *"} value={formData.endereco?.logradouro} onChange={(v: string) => handleAddressChange("logradouro", v)} error={errors["endereco.logradouro"]} />
                            <InputField className="md:col-span-1" label={labels?.number || "Número *"} value={formData.endereco?.numero} onChange={(v: string) => handleAddressChange("numero", v)} error={errors["endereco.numero"]} />
                            <InputField className="md:col-span-2" label={labels?.neighborhood || "Bairro *"} value={formData.endereco?.bairro} onChange={(v: string) => handleAddressChange("bairro", v)} error={errors["endereco.bairro"]} />
                            <InputField className="md:col-span-2" label={labels?.city || "Cidade *"} value={formData.endereco?.cidade} onChange={(v: string) => handleAddressChange("cidade", v)} error={errors["endereco.city"]} />
                            <InputField className="md:col-span-1" label={labels?.state || "UF *"} value={formData.endereco?.uf} onChange={(v: string) => handleAddressChange("uf", v)} error={errors["endereco.uf"]} placeholder={regDict?.placeholders?.state || "SP"} maxLength={2} />
                            <InputField className="md:col-span-1" label={labels?.complement || "Comp."} value={formData.endereco?.complemento} onChange={(v: string) => handleAddressChange("complemento", v)} />
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-between">
             {step > 1 ? (
                <button 
                  onClick={() => setStep(s => (s - 1) as Step)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 font-medium"
                >
                    {buttons?.back || "Voltar"}
                </button>
             ) : (
                <div />
             )}
             
             {step < 3 ? (
                <button 
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm"
                >
                    {buttons?.next || "Próximo"}
                </button>
             ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                    {isSubmitting && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>}
                    {buttons?.save || "Salvar Paciente"}
                </button>
             )}
        </div>
      </div>
    </div>
  );
}

// Helpers
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    error?: string;
    mask?: string;
    onChange: (v: string) => void;
}

function InputField({ label, error, className = "", mask, value, onChange, ...props }: InputProps) {
    return (
        <div className={`flex flex-col ${className}`}>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
            <input 
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 outline-none transition-all ${
                    error 
                    ? "border-red-300 focus:ring-red-200 bg-red-50 dark:bg-red-900/10" 
                    : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-100 dark:bg-gray-800"
                }`}
                value={value ?? ""}
                {...props}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
        </div>
    )
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label: string;
    error?: string;
    onChange: (v: string) => void;
}

function SelectField({ label, children, error, className = "", value, onChange, ...props }: SelectProps) {
    return (
        <div className={`flex flex-col ${className}`}>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
            <select 
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 outline-none transition-all appearance-none bg-white dark:bg-gray-800 ${
                    error 
                    ? "border-red-300 focus:ring-red-200" 
                    : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-100"
                }`}
                value={value ?? ""}
                {...props}
                onChange={(e) => onChange(e.target.value)}
            >
                {children}
            </select>
            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
        </div>
    )
}
