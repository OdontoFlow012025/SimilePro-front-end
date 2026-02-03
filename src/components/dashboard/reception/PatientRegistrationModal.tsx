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
    // Partial validation based on step
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
      console.log("Validation error:", result.error);
      const formattedErrors: Record<string, string> = {};
      // Use .issues instead of .errors to be safe
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

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
        // Backend adaptation: The API ("CreatePacienteDto") is strict and doesn't support RNDS fields yet.
        // We must map/filter the data to avoid 400 Bad Request.

        // Map Sexo -> Genero (M/F)
        let genero = "M"; // Default
        if (formData.sexo?.startsWith("F")) genero = "F";
        
        // Flatten Address -> enderecoCompleto
        const end = formData.endereco;
        const enderecoCompleto = end 
            ? `${end.logradouro}, ${end.numero}${end.complemento ? ' - ' + end.complemento : ''} - ${end.bairro}, ${end.cidade}/${end.uf} - CEP: ${end.cep}`
            : "";

        const payload = {
            nome: formData.nome,
            cpf: formData.cpf,
            dataNascimento: new Date(formData.dataNascimento!).toISOString(), // Ensure ISO
            genero: genero,
            telefonePrincipal: formData.telefonePrincipal,
            email: formData.email || undefined, // Send undefined if empty string
            enderecoCompleto: enderecoCompleto,
            // Unsupported RNDS fields dropped for now to prevent error: 
            // cns, romeMae, nomePai, racaCor, nacionalidade, municipioNascimento
        };

        const response = await api.patients.create(payload);
        if (response) {
            alert("Paciente cadastrado com sucesso! (Campos RNDS não suportados pelo servidor foram ignorados)");
            onSuccess();
            onClose();
        }
    } catch (error: any) {
        console.error("Erro ao cadastrar:", error);
        const msg = error.response?.data?.mensagem;
        const finalMsg = Array.isArray(msg) ? msg.join(", ") : msg || error.message || "Erro desconhecido";
        alert("Erro ao cadastrar: " + finalMsg);
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Novo Paciente</h2>
              <p className="text-sm text-gray-500">Cadastro padrão RNDS</p>
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
                    {s === 1 && "1. Identificação"}
                    {s === 2 && "2. Filiação e Dados"}
                    {s === 3 && "3. Contato e Endereço"}
                </div>
            ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Step 1 */}
            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Nome Completo *" value={formData.nome} onChange={v => handleChange("nome", v)} error={errors.nome} />
                    <InputField label="Nome Social" value={formData.nomeSocial} onChange={v => handleChange("nomeSocial", v)} />
                    <InputField label="CPF *" mask="000.000.000-00" value={formData.cpf} onChange={v => handleChange("cpf", v)} error={errors.cpf} />
                    <InputField label="CNS (Cartão SUS) *" mask="000 0000 0000 0000" value={formData.cns} onChange={v => handleChange("cns", v)} error={errors.cns} placeholder="15 dígitos" />
                    <InputField label="Data de Nascimento *" type="date" value={formData.dataNascimento} onChange={v => handleChange("dataNascimento", v)} error={errors.dataNascimento} />
                    
                    <SelectField label="Sexo *" value={formData.sexo} onChange={v => handleChange("sexo", v)} error={errors.sexo}>
                        <option value="">Selecione</option>
                        {GenderEnum.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </SelectField>
                </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Nome da Mãe *" value={formData.nomeMae} onChange={v => handleChange("nomeMae", v)} error={errors.nomeMae} className="md:col-span-2" />
                    <InputField label="Nome do Pai" value={formData.nomePai} onChange={v => handleChange("nomePai", v)} className="md:col-span-2" />
                    
                    <SelectField label="Raça/Cor *" value={formData.racaCor} onChange={v => handleChange("racaCor", v)} error={errors.racaCor}>
                        <option value="">Selecione</option>
                        {RaceColorEnum.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </SelectField>

                    <SelectField label="Nacionalidade *" value={formData.nacionalidade} onChange={v => handleChange("nacionalidade", v)}>
                        {NationalityEnum.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </SelectField>

                    <InputField label="Município de Nascimento" value={formData.municipioNascimento} onChange={v => handleChange("municipioNascimento", v)} />
                </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Telefone Principal *" mask="(00) 00000-0000" value={formData.telefonePrincipal} onChange={v => handleChange("telefonePrincipal", v)} error={errors.telefonePrincipal} />
                        <InputField label="Email" type="email" value={formData.email} onChange={v => handleChange("email", v)} error={errors.email} />
                    </div>
                    
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Endereço Residencial</h3>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                            <InputField className="md:col-span-2" label="CEP *" mask="00000-000" value={formData.endereco?.cep} onChange={v => handleAddressChange("cep", v)} error={errors["endereco.cep"]} />
                            <InputField className="md:col-span-3" label="Rua/Logradouro *" value={formData.endereco?.logradouro} onChange={v => handleAddressChange("logradouro", v)} error={errors["endereco.logradouro"]} />
                            <InputField className="md:col-span-1" label="Número *" value={formData.endereco?.numero} onChange={v => handleAddressChange("numero", v)} error={errors["endereco.numero"]} />
                            
                            <InputField className="md:col-span-2" label="Bairro *" value={formData.endereco?.bairro} onChange={v => handleAddressChange("bairro", v)} error={errors["endereco.bairro"]} />
                            <InputField className="md:col-span-2" label="Cidade *" value={formData.endereco?.cidade} onChange={v => handleAddressChange("cidade", v)} error={errors["endereco.cidade"]} />
                            <InputField className="md:col-span-1" label="UF *" value={formData.endereco?.uf} onChange={v => handleAddressChange("uf", v)} error={errors["endereco.uf"]} placeholder="SP" maxLength={2} />
                            <InputField className="md:col-span-1" label="Comp." value={formData.endereco?.complemento} onChange={v => handleAddressChange("complemento", v)} />
                        </div>
                    </div>
                </div>
            )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-between">
             {step > 1 ? (
                <button 
                  onClick={() => setStep(s => s - 1 as Step)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 font-medium"
                >
                    Voltar
                </button>
             ) : (
                <div />
             )}
             
             {step < 3 ? (
                <button 
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm"
                >
                    Próximo
                </button>
             ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                    {isSubmitting && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>}
                    Salvar Paciente
                </button>
             )}
        </div>
      </div>
    </div>
  );
}

// Helpers
function InputField({ label, error, className = "", mask, value, ...props }: any) {
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
                onChange={(e) => props.onChange(e.target.value)}
            />
            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
        </div>
    )
}

function SelectField({ label, children, error, className = "", value, ...props }: any) {
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
                onChange={(e) => props.onChange(e.target.value)}
            >
                {children}
            </select>
            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
        </div>
    )
}
