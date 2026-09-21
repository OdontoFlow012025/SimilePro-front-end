'use client';
import { useEffect, useState } from 'react';
import CardUsuarios from './CardUsuarios';
import CardServicos from './CardServicos';
import CardDadosClinica from './CardDadosClinica';
import CardIntegracoes from './CardIntegracoes';
import CardPreferencias from './CardPreferencias';
import CardRelatoriosBI from './CardRelatoriosBI';
import CardSalas from './CardSalas';
import CardPortalPaciente from './CardPortalPaciente';
import CardFornecedores from './CardFornecedores';

import { api } from '@/services/api';
import { configuracaoService, ConfiguracoesAgregadasResponse } from '@/services/configuracaoService';

export default function ConfiguracoesClient({ dict }: { dict: any }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clinica, setClinica] = useState<any>(null);
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesAgregadasResponse | null>(null);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [procedimentos, setProcedimentos] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await api.auth.me();
        const role = user.tipoUsuario || user.role;
        const isTotalAdmin = role === 'ADMIN_TOTAL';
        setIsAdmin(isTotalAdmin);

        let clinicData = null;
        if (user.clinicId) {
          clinicData = await api.clinics.getById(user.clinicId);
        } else {
          const clinicas = await api.clinics.list();
          if (clinicas && clinicas.length > 0) clinicData = clinicas[0];
        }
        setClinica(clinicData);

        const [configData, usersData, proceduresData] = await Promise.all([
          configuracaoService.getConfiguracoes().catch(() => null),
          api.employees.list().catch(() => []),
          api.procedures.list().catch(() => [])
        ]);

        const funcionariosAtivos = usersData.filter((emp: any) => emp.ativo !== false && emp.status !== 'INATIVO' && emp.status !== 'DEMITIDO');

        setConfiguracoes(configData || {
          geral: {
            temaSistema: 'system',
            notificarEmail: true,
            backupAutomatico: true,
            portalAtivo: true,
            permitePagamentoOnline: true,
            regrasReagendamento: '',
            mensagemBoasVindas: '',
            visHistorico: false,
            visPrescricao: false,
            visExames: false,
            visOdontograma: false,
            notificaPacienteEmail: true,
            notificaPacienteSMS: false,
            acessoDadosFinanceiros: true,
            filtroPeriodoPadrao: '30d',
            prazoPagtoFornecedorDias: 30,
            exigirNFFornecedor: true
          } as any,
          salas: [],
          integracoes: [],
          categorias: [],
          canais: []
        });
        
        setUsuarios(funcionariosAtivos || []);
        setProcedimentos(proceduresData || []);
        
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const s = dict.settings;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho Fixo */}
        <div className="sticky top-0 z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{s.header.title}</h1>
              {!isAdmin && (
                <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  {s.header.readOnly}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.header.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
              {s.header.cancel}
            </button>
            <button 
              disabled={!isAdmin}
              className={`px-5 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-colors ${isAdmin ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed opacity-70'}`}
            >
              {s.header.save}
            </button>
          </div>
        </div>

        {/* Grid de Configurações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <CardUsuarios usuarios={usuarios} isAdmin={isAdmin} dict={dict} />
          <CardServicos procedimentos={procedimentos} isAdmin={isAdmin} dict={dict} />
          
          <div className="lg:col-span-2">
            <CardDadosClinica clinica={clinica} isAdmin={isAdmin} dict={dict} />
          </div>

          <CardIntegracoes integracoes={configuracoes?.integracoes || []} isAdmin={isAdmin} dict={dict} />
          <CardPreferencias configuracaoGeral={configuracoes?.geral} isAdmin={isAdmin} dict={dict} />
          <CardRelatoriosBI configuracaoGeral={configuracoes?.geral} isAdmin={isAdmin} dict={dict} />
          <CardSalas salas={configuracoes?.salas || []} isAdmin={isAdmin} dict={dict} />
          <CardPortalPaciente configuracaoGeral={configuracoes?.geral} isAdmin={isAdmin} dict={dict} />
          <CardFornecedores configuracaoGeral={configuracoes?.geral} categorias={configuracoes?.categorias || []} isAdmin={isAdmin} dict={dict} />
        </div>

      </div>
    </div>
  );
}
