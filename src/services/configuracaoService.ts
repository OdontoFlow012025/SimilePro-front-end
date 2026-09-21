import { request } from './api';

// --- INTERFACES DE TIPAGEM ESTRITA ---

export interface ConfiguracaoClinica {
  id?: number;
  clinicaId?: number;
  // Preferências Gerais
  temaSistema: 'light' | 'dark' | 'auto';
  notificarEmail: boolean;
  backupAutomatico: boolean;
  
  // Portal do Paciente
  portalAtivo: boolean;
  permitePagamentoOnline: boolean;
  regrasReagendamento: string;
  mensagemBoasVindas: string;
  visHistorico: boolean;
  visPrescricao: boolean;
  visExames: boolean;
  visOdontograma: boolean;
  notificaPacienteEmail: boolean;
  notificaPacienteSMS: boolean;
  
  // Relatórios e BI
  acessoDadosFinanceiros: boolean;
  filtroPeriodoPadrao: string; // Ex: '7d', '30d', '1m'
  
  // Configuração Fornecedores
  prazoPagtoFornecedorDias: number;
  exigirNFFornecedor: boolean;

  updatedAt?: string;
}

export interface SalaAtendimento {
  id?: number;
  clinicaId?: number;
  nome: string;
  equipamentos: string;
  exigeLimpeza: boolean;
  tempoLimpezaMinutos: number;
}

export interface IntegracaoClinica {
  id?: number;
  clinicaId?: number;
  plataforma: string;
  ativo: boolean;
  credenciais: Record<string, any>;
}

export interface CategoriaFornecimento {
  id?: number;
  clinicaId?: number;
  nome: string;
}

export interface CanalComunicacao {
  id?: number;
  clinicaId?: number;
  nome: string;
  ativo: boolean;
}

export interface ConfiguracoesAgregadasResponse {
  geral: ConfiguracaoClinica;
  salas: SalaAtendimento[];
  integracoes: IntegracaoClinica[];
  categorias: CategoriaFornecimento[];
  canais: CanalComunicacao[];
}

// --- SERVIÇO DE INTEGRAÇÃO (API CLIENT) ---

export const configuracaoService = {
  /**
   * Obtém todas as configurações integradas da clínica em uma única requisição.
   */
  getConfiguracoes: async (): Promise<ConfiguracoesAgregadasResponse> => {
    return request('/configuracoes');
  },

  /**
   * Atualiza o bloco de configurações escalares (Preferências, Portal, Fornecedores).
   */
  updateConfiguracoesGerais: async (dados: Partial<ConfiguracaoClinica>): Promise<ConfiguracaoClinica> => {
    return request('/configuracoes/geral', {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  },

  /**
   * Cria ou atualiza uma sala/consultório.
   */
  saveSala: async (sala: SalaAtendimento): Promise<SalaAtendimento> => {
    if (sala.id && sala.id > 0) {
      return request(`/configuracoes/salas/${sala.id}`, {
        method: 'PUT',
        body: JSON.stringify(sala),
      });
    }
    return request('/configuracoes/salas', {
      method: 'POST',
      body: JSON.stringify(sala),
    });
  },

  /**
   * Remove uma sala do sistema.
   */
  deleteSala: async (id: number): Promise<void> => {
    return request(`/configuracoes/salas/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Cria ou atualiza uma integração de plataforma terceirizada com credenciais flexíveis.
   */
  saveIntegracao: async (plataforma: string, credenciais: Record<string, any>, ativo: boolean = true, id?: number): Promise<IntegracaoClinica> => {
    const payload: IntegracaoClinica = {
      plataforma,
      credenciais,
      ativo,
    };

    if (id && id > 0) {
      return request(`/configuracoes/integracoes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    }
    return request('/configuracoes/integracoes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Remove uma integração do sistema.
   */
  deleteIntegracao: async (id: number): Promise<void> => {
    return request(`/configuracoes/integracoes/${id}`, {
      method: 'DELETE',
    });
  }
};
