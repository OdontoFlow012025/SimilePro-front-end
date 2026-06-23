"use client";

import React, { useState, useEffect } from 'react';
import { 
  configuracaoService, 
  ConfiguracoesAgregadasResponse, 
  ConfiguracaoClinica, 
  SalaAtendimento, 
  IntegracaoClinica 
} from '@/services/configuracaoService';

export default function ConfiguracoesClient() {
  const [data, setData] = useState<ConfiguracoesAgregadasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  // Modal states
  const [salaModalOpen, setSalaModalOpen] = useState(false);
  const [currentSala, setCurrentSala] = useState<Partial<SalaAtendimento>>({});
  
  const [integracaoModalOpen, setIntegracaoModalOpen] = useState(false);
  const [currentIntegracao, setCurrentIntegracao] = useState<Partial<IntegracaoClinica>>({ credenciais: {} });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await configuracaoService.getConfiguracoes();
      setData(res);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar configurações', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveGeral = async () => {
    if (!data) return;
    try {
      setSaving(true);
      await configuracaoService.updateConfiguracoesGerais(data.geral);
      showToast('Configurações salvas com sucesso!', 'success');
    } catch (err: any) {
      showToast('Erro ao salvar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeGeral = (field: keyof ConfiguracaoClinica, value: any) => {
    setData(prev => prev ? {
      ...prev,
      geral: { ...prev.geral, [field]: value }
    } : null);
  };

  // --- Salas ---
  const handleSaveSala = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await configuracaoService.saveSala(currentSala as SalaAtendimento);
      showToast('Sala salva com sucesso!', 'success');
      setSalaModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Erro ao salvar sala', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSala = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta sala?')) return;
    try {
      await configuracaoService.deleteSala(id);
      showToast('Sala removida', 'success');
      loadData();
    } catch (err) {
      showToast('Erro ao remover', 'error');
    }
  };

  // --- Integrações ---
  const handleSaveIntegracao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentIntegracao.plataforma) return;
    try {
      setSaving(true);
      await configuracaoService.saveIntegracao(
        currentIntegracao.plataforma, 
        currentIntegracao.credenciais || {}, 
        currentIntegracao.ativo ?? true, 
        currentIntegracao.id
      );
      showToast('Integração configurada!', 'success');
      setIntegracaoModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Erro ao configurar integração', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleIntegracao = async (intg: IntegracaoClinica) => {
    try {
      await configuracaoService.saveIntegracao(intg.plataforma, intg.credenciais, !intg.ativo, intg.id);
      loadData();
    } catch (err) {
      showToast('Erro ao alterar status', 'error');
    }
  };

  // Components auxiliares
  const Switch = ({ checked, onChange, label }: { checked: boolean, onChange: (v: boolean) => void, label: string }) => (
    <label className="flex items-center cursor-pointer justify-between w-full p-2 hover:bg-gray-50 rounded-lg transition-colors">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-4' : ''}`}></div>
      </div>
    </label>
  );

  if (loading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center text-gray-500">Nenhum dado encontrado.</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20">
      
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 text-white font-medium animate-fade-in ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Configurações Integradas</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os módulos, portal do paciente e integrações do seu sistema.</p>
        </div>
        <button 
          onClick={handleSaveGeral}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Preferências Gerais */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Preferências Gerais</h2>
          <div className="space-y-2">
            <Switch 
              label="Notificações por E-mail (Sistema)" 
              checked={data.geral.notificarEmail} 
              onChange={v => handleChangeGeral('notificarEmail', v)} 
            />
            <Switch 
              label="Backup Automático (Nuvem)" 
              checked={data.geral.backupAutomatico} 
              onChange={v => handleChangeGeral('backupAutomatico', v)} 
            />
            <div className="pt-2">
              <label className="text-sm font-medium text-gray-700 block mb-2">Tema do Sistema</label>
              <select 
                className="w-full border-gray-300 rounded-lg shadow-sm p-2 bg-gray-50 border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={data.geral.temaSistema}
                onChange={e => handleChangeGeral('temaSistema', e.target.value)}
              >
                <option value="light">Claro (Padrão)</option>
                <option value="dark">Escuro</option>
                <option value="auto">Automático (Sistema)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Portal do Paciente */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-bold text-gray-800">Portal do Paciente</h2>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full">
              <input type="checkbox" className="sr-only" checked={data.geral.portalAtivo} onChange={e => handleChangeGeral('portalAtivo', e.target.checked)} />
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${data.geral.portalAtivo ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </div>
          
          <div className={`space-y-2 ${!data.geral.portalAtivo ? 'opacity-50 pointer-events-none' : ''}`}>
            <Switch label="Permitir Pagamento Online" checked={data.geral.permitePagamentoOnline} onChange={v => handleChangeGeral('permitePagamentoOnline', v)} />
            <Switch label="Visualizar Histórico Clínico" checked={data.geral.visHistorico} onChange={v => handleChangeGeral('visHistorico', v)} />
            <Switch label="Visualizar Exames e Anexos" checked={data.geral.visExames} onChange={v => handleChangeGeral('visExames', v)} />
            <Switch label="Notificar Paciente via E-mail" checked={data.geral.notificaPacienteEmail} onChange={v => handleChangeGeral('notificaPacienteEmail', v)} />
          </div>
        </div>

        {/* Salas e Equipamentos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-bold text-gray-800">Salas e Equipamentos</h2>
            <button 
              onClick={() => { setCurrentSala({ exigeLimpeza: false, tempoLimpezaMinutos: 0 }); setSalaModalOpen(true); }}
              className="text-sm bg-blue-50 text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
            >
              + Nova Sala
            </button>
          </div>
          <div className="space-y-3">
            {data.salas.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nenhuma sala cadastrada.</p>
            ) : (
              data.salas.map(sala => (
                <div key={sala.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-800">{sala.nome}</p>
                    <p className="text-xs text-gray-500">{sala.equipamentos || 'Sem equipamentos listados'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setCurrentSala(sala); setSalaModalOpen(true); }} className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                      Editar
                    </button>
                    <button onClick={() => handleDeleteSala(sala.id!)} className="p-1.5 text-gray-500 hover:text-red-600 transition-colors">
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Integrações */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-bold text-gray-800">Hub de Integrações</h2>
            <button 
              onClick={() => { setCurrentIntegracao({ credenciais: {}, ativo: true }); setIntegracaoModalOpen(true); }}
              className="text-sm bg-blue-50 text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
            >
              + Conectar App
            </button>
          </div>
          <div className="space-y-3">
            {data.integracoes.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nenhuma integração configurada.</p>
            ) : (
              data.integracoes.map(intg => (
                <div key={intg.id} className="flex items-center justify-between p-3 border rounded-xl hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${intg.ativo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium text-gray-800">{intg.plataforma}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => { setCurrentIntegracao(intg); setIntegracaoModalOpen(true); }} className="text-xs text-blue-600 hover:underline">Configurar</button>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={intg.ativo} onChange={() => toggleIntegracao(intg)} />
                      <div className={`block w-8 h-5 rounded-full transition-colors cursor-pointer ${intg.ativo ? 'bg-blue-600' : 'bg-gray-300'}`} onClick={() => toggleIntegracao(intg)}></div>
                      <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform pointer-events-none ${intg.ativo ? 'transform translate-x-3' : ''}`}></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* --- Modals --- */}
      
      {/* Modal Sala */}
      {salaModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800">{currentSala.id ? 'Editar Sala' : 'Nova Sala'}</h3>
            </div>
            <form onSubmit={handleSaveSala} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Sala</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" value={currentSala.nome || ''} onChange={e => setCurrentSala({...currentSala, nome: e.target.value})} placeholder="Ex: Consultório 01" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipamentos Principais</label>
                <input type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" value={currentSala.equipamentos || ''} onChange={e => setCurrentSala({...currentSala, equipamentos: e.target.value})} placeholder="Ex: Cadeira Sirona, Raio-X Portátil" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="rounded text-blue-600" checked={currentSala.exigeLimpeza} onChange={e => setCurrentSala({...currentSala, exigeLimpeza: e.target.checked})} />
                  Exige Limpeza
                </label>
                {currentSala.exigeLimpeza && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tempo (minutos)</label>
                    <input type="number" min="0" className="w-24 border rounded-lg p-1 text-sm outline-none" value={currentSala.tempoLimpezaMinutos || 0} onChange={e => setCurrentSala({...currentSala, tempoLimpezaMinutos: parseInt(e.target.value)})} />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setSalaModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">{saving ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Integração */}
      {integracaoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800">{currentIntegracao.id ? 'Editar Integração' : 'Nova Integração'}</h3>
            </div>
            <form onSubmit={handleSaveIntegracao} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma</label>
                <select 
                  required 
                  disabled={!!currentIntegracao.id} 
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" 
                  value={currentIntegracao.plataforma || ''} 
                  onChange={e => setCurrentIntegracao({...currentIntegracao, plataforma: e.target.value, credenciais: {}})}
                >
                  <option value="">Selecione...</option>
                  <option value="PagSeguro">PagSeguro (Financeiro)</option>
                  <option value="Stripe">Stripe (Financeiro)</option>
                  <option value="RadioX_Pro">RadioX Pro (Imagens)</option>
                  <option value="Zendesk">Zendesk (Suporte)</option>
                </select>
              </div>
              
              {currentIntegracao.plataforma && (
                <div className="bg-gray-50 p-4 rounded-xl border space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Credenciais de Acesso</h4>
                  
                  {['PagSeguro', 'Stripe'].includes(currentIntegracao.plataforma) && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Public Key / Token</label>
                        <input required type="text" className="w-full border rounded p-1.5 text-sm" value={currentIntegracao.credenciais?.publicKey || ''} onChange={e => setCurrentIntegracao({...currentIntegracao, credenciais: {...currentIntegracao.credenciais, publicKey: e.target.value}})} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Secret Key</label>
                        <input required type="password" placeholder="****************" className="w-full border rounded p-1.5 text-sm" value={currentIntegracao.credenciais?.secretKey || ''} onChange={e => setCurrentIntegracao({...currentIntegracao, credenciais: {...currentIntegracao.credenciais, secretKey: e.target.value}})} />
                      </div>
                    </>
                  )}

                  {currentIntegracao.plataforma === 'RadioX_Pro' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Endpoint (URL do PACS)</label>
                        <input required type="url" placeholder="https://" className="w-full border rounded p-1.5 text-sm" value={currentIntegracao.credenciais?.endpoint || ''} onChange={e => setCurrentIntegracao({...currentIntegracao, credenciais: {...currentIntegracao.credenciais, endpoint: e.target.value}})} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Bearer Token</label>
                        <input required type="password" placeholder="JWT..." className="w-full border rounded p-1.5 text-sm" value={currentIntegracao.credenciais?.token || ''} onChange={e => setCurrentIntegracao({...currentIntegracao, credenciais: {...currentIntegracao.credenciais, token: e.target.value}})} />
                      </div>
                    </>
                  )}
                  
                  <p className="text-[10px] text-gray-500 mt-2">* Suas chaves serão criptografadas em repouso no banco de dados.</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <button type="button" onClick={() => setIntegracaoModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancelar</button>
                <button type="submit" disabled={saving || !currentIntegracao.plataforma} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">{saving ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
