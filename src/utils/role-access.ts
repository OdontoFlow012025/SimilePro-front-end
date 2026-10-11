export type SimileRole =
  | "ADMIN_TOTAL"
  | "ADMIN_GERENCIAL"
  | "ADMINISTRATIVO"
  | "RH"
  | "FINANCEIRO"
  | "FATURISTA"
  | "RECEPCIONISTA"
  | "TECNICO"
  | "ASSISTENTE"
  | "DENTISTA";

const OPERATIONAL_RECEPTION = ["/agenda", "/recepcao", "/pacientes"];
const OPERATIONAL_TRIAGE = [...OPERATIONAL_RECEPTION, "/triagem"];
const OPERATIONAL_DENTAL = [...OPERATIONAL_TRIAGE, "/atendimento", "/prontuarios"];
const ADMINISTRATION = ["/financeiro", "/equipe", "/rh", "/contabil", "/relatorios", "/estoque", "/configuracoes"];

const ROLE_PATHS: Record<string, string[]> = {
  ADMIN_TOTAL: ["*"],
  ADMIN_GERENCIAL: [...ADMINISTRATION, ...OPERATIONAL_DENTAL],
  ADMINISTRATIVO: ["/financeiro", "/contabil", "/relatorios"],
  RH: ["/rh"],
  FINANCEIRO: ["/financeiro", "/contabil", "/relatorios"],
  FATURISTA: ["/financeiro", "/contabil", "/relatorios"],
  RECEPCIONISTA: OPERATIONAL_RECEPTION,
  TECNICO: OPERATIONAL_TRIAGE,
  ASSISTENTE: OPERATIONAL_TRIAGE,
  DENTISTA: OPERATIONAL_DENTAL,
};

export function canAccessPath(role: string | null | undefined, routePath: string): boolean {
  if (!role) return false;
  const allowed = ROLE_PATHS[role] || [];
  const normalized = routePath.replace(/^\/(pt-BR|en|es)(?=\/|$)/, "") || "/";
  if (allowed.includes("*")) return true;
  return allowed.some((base) => normalized === base || normalized.startsWith(`${base}/`));
}

export function landingPathForRole(role: string | null | undefined): string {
  if (role === "ADMIN_TOTAL") return "/dashboard";
  if (role === "ADMIN_GERENCIAL") return "/agenda";
  if (role === "ADMINISTRATIVO" || role === "FINANCEIRO" || role === "FATURISTA") return "/financeiro";
  if (role === "RH") return "/rh";
  if (role === "RECEPCIONISTA") return "/recepcao";
  if (role === "TECNICO" || role === "ASSISTENTE") return "/triagem";
  if (role === "DENTISTA") return "/atendimento";
  return "";
}

export function isClinicAdministrator(role: string | null | undefined): boolean {
  return role === "ADMIN_TOTAL" || role === "ADMIN_GERENCIAL";
}
