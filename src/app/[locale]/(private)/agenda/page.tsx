import { AgendamentoViewDTO, AgendamentoRaw, StatusAgendamento } from '@/types/agendamento';
import { api } from '@/services/api';
import AgendaCalendario from './_components/AgendaCalendario';



interface AgendaPageProps {
  // Suporte a Next.js 15+ onde searchParams pode ser uma Promise
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

export default async function AgendaPage({ searchParams }: AgendaPageProps) {
  // 2. Capturar data da URL e aplicar Data Padrão (Hoje)
  const resolvedParams = await searchParams;
  let dataSelecionada = resolvedParams?.data as string;

  if (!dataSelecionada) {
    const today = new Date();
    // Formato YYYY-MM-DD para compatibilidade estrita com backend Golang
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dataSelecionada = `${yyyy}-${mm}-${dd}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Agenda Odontológica
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Visão diária otimizada. Gerencie consultas garantindo eficiência e segurança.
          </p>
        </div>
        
        {/* Passamos ao Client Component APENAS a data. O fetch será lá. */}
        <AgendaCalendario 
          dataSelecionada={dataSelecionada} 
        />
      </div>
    </div>
  );
}
