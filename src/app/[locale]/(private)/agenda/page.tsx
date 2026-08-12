import { AgendamentoViewDTO, AgendamentoRaw, StatusAgendamento } from '@/types/agendamento';
import { api } from '@/services/api';
import AgendaCalendario from './_components/AgendaCalendario';

// 1. Função Estrita de Sanitização e Mapeamento (View DTO)
// Garante que nenhum metadado ou timestamp interno escape do Server
function toAgendamentoViewDTO(raw: AgendamentoRaw): AgendamentoViewDTO {
  // Helper de formatação de hora no servidor para aliviar carga no Client
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    }).format(date);
  };

  return {
    id: raw.uuid, // Usando UUID seguro em vez de id_interno_db
    profissionalId: raw.dentista_id,
    profissionalEspecialidade: (raw as any).especialidade || 'Dentista',
    pacienteNome: raw.paciente_nome_completo,
    dentistaNome: raw.dentista_nome,
    horarioInicio: formatTime(raw.data_hora_inicio),
    horarioFim: formatTime(raw.data_hora_fim),
    tipoProcedimento: raw.procedimento_descricao,
    status: raw.status_agendamento as StatusAgendamento,
  };
}

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
