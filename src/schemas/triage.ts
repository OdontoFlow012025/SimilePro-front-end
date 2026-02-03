import { z } from "zod";

export const TriageSchema = z.object({
  appointmentId: z.number(),
  patientId: z.number(),
  
  // Vital Signs
  bloodPressure: z.string().optional(), // 120/80
  heartRate: z.number().optional(), // bpm
  temperature: z.number().optional(), // Celsius
  oxygenSaturation: z.number().optional(), // %
  respiratoryRate: z.number().optional(), // rpm
  glucose: z.number().optional(), // mg/dL
  weight: z.number().optional(), // kg
  height: z.number().optional(), // cm

  // Assessment
  chiefComplaint: z.string().min(3, "Queixa principal é obrigatória"),
  riskClassification: z.enum(["AZUL", "VERDE", "AMARELO", "LARANJA", "VERMELHO"]),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  
  notes: z.string().optional(),
});

export type TriageData = z.infer<typeof TriageSchema>;
