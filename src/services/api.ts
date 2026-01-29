const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function request(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
    'ngrok-skip-browser-warning': 'true',
    ...(options.headers as Record<string, string>),
  };

  // Client-side: Auto-inject token from cookie
  if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp("(^| )auth_token=([^;]+)"));
      if (match && match[2]) {
          headers['Authorization'] = `Bearer ${match[2]}`;
      }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  // if (response.status === 401) {
  //   // Token expired handling disabled to prevent loops until robust refresh logic is added
  // }

  if (!response.ok) {
    // console.error("API Error Details:", data); // Removed to avoid channel spam on handled errors
    throw new Error(data.message || JSON.stringify(data) || `Erro na requisição: ${response.statusText}`);
  }

  return data;
}

export const api = {
  health: () => request('/'),

  auth: {
    login: (data: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    signup: (data: any) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  },

  users: {
    create: (data: any) => request('/user', { method: 'POST', body: JSON.stringify(data) }),
    list: () => request('/user'),
    getById: (id: string) => request(`/user/${id}`),
    update: (id: string, data: any) => request(`/user/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/user/${id}`, { method: 'DELETE' }),
  },

  clinics: {
    create: (data: any) => request('/clinicas', { method: 'POST', body: JSON.stringify(data) }),
    list: () => request('/clinicas'),
    getById: (id: string) => request(`/clinicas/${id}`),
    linkUser: (id: string, data: any) => request(`/clinicas/${id}/vincular`, { method: 'POST', body: JSON.stringify(data) }),
  },

  dentists: {
    create: (data: any) => request('/dentistas', { method: 'POST', body: JSON.stringify(data) }),
    list: () => request('/dentistas'),
    getById: (id: string) => request(`/dentistas/${id}`),
    update: (id: string, data: any) => request(`/dentistas/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/dentistas/${id}`, { method: 'DELETE' }),
  },

  admin: {
    getConfigs: () => request('/administracao/configuracoes'),
    getConfigByKey: (key: string) => request(`/administracao/configuracoes/${key}`),
    setConfig: (key: string, data: any) => request(`/administracao/configuracoes/${key}`, { method: 'PUT', body: JSON.stringify(data) }),
    log: (data: any) => request('/administracao/logs', { method: 'POST', body: JSON.stringify(data) }),
    getLogs: () => request('/administracao/logs'),
    getStats: () => request('/administracao/estatisticas'),
    clearOldLogs: () => request('/administracao/logs/antigos', { method: 'DELETE' }),
  },

  scheduling: {
    create: (data: any) => request('/agendamentos', { method: 'POST', body: JSON.stringify(data) }),
    list: (query?: string) => request(`/agendamentos${query ? `?${query}` : ''}`),
    getByDentist: (dentistId: string) => request(`/agendamentos/dentista/${dentistId}`),
    getById: (id: string) => request(`/agendamentos/${id}`),
    update: (id: string, data: any) => request(`/agendamentos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/agendamentos/${id}`, { method: 'DELETE' }),
    updateStatus: (id: string, data: any) => request(`/agendamentos/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
    getDashboardStats: () => request('/agendamentos/dashboard/hoje'),
  },

  accounting: {
    createCostCenter: (data: any) => request('/contabilidade/centros-custo', { method: 'POST', body: JSON.stringify(data) }),
    listCostCenters: () => request('/contabilidade/centros-custo'),
    getCostCenter: (id: string) => request(`/contabilidade/centros-custo/${id}`),
    updateCostCenter: (id: string, data: any) => request(`/contabilidade/centros-custo/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    createAccount: (data: any) => request('/contabilidade/plano-contas', { method: 'POST', body: JSON.stringify(data) }),
    listAccounts: () => request('/contabilidade/plano-contas'),
    getAccountStructure: () => request('/contabilidade/plano-contas/estrutura'),
    getBalance: (query?: string) => request(`/contabilidade/relatorios/balanco${query ? `?${query}` : ''}`),
    getCashFlow: (query?: string) => request(`/contabilidade/dashboard/fluxo-caixa${query ? `?${query}` : ''}`),
    getDRE: () => request('/contabilidade/relatorios/dre'),
    getCostCenterReport: () => request('/contabilidade/relatorios/centros-custo'),
  },

  educational: {
    approveEvolution: (id: string) => request(`/educacional/aprovacao/${id}`, { method: 'PATCH' }),
  },

  insurance: {
    create: (data: any) => request('/convenios', { method: 'POST', body: JSON.stringify(data) }),
    list: () => request('/convenios'),
    getById: (id: string) => request(`/convenios/${id}`),
    update: (id: string, data: any) => request(`/convenios/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/convenios/${id}`, { method: 'DELETE' }),
  },

  billing: {
    createInvoice: (data: any) => request('/faturamento/faturas', { method: 'POST', body: JSON.stringify(data) }),
    listInvoices: () => request('/faturamento/faturas'),
    emitInvoice: (id: string) => request(`/faturamento/faturas/${id}/emitir`, { method: 'POST' }),
    payInvoice: (id: string, data: any) => request(`/faturamento/faturas/${id}/pagar`, { method: 'POST', body: JSON.stringify(data) }),
    cancelInvoice: (id: string) => request(`/faturamento/faturas/${id}/cancelar`, { method: 'POST' }),
    getInvoice: (id: string) => request(`/faturamento/faturas/${id}`),
    getOverdueInvoices: () => request('/faturamento/faturas/atrasadas'),
    getPatientInvoices: (patientId: string) => request(`/faturamento/faturas/paciente/${patientId}`),
    getReport: () => request('/faturamento/relatorios/faturamento'),
    getSummary: () => request('/faturamento/resumo'),
  },

  employees: {
    create: (data: any) => request('/funcionarios', { method: 'POST', body: JSON.stringify(data) }),
    list: () => request('/funcionarios'),
    getById: (id: string) => request(`/funcionarios/${id}`),
    update: (id: string, data: any) => request(`/funcionarios/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/funcionarios/${id}`, { method: 'DELETE' }),
  },

  patients: {
    create: (data: any) => request('/pacientes', { method: 'POST', body: JSON.stringify(data) }),
    list: () => request('/pacientes'),
    getById: (id: string) => request(`/pacientes/${id}`),
    update: (id: string, data: any) => request(`/pacientes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/pacientes/${id}`, { method: 'DELETE' }),
  },

  procedures: {
    create: (data: any) => request('/procedimentos', { method: 'POST', body: JSON.stringify(data) }),
    list: () => request('/procedimentos'),
    getById: (id: string) => request(`/procedimentos/${id}`),
    update: (id: string, data: any) => request(`/procedimentos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/procedimentos/${id}`, { method: 'DELETE' }),
  },

  treatmentPlans: {
    create: (data: any) => request('/planos-tratamento', { method: 'POST', body: JSON.stringify(data) }),
    list: () => request('/planos-tratamento'),
    getById: (id: string) => request(`/planos-tratamento/${id}`),
    update: (id: string, data: any) => request(`/planos-tratamento/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/planos-tratamento/${id}`, { method: 'DELETE' }),
    addItem: (planId: string, data: any) => request(`/planos-tratamento/${planId}/itens`, { method: 'POST', body: JSON.stringify(data) }),
    updateItemStatus: (itemId: string, data: any) => request(`/planos-tratamento/itens/${itemId}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  medicalRecords: {
    create: (data: any) => request('/prontuarios', { method: 'POST', body: JSON.stringify(data) }),
    list: () => request('/prontuarios'),
    getByPatient: (patientId: string) => request(`/prontuarios/paciente/${patientId}`),
    getById: (id: string) => request(`/prontuarios/${id}`),
    update: (id: string, data: any) => request(`/prontuarios/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/prontuarios/${id}`, { method: 'DELETE' }),
    addEvolution: (id: string, data: any) => request(`/prontuarios/${id}/evolucoes`, { method: 'POST', body: JSON.stringify(data) }),
    getEvolutions: (id: string) => request(`/prontuarios/${id}/evolucoes`),
  },

  accessControl: {
    requestAccess: (data: any) => request('/access-request', { method: 'POST', body: JSON.stringify(data) }),
    approveAccess: (id: string) => request(`/access-request/${id}/approve`, { method: 'PATCH' }),
    rejectAccess: (id: string) => request(`/access-request/${id}/reject`, { method: 'PATCH' }),
  },

  financialTransactions: {
    create: (data: any) => request('/transacoes-financeiras', { method: 'POST', body: JSON.stringify(data) }),
    list: () => request('/transacoes-financeiras'),
    getByPeriod: (query?: string) => request(`/transacoes-financeiras/periodo${query ? `?${query}` : ''}`),
    getSummary: (query?: string) => request(`/transacoes-financeiras/resumo${query ? `?${query}` : ''}`),
    getById: (id: string) => request(`/transacoes-financeiras/${id}`),
    update: (id: string, data: any) => request(`/transacoes-financeiras/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/transacoes-financeiras/${id}`, { method: 'DELETE' }),
    updateStatus: (id: string, data: any) => request(`/transacoes-financeiras/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
};
