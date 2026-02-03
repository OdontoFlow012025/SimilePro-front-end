import { z } from "zod";

// Statuses found in Swagger + AttendanceFlow usage
export const ReceptionStatusEnum = z.enum([
  "AGENDADO",
  "CONFIRMADO", 
  "AGUARDANDO", // "Waiting" - Critical for Reception
  "EM_ATENDIMENTO", // "In Service"
  "ATENDIDO", // "Finished"
  "CANCELADO",
  "NAO_COMPARECEU"
]);

export const PatientSchema = z.object({
  id: z.number().optional(), // ID might be missing in creates, present in reads
  nome: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().optional().nullable(),
  telefonePrincipal: z.string().optional().nullable(),
  email: z.string().optional().nullable(), // Relaxed email validation
  // Add other fields as needed for display
});

export const DentistSchema = z.object({
  id: z.number(),
  // Often returned joined with user info
  usuario: z.object({
    nome: z.string()
  }).optional().nullable()
});

export const AppointmentSchema = z.object({
  id: z.number(),
  pacienteId: z.number().nullable().optional(),
  dentistaId: z.number().nullable().optional(),
  dataHoraInicio: z.string(), // ISO Date
  dataHoraFim: z.string(),   // ISO Date
  status: ReceptionStatusEnum.or(z.string()), // Fallback to string if API sends undocumented status
  motivoConsulta: z.string().optional().nullable(),
  
  // Relations (often included in lists)
  paciente: PatientSchema.optional().nullable(),
  dentista: DentistSchema.optional().nullable(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;
export type Patient = z.infer<typeof PatientSchema>;
export type ReceptionStatus = z.infer<typeof ReceptionStatusEnum>;
