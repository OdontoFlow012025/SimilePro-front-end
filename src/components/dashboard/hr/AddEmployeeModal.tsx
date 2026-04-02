"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";

type AddEmployeeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dict?: any;
};

// Geraasenha usando WebCrypto para garantir altíssima entropia (equivalente a "hash256" de segurança solicitada pelo usuário)
function generateSecurePassword(): string {
  const lettersUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lettersLower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specials = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  const getChar = (charset: string) => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return charset[array[0] % charset.length];
  };

  let password = "";
  password += getChar(lettersUpper);
  password += getChar(lettersLower);
  password += getChar(numbers);
  password += getChar(specials);

  // Tamanho aleatório entre 12 e 20 caracteres (respeitando min 8, max 24)
  const lengthArray = new Uint32Array(1);
  window.crypto.getRandomValues(lengthArray);
  const length = 12 + (lengthArray[0] % 9); // 12 a 20

  const allChars = lettersUpper + lettersLower + numbers + specials;
  
  while (password.length < length) {
    password += getChar(allChars);
  }

  // Embaralhar
  let pwArray = password.split('');
  for (let i = pwArray.length - 1; i > 0; i--) {
    const rArray = new Uint32Array(1);
    window.crypto.getRandomValues(rArray);
    const j = rArray[0] % (i + 1);
    [pwArray[i], pwArray[j]] = [pwArray[j], pwArray[i]];
  }
  
  password = pwArray.join('');

  // Validar sequências repetitivas simples (ex: 1111, 1212)
  if (/(\d)\1{3,}/.test(password) || /(1212|1234|4321|9876)/.test(password)) {
    return generateSecurePassword(); // Refaz se bater na regra
  }

  return password;
}

export default function AddEmployeeModal({ isOpen, onClose, onSuccess, dict }: AddEmployeeModalProps) {
  const hrDict = dict || {}; // fallback
  const [email, setEmail] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [existingUser, setExistingUser] = useState<any>(null);
  const [userChecked, setUserChecked] = useState(false);

  // Forms
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState(new Date().toISOString().split('T')[0]);
  const [salario, setSalario] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quando o modal abre, resetamos tudo
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setNome("");
      setSenha(generateSecurePassword());
      setCargo("");
      setSalario("");
      setDataAdmissao(new Date().toISOString().split('T')[0]);
      setExistingUser(null);
      setUserChecked(false);
      setError(null);
    }
  }, [isOpen]);

  // Função para checar se usuário existe pelo email
  const handleCheckEmail = async () => {
    if (!email || !email.includes('@')) return;
    
    setCheckingEmail(true);
    setError(null);
    try {
      const users = await api.users.list();
      const found = users.find((u: any) => u.email === email);
      
      if (found) {
        setExistingUser(found);
        setNome(found.nome);
        // Se já existe, não precisamos cadastrar senha nova
      } else {
        setExistingUser(null);
        // Garante que tenha uma senha forte pronta para novo usuário
        setSenha(generateSecurePassword()); 
      }
      setUserChecked(true);
    } catch (err: any) {
      setError(hrDict.errors?.verifyEmail || "Erro ao verificar email.");
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let finalUserId = existingUser?.id;

      // 1. Criar Usuário (se não existir)
      if (!existingUser) {
        const newUser = await api.users.create({
          nome,
          email,
          senha,
          role: "FUNCIONARIO" // ou genérico
        });
        finalUserId = newUser.id;
      }

      // 2. Criar Funcionário
      // clinicaId normalmente é pego do contexto, mas a API de funcionários
      // Pede clinicaId no body para CreateFuncionarioInput
      const clinicaIdStr = localStorage.getItem('selectedClinicaId');
      if (!clinicaIdStr) throw new Error(hrDict.errors?.noClinic || "Clínica não selecionada.");

      await api.employees.create({
        usuarioId: Number(finalUserId),
        clinicaId: Number(clinicaIdStr),
        cargo,
        dataAdmissao: new Date(dataAdmissao).toISOString(), // RFC3339
        salario: Number(salario.replace(',', '.'))
      });

      onSuccess();
      onClose();

      // Aqui poderíamos enviar um email com a senha gerada, ou apenas mostrar em um alert de sucesso.
      if (!existingUser) {
          const alertMsg = hrDict.add?.successAlert?.replace('{senha}', senha) || `Funcionário Cadastrado! Senha: ${senha}`;
          alert(alertMsg);
      }

    } catch (err: any) {
      setError(err.message || hrDict.errors?.admit || "Erro ao admitir colaborador.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">person_add</span>
            {hrDict.add?.title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <div className="space-y-4">
            
            {/* EMAIL E VERIFICAÇÃO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{hrDict.add?.emailLabel}</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => {
                      setEmail(e.target.value);
                      setUserChecked(false);
                      setExistingUser(null);
                  }}
                  onBlur={handleCheckEmail}
                  className="flex-1 w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  placeholder="exemplo@email.com"
                />
                <button 
                  type="button" 
                  onClick={handleCheckEmail}
                  disabled={checkingEmail || !email}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  {checkingEmail ? hrDict.add?.searching : hrDict.add?.verify}
                </button>
              </div>
            </div>

            {userChecked && existingUser && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] mt-0.5">info</span>
                    <div>
                        <strong>{hrDict.add?.existingTitle}</strong><br />
                        {hrDict.add?.existingDesc?.replace('{nome}', existingUser.nome)}
                    </div>
                </div>
            )}

            {userChecked && !existingUser && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg text-sm flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] mt-0.5">person_add_alt_1</span>
                    <div>
                        <strong>{hrDict.add?.newTitle}</strong><br />
                        {hrDict.add?.newDesc}
                    </div>
                </div>
            )}

            {/* DADOS DO USUARIO (SE NOVO) */}
            {userChecked && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                <div className={existingUser ? "md:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{hrDict.add?.nameLabel}</label>
                    <input
                        type="text"
                        required
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        disabled={!!existingUser}
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white disabled:opacity-60"
                        placeholder={hrDict.add?.namePlaceholder}
                    />
                </div>
                
                {!existingUser && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{hrDict.add?.passwordLabel}</label>
                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                value={senha}
                                className="w-full p-2.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-600 font-mono text-sm pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setSenha(generateSecurePassword())}
                                className="absolute right-2 top-2.5 text-gray-400 hover:text-blue-500"
                                title={hrDict.add?.generatePw}
                            >
                                <span className="material-symbols-outlined text-[20px]">sync</span>
                            </button>
                        </div>
                    </div>
                )}
              </div>
            )}

            {/* DADOS CONTRATUAIS */}
            {userChecked && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4 mt-2 animate-in fade-in slide-in-from-top-2">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{hrDict.add?.roleLabel}</label>
                    <input
                        type="text"
                        required
                        value={cargo}
                        onChange={e => setCargo(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        placeholder={hrDict.add?.rolePlaceholder}
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{hrDict.add?.admissionLabel}</label>
                    <input
                        type="date"
                        required
                        value={dataAdmissao}
                        onChange={e => setDataAdmissao(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{hrDict.add?.salaryLabel}</label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        value={salario}
                        onChange={e => setSalario(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        placeholder="2500.00"
                    />
                </div>
              </div>
            )}

          </div>

          <div className="mt-8 flex justify-end gap-3 flex-wrap">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition disabled:opacity-50"
            >
              {hrDict.add?.cancel}
            </button>
            <button
              type="submit"
              disabled={loading || !userChecked}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                  {hrDict.add?.saving}
                </>
              ) : (
                hrDict.add?.finish
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
