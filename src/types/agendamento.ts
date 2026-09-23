export type StatusAgendamento = 'CONFIRMADO' | 'PENDENTE' | 'CANCELADO' | 'CONCLUIDO';

// Representação bruta dos dados (simulando a entidade do DB Go/Prisma)
export interface AgendamentoRaw {
  id_interno_db: number; // Dado sensível que não deve ir pro client
  uuid: string;
  paciente_id: number;
  paciente_nome_completo: string;
  dentista_id: number;
  dentista_nome: string;
  procedimento_codigo: string;
  procedimento_descricao: string;
  data_hora_inicio: string; // ISO 8601
  data_hora_fim: string; // ISO 8601
  status_agendamento: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// View DTO - Tipo estritamente seguro e focado apenas na View (UI)
export interface AgendamentoViewDTO {
  id: string;
  profissionalId: number;
  profissionalEspecialidade: string;
  pacienteNome: string;
  dentistaNome: string;
  horarioInicio: string; // Formatado para exibição (ex: 09:00)
  horarioFim: string; // Formatado para exibição (ex: 10:00)
  start: Date;
  end: Date;
  tipoProcedimento: string;
  status: StatusAgendamento;
}
