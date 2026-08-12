"use client";

import React, { useState, useEffect } from "react";

interface SupportChatSearchProps {
  placeholder: string;
}

export default function SupportChatSearch({ placeholder }: SupportChatSearchProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [answer, setAnswer] = useState("");
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  const typingSpeed = 30; // ms per character

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setHasSearched(true);
    setIsSearching(true);
    setAnswer("");
    setDisplayedAnswer("");

    // Mock API call delay
    setTimeout(() => {
      setIsSearching(false);
      // Simulate AI response based on query length/content
      const mockResponse = generateMockResponse(query);
      setAnswer(mockResponse);
    }, 1500);
  };

  // Typewriter effect
  useEffect(() => {
    if (!isSearching && answer) {
      let currentText = "";
      let i = 0;
      
      const interval = setInterval(() => {
        if (i < answer.length) {
          currentText += answer.charAt(i);
          setDisplayedAnswer(currentText);
          i++;
        } else {
          clearInterval(interval);
        }
      }, typingSpeed);

      return () => clearInterval(interval);
    }
  }, [isSearching, answer]);

  const generateMockResponse = (q: string) => {
    const lowerQ = q.toLowerCase();
    if (lowerQ.includes("senha") || lowerQ.includes("password")) {
      return "Para redefinir sua senha, clique em 'Esqueci minha senha' na tela de login. Um link de recuperação será enviado para o seu e-mail cadastrado. Siga as instruções no e-mail para criar uma nova senha com segurança.";
    }
    if (lowerQ.includes("atestado") || lowerQ.includes("icp")) {
      return "A emissão de atestados com ICP-Brasil pode ser feita diretamente no prontuário do paciente. Selecione a opção 'Documentos', escolha o modelo de Atestado, preencha as informações e clique em 'Assinar Digitalmente'. Certifique-se de que o seu certificado digital A1 ou A3 está conectado e configurado.";
    }
    if (lowerQ.includes("plano") || lowerQ.includes("planos") || lowerQ.includes("preco") || lowerQ.includes("preço")) {
       return "Nossos planos estão sendo atualizados no momento para trazer ainda mais benefícios para a sua clínica. Por enquanto, as informações de preços estão temporariamente indisponíveis (Em breve). Se tiver urgência, nossa equipe comercial está disponível via WhatsApp para tirar suas dúvidas!";
    }
    return `Essa é uma excelente pergunta sobre "${q}". Nossa Inteligência Artificial ainda está aprendendo e sendo configurada para responder a todos os tópicos do sistema. Por enquanto, se você não encontrou a resposta que procurava nos cards abaixo, nossa equipe de suporte pelo WhatsApp está pronta para te ajudar imediatamente!`;
  };

  return (
    <div className="relative max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
      <form onSubmit={handleSubmit} className="relative z-20">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-3xl">search</span>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-16 pl-14 pr-16 rounded-2xl bg-white text-slate-900 text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all placeholder:text-slate-400"
        />
        <button 
          type="submit" 
          disabled={!query.trim() || isSearching}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
             <span className="material-symbols-outlined animate-spin">progress_activity</span>
          ) : (
             <span className="material-symbols-outlined">send</span>
          )}
        </button>
      </form>

      {/* Inline Expandable Response Area */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          hasSearched ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="relative p-6 md:p-8 rounded-2xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 shadow-2xl text-left flex gap-4">
          <div className="flex-shrink-0 mt-1">
             <div className="size-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-xl">smart_toy</span>
             </div>
          </div>
          <div className="flex-1 text-blue-50 text-lg leading-relaxed">
            {isSearching ? (
              <div className="flex gap-1 mt-3">
                <div className="w-2.5 h-2.5 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2.5 h-2.5 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-blue-300 rounded-full animate-bounce"></div>
              </div>
            ) : (
              <p>
                {displayedAnswer}
                {displayedAnswer !== answer && (
                  <span className="inline-block w-2 h-5 ml-1 bg-blue-400 animate-pulse align-middle"></span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
