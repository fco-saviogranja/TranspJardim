import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Mail,
  Pencil,
  Plus,
  Save,
  Settings,
  Trash2,
  Wrench,
} from 'lucide-react';
import { Panel } from '../components/Panel';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { apiFetch, apiJson } from '../lib/api';
import { useIsAdmin, useCurrentUser } from '../lib/userContext';

/* ───────────── Types ───────────── */

type Tab = 'alertas' | 'regras' | 'notificacoes' | 'globais';

type AlertaCriterio = {
  criterioId: string;
  nome: string;
  periodicidade: string;
  responsavel: string | null;
  secretariaId: string | null;
  secretariaNome: string | null;
  ultimaAtualizacao: string | null;
  situacao: 'pendente' | 'ok' | 'em_producao';
  observacao: string | null;
  atualizadoPor: string | null;
  situacaoId: string;
  cicloRef: string;
  vencimento: string;
  diasRestantes: number;
  prioridade: 'vencido' | 'urgente' | 'normal';
};

type AlertaRegra = {
  id: string;
  nome: string;
  descricao?: string | null;
  prioridade: string;
  ativo: boolean;
  triggerTipo: string;
  triggerDias: number;
  triggerMeta?: number | null;
  apenasDiasUteis: boolean;
  canalDashboard: boolean;
  canalEmail: boolean;
  dataCriacao?: string;
};

type RegraForm = {
  nome: string;
  descricao: string;
  prioridade: string;
  triggerTipo: string;
  triggerDias: number;
  triggerMeta: string;
  apenasDiasUteis: boolean;
  canalDashboard: boolean;
  canalEmail: boolean;
};

const emptyRegraForm: RegraForm = {
  nome: '',
  descricao: '',
  prioridade: 'media',
  triggerTipo: 'vencimento',
  triggerDias: 0,
  triggerMeta: '',
  apenasDiasUteis: true,
  canalDashboard: true,
  canalEmail: true,
};

type AlertaConfig = {
  sistemaAtivo: boolean;
  maxAlertasDia: number;
  limpezaDias: number;
  apenasDiasUteis: boolean;
  emailObrigatorio: boolean;
  modoDebug: boolean;
  notifDashboard: boolean;
  notifEmail: boolean;
  notifPush: boolean;
  frequenciaNotif: string;
  modoSilencioso: boolean;
};

const defaultConfig: AlertaConfig = {
  sistemaAtivo: true,
  maxAlertasDia: 50,
  limpezaDias: 30,
  apenasDiasUteis: true,
  emailObrigatorio: true,
  modoDebug: false,
  notifDashboard: true,
  notifEmail: false,
  notifPush: false,
  frequenciaNotif: 'imediato',
  modoSilencioso: false,
};

/* ───────────── Main Component ───────────── */

export default function Alertas() {
  const isAdmin = useIsAdmin();
  const currentUser = useCurrentUser();
  const [tab, setTab] = useState<Tab>('alertas');

  // Alertas de critérios
  const [alertas, setAlertas] = useState<AlertaCriterio[]>([]);
  const [alertasLoading, setAlertasLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modal de observação
  const [obsModal, setObsModal] = useState<{ item: AlertaCriterio; situacao: 'ok' | 'em_producao' } | null>(null);
  const [obsText, setObsText] = useState('');

  // Regras
  const [regras, setRegras] = useState<AlertaRegra[]>([]);
  const [showNewRegra, setShowNewRegra] = useState(false);
  const [showEditRegra, setShowEditRegra] = useState(false);
  const [selectedRegra, setSelectedRegra] = useState<AlertaRegra | null>(null);
  const [regraForm, setRegraForm] = useState<RegraForm>(emptyRegraForm);
  const [regraError, setRegraError] = useState('');

  // Config (global + notificações)
  const [config, setConfig] = useState<AlertaConfig>(defaultConfig);
  const [configSaved, setConfigSaved] = useState(false);

  const loadAlertas = useCallback(async () => {
    setAlertasLoading(true);
    try {
      const d = await apiJson<{ items: AlertaCriterio[] }>('/api/alertas/criterios');
      setAlertas((d.items ?? []) as AlertaCriterio[]);
    } catch { setAlertas([]); }
    finally { setAlertasLoading(false); }
  }, []);

  const loadRegras = useCallback(async () => {
    try {
      const d = await apiJson<{ items: AlertaRegra[] }>('/api/alerta-regras');
      setRegras((d.items ?? []) as AlertaRegra[]);
    } catch { setRegras([]); }
  }, []);

  const loadConfig = useCallback(async () => {
    try {
      const d = await apiJson<AlertaConfig>('/api/alerta-config');
      setConfig(d);
    } catch { /* keep defaults */ }
  }, []);

  useEffect(() => {
    void loadAlertas();
    void loadRegras();
    void loadConfig();
  }, [loadAlertas, loadRegras, loadConfig, isAdmin]);

  /* ── Situação ── */

  async function setSituacao(item: AlertaCriterio, situacao: 'ok' | 'em_producao' | 'pendente', observacao?: string) {
    setUpdatingId(item.criterioId);
    try {
      await apiFetch('/api/alertas/criterios/situacao', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criterioId: item.criterioId, cicloRef: item.cicloRef, situacao, observacao: observacao ?? '' }),
      });
      await loadAlertas();
    } finally {
      setUpdatingId(null);
    }
  }

  function openObsModal(item: AlertaCriterio, situacao: 'ok' | 'em_producao') {
    setObsModal({ item, situacao });
    setObsText(item.observacao ?? '');
  }

  async function confirmarObs() {
    if (!obsModal) return;
    await setSituacao(obsModal.item, obsModal.situacao, obsText);
    setObsModal(null);
  }

  /* ── Regra CRUD ── */

  function openNewRegraModal() {
    setRegraForm(emptyRegraForm);
    setRegraError('');
    setShowNewRegra(true);
  }

  function openEditRegraModal(r: AlertaRegra) {
    setSelectedRegra(r);
    setRegraForm({
      nome: r.nome,
      descricao: r.descricao ?? '',
      prioridade: r.prioridade,
      triggerTipo: r.triggerTipo,
      triggerDias: r.triggerDias,
      triggerMeta: r.triggerMeta != null ? String(r.triggerMeta) : '',
      apenasDiasUteis: r.apenasDiasUteis,
      canalDashboard: r.canalDashboard,
      canalEmail: r.canalEmail,
    });
    setRegraError('');
    setShowEditRegra(true);
  }

  async function createRegra() {
    setRegraError('');
    const body = {
      ...regraForm,
      triggerMeta: regraForm.triggerMeta ? Number(regraForm.triggerMeta) : null,
    };
    const res = await apiFetch('/api/alerta-regras', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) { const e = await res.json().catch(() => null) as { error?: string } | null; setRegraError(e?.error ?? 'Erro ao criar regra.'); return; }
    setShowNewRegra(false);
    void loadRegras();
  }

  async function updateRegra() {
    if (!selectedRegra) return;
    setRegraError('');
    const body = {
      ...regraForm,
      triggerMeta: regraForm.triggerMeta ? Number(regraForm.triggerMeta) : null,
    };
    const res = await apiFetch(`/api/alerta-regras/${selectedRegra.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) { const e = await res.json().catch(() => null) as { error?: string } | null; setRegraError(e?.error ?? 'Erro ao atualizar regra.'); return; }
    setShowEditRegra(false);
    void loadRegras();
  }

  async function toggleRegra(r: AlertaRegra) {
    await apiFetch(`/api/alerta-regras/${r.id}/toggle`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ativo: !r.ativo }) });
    void loadRegras();
  }

  async function deleteRegra(id: string) {
    if (!confirm('Excluir esta regra de alerta?')) return;
    await apiFetch(`/api/alerta-regras/${id}`, { method: 'DELETE' });
    void loadRegras();
  }

  /* ── Config save ── */

  async function saveConfig() {
    setConfigSaved(false);
    const res = await apiFetch('/api/alerta-config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
    if (res.ok) {
      const d = (await res.json().catch(() => null)) as AlertaConfig | null;
      if (d) setConfig(d);
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 3000);
    }
  }

  /* ── Tabs ── */

  const tabs: { key: Tab; label: string }[] = [
    { key: 'alertas', label: 'Alertas de Critérios' },
    { key: 'regras', label: 'Regras' },
    { key: 'notificacoes', label: 'Notificações' },
    { key: 'globais', label: 'Configurações' },
  ];

  const vencidos = alertas.filter((a) => a.prioridade === 'vencido' && a.situacao !== 'ok').length;
  const urgentes = alertas.filter((a) => a.prioridade === 'urgente' && a.situacao !== 'ok').length;
  const pendentes = alertas.filter((a) => a.situacao === 'pendente').length;

  return (
    <div className="grid gap-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text)]">Alertas</h2>
          <p className="mt-1 text-xs sm:text-sm text-[var(--text-muted)]">Critérios vencidos ou a vencer nos próximos 15 dias</p>
        </div>
        {tab === 'regras' && isAdmin && (
          <Button variant="primary" type="button" size="md" onClick={openNewRegraModal}>
            <Plus className="mr-1.5 h-4 w-4" />Nova Regra
          </Button>
        )}
      </div>

      {/* Resumo */}
      {tab === 'alertas' && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <SummaryCard color="danger" label="Vencidos" value={vencidos} icon={AlertTriangle} />
          <SummaryCard color="warning" label="Urgentes (≤15 dias)" value={urgentes} icon={Clock} />
          <SummaryCard color="muted" label="Pendentes de resposta" value={pendentes} icon={Bell} />
        </div>
      )}

      {/* Tab bar */}
      <div className="flex w-full overflow-x-auto rounded-lg border border-[var(--panel-border)] bg-[var(--bg)]">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`flex-none whitespace-nowrap px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.key
                ? 'bg-white text-[var(--text)] shadow-sm rounded-lg'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            {t.key === 'alertas' && pendentes > 0 && (
              <span className="ml-1.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-bold text-white">{pendentes}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab: Alertas de Critérios ── */}
      {tab === 'alertas' && (
        <AlertasCriteriosTab
          alertas={alertas}
          loading={alertasLoading}
          updatingId={updatingId}
          onSituacao={setSituacao}
          onOpenObs={openObsModal}
        />
      )}

      {/* ── Tab: Regras ── */}
      {tab === 'regras' && (
        <div className="grid gap-3">
          {regras.length === 0 && (
            <Panel className="flex flex-col items-center justify-center py-12">
              <Bell className="h-8 w-8 text-[var(--text-muted)]" />
              <span className="mt-2 text-sm text-[var(--text-muted)]">Nenhuma regra de alerta cadastrada.</span>
            </Panel>
          )}

          {regras.map((r) => (
            <RegraCard
              key={r.id}
              regra={r}
              isAdmin={isAdmin}
              onToggle={() => { void toggleRegra(r); }}
              onEdit={() => openEditRegraModal(r)}
              onDelete={() => { void deleteRegra(r.id); }}
            />
          ))}
        </div>
      )}

      {/* ── Tab: Notificações ── */}
      {tab === 'notificacoes' && (
        <Panel>
          <div className="flex items-center gap-2 text-base font-bold text-[var(--text)]">
            <Bell className="h-5 w-5" />
            Preferências de Notificação
          </div>
          {!isAdmin && <p className="mt-2 text-xs text-[var(--text-muted)]">Visualização somente leitura para usuários padrão.</p>}

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <ToggleField label="Dashboard" checked={config.notifDashboard} disabled={!isAdmin} onChange={(v) => setConfig((p) => ({ ...p, notifDashboard: v }))} />
            <ToggleField label="Email" checked={config.notifEmail} disabled={!isAdmin} onChange={(v) => setConfig((p) => ({ ...p, notifEmail: v }))} />
            <ToggleField label="Push Notifications" checked={config.notifPush} disabled={!isAdmin} onChange={(v) => setConfig((p) => ({ ...p, notifPush: v }))} />
          </div>

          <div className="mt-8">
            <label className="block text-sm font-bold text-[var(--text)]">Frequência de Notificações</label>
            <select
              className="mt-2 w-full rounded-lg border border-[var(--panel-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-lighter)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-[var(--text-muted)]"
              value={config.frequenciaNotif}
              disabled={!isAdmin}
              title="Frequência de Notificações"
              onChange={(e) => setConfig((p) => ({ ...p, frequenciaNotif: e.target.value }))}
            >
              <option value="imediato">Imediato</option>
              <option value="horario">A cada hora</option>
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
            </select>
          </div>

          <div className="mt-6">
            <ToggleField label="Modo Silencioso (Horário de Descanso)" checked={config.modoSilencioso} disabled={!isAdmin} onChange={(v) => setConfig((p) => ({ ...p, modoSilencioso: v }))} />
          </div>

          {isAdmin && (
            <button
              type="button"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
              onClick={() => { void saveConfig(); }}
            >
              <Save className="h-4 w-4" />Salvar Configurações
            </button>
          )}
          {configSaved && <p className="mt-2 text-center text-sm font-medium text-[var(--success)]">Configurações salvas com sucesso!</p>}
        </Panel>
      )}

      {/* ── Tab: Configurações Globais ── */}
      {tab === 'globais' && (
        <Panel>
          <div className="flex items-center gap-2 text-base font-bold text-[var(--text)]">
            <Settings className="h-5 w-5" />
            Configurações do Sistema
          </div>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Configure o comportamento global do sistema de alertas</p>
          {!isAdmin && <p className="mt-2 text-xs text-[var(--text-muted)]">Visualização somente leitura para usuários padrão.</p>}

          <div className="mt-6 grid gap-5">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-[var(--text)]">Sistema de Alertas Ativo</span>
                  <p className="text-xs text-[var(--text-muted)]">Habilita/desabilita todo o sistema de alertas</p>
                </div>
                <Toggle checked={config.sistemaAtivo} disabled={!isAdmin} onChange={(v) => setConfig((p) => ({ ...p, sistemaAtivo: v }))} />
              </div>
            </div>

            <NumberField label="Máximo de Alertas por Dia" value={config.maxAlertasDia} disabled={!isAdmin} onChange={(v) => setConfig((p) => ({ ...p, maxAlertasDia: v }))} />
            <div>
              <NumberField label="Limpeza Automática (dias)" value={config.limpezaDias} disabled={!isAdmin} onChange={(v) => setConfig((p) => ({ ...p, limpezaDias: v }))} />
              <p className="mt-1 text-xs text-[var(--text-muted)]">Alertas lidos serão removidos automaticamente após este período</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[var(--text)]">Apenas Dias Úteis</span>
                <p className="text-xs text-[var(--text-muted)]">Alertas enviados apenas em dias úteis (segunda a sexta, exceto feriados)</p>
              </div>
              <Toggle checked={config.apenasDiasUteis} disabled={!isAdmin} onChange={(v) => setConfig((p) => ({ ...p, apenasDiasUteis: v }))} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[var(--text)]">E-mail Obrigatório</span>
                <p className="text-xs text-[var(--text-muted)]">Todos os alertas devem incluir notificação por e-mail</p>
              </div>
              <Toggle checked={config.emailObrigatorio} disabled={!isAdmin} onChange={(v) => setConfig((p) => ({ ...p, emailObrigatorio: v }))} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[var(--text)]">Modo Debug</span>
                <p className="text-xs text-[var(--text-muted)]">Exibe logs detalhados no console</p>
              </div>
              <Toggle checked={config.modoDebug} disabled={!isAdmin} onChange={(v) => setConfig((p) => ({ ...p, modoDebug: v }))} />
            </div>
          </div>

          {isAdmin && (
            <button
              type="button"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
              onClick={() => { void saveConfig(); }}
            >
              <Save className="h-4 w-4" />Salvar Configurações
            </button>
          )}
          {configSaved && <p className="mt-2 text-center text-sm font-medium text-[var(--success)]">Configurações salvas com sucesso!</p>}
        </Panel>
      )}

      {/* ── Modals ── */}
      <Modal open={showNewRegra} title="Nova Regra" onClose={() => setShowNewRegra(false)}>
        <RegraFields form={regraForm} setForm={setRegraForm} />
        {regraError ? <div className="mt-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3 py-2.5 text-sm text-[var(--danger)]">{regraError}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowNewRegra(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void createRegra(); }}>Criar</Button>
        </div>
      </Modal>

      <Modal open={showEditRegra} title="Editar Regra" onClose={() => setShowEditRegra(false)}>
        <RegraFields form={regraForm} setForm={setRegraForm} />
        {regraError ? <div className="mt-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3 py-2.5 text-sm text-[var(--danger)]">{regraError}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowEditRegra(false)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void updateRegra(); }}>Salvar</Button>
        </div>
      </Modal>

      {/* Modal de observação */}
      <Modal open={obsModal !== null} title={obsModal?.situacao === 'ok' ? 'Marcar como OK' : 'Em Produção'} onClose={() => setObsModal(null)}>
        <p className="text-sm text-[var(--text-muted)]">Critério: <strong className="text-[var(--text)]">{obsModal?.item.nome}</strong></p>
        <label className="mt-4 block text-sm font-medium text-[var(--text)]">
          Observação (opcional)
          <textarea
            className="mt-1.5 w-full rounded-lg border border-[var(--panel-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-lighter)] min-h-[80px] resize-y"
            value={obsText}
            onChange={(e) => setObsText(e.target.value)}
            placeholder="Ex: publicado no portal em 18/02/2026..."
          />
        </label>
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setObsModal(null)}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={() => { void confirmarObs(); }}>Confirmar</Button>
        </div>
      </Modal>
    </div>
  );
}

/* ───────────── AlertasCriteriosTab ───────────── */

function AlertasCriteriosTab({
  alertas,
  loading,
  updatingId,
  onSituacao,
  onOpenObs,
}: {
  alertas: AlertaCriterio[];
  loading: boolean;
  updatingId: string | null;
  onSituacao: (item: AlertaCriterio, situacao: 'ok' | 'em_producao' | 'pendente', obs?: string) => Promise<void>;
  onOpenObs: (item: AlertaCriterio, situacao: 'ok' | 'em_producao') => void;
}) {
  const [showResolved, setShowResolved] = useState(false);

  if (loading) {
    return (
      <Panel className="flex flex-col items-center justify-center py-12">
        <span className="text-sm text-[var(--text-muted)]">Carregando alertas...</span>
      </Panel>
    );
  }

  const ativos = alertas.filter((a) => a.situacao !== 'ok');
  const resolvidos = alertas.filter((a) => a.situacao === 'ok');

  if (ativos.length === 0 && resolvidos.length === 0) {
    return (
      <Panel className="flex flex-col items-center justify-center py-12">
        <CheckCircle2 className="h-10 w-10 text-[var(--success)]" />
        <p className="mt-3 text-sm font-semibold text-[var(--success)]">Tudo em dia!</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">Nenhum critério vencido ou a vencer nos próximos 15 dias.</p>
      </Panel>
    );
  }

  return (
    <div className="grid gap-3">
      {ativos.map((item) => (
        <AlertaCard
          key={item.criterioId + item.cicloRef}
          item={item}
          disabled={updatingId === item.criterioId}
          onOk={() => onOpenObs(item, 'ok')}
          onEmProducao={() => onOpenObs(item, 'em_producao')}
          onPendente={() => void onSituacao(item, 'pendente')}
        />
      ))}
      {resolvidos.length > 0 && (
        <div>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg border border-[var(--panel-border)] bg-[var(--bg)] px-4 py-2.5 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition"
            onClick={() => setShowResolved((v) => !v)}
          >
            <span>Resolvidos neste ciclo ({resolvidos.length})</span>
            {showResolved ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showResolved && (
            <div className="mt-2 grid gap-2">
              {resolvidos.map((item) => (
                <AlertaCard
                  key={item.criterioId + item.cicloRef}
                  item={item}
                  disabled={updatingId === item.criterioId}
                  onOk={() => onOpenObs(item, 'ok')}
                  onEmProducao={() => onOpenObs(item, 'em_producao')}
                  onPendente={() => void onSituacao(item, 'pendente')}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ───────────── AlertaCard ───────────── */

function AlertaCard({
  item,
  disabled,
  onOk,
  onEmProducao,
  onPendente,
}: {
  item: AlertaCriterio;
  disabled: boolean;
  onOk: () => void;
  onEmProducao: () => void;
  onPendente: () => void;
}) {
  const isVencido = item.prioridade === 'vencido';
  const isOk = item.situacao === 'ok';
  const isEmProd = item.situacao === 'em_producao';

  const borderColor = isOk
    ? 'border-l-[var(--success)]'
    : isEmProd
    ? 'border-l-amber-400'
    : isVencido
    ? 'border-l-[var(--danger)]'
    : 'border-l-amber-400';

  const diasLabel = item.diasRestantes < 0
    ? `Vencido há ${Math.abs(item.diasRestantes)} dia(s)`
    : item.diasRestantes === 0
    ? 'Vence hoje'
    : `${item.diasRestantes} dia(s) restante(s)`;

  return (
    <div className={`rounded-xl border-l-4 bg-white p-4 shadow-sm ${borderColor}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-[var(--text)]">{item.nome}</span>
            <SituacaoBadge situacao={item.situacao} />
            <PrioridadeBadge prioridade={item.prioridade} />
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
            {item.secretariaNome && <span>{item.secretariaNome}</span>}
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{item.periodicidade}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className={item.diasRestantes < 0 ? 'text-[var(--danger)] font-semibold' : item.diasRestantes <= 5 ? 'text-[var(--warning)] font-semibold' : ''}>
                {diasLabel}
              </span>
            </span>
            <span>Vence: {item.vencimento}</span>
            <span>Ciclo: {item.cicloRef}</span>
          </div>
          {item.responsavel && (
            <p className="mt-1 text-xs text-[var(--text-muted)]">Responsável: <span className="font-medium text-[var(--text)]">{item.responsavel}</span></p>
          )}
          {(isOk || isEmProd) && item.observacao && (
            <p className="mt-1 text-xs italic text-[var(--text-muted)]">"{item.observacao}"</p>
          )}
          {(isOk || isEmProd) && item.atualizadoPor && (
            <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">por {item.atualizadoPor}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {!isOk && (
            <button
              type="button"
              disabled={disabled}
              onClick={onOk}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--success)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--success)] transition hover:bg-emerald-50 disabled:opacity-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />Está OK
            </button>
          )}
          {!isEmProd && (
            <button
              type="button"
              disabled={disabled}
              onClick={onEmProducao}
              className="flex items-center gap-1.5 rounded-lg border border-amber-400 bg-white px-3 py-1.5 text-xs font-semibold text-amber-600 transition hover:bg-amber-50 disabled:opacity-50"
            >
              <Wrench className="h-3.5 w-3.5" />Em Produção
            </button>
          )}
          {(isOk || isEmProd) && (
            <button
              type="button"
              disabled={disabled}
              onClick={onPendente}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition hover:bg-slate-50 disabled:opacity-50"
            >
              Desfazer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────── Badges ───────────── */

function SituacaoBadge({ situacao }: { situacao: string }) {
  if (situacao === 'ok') return <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[var(--success)]">OK</span>;
  if (situacao === 'em_producao') return <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">Em Produção</span>;
  return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-[var(--text-muted)]">Pendente</span>;
}

function PrioridadeBadge({ prioridade }: { prioridade: string }) {
  if (prioridade === 'vencido') return <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-[var(--danger)]">Vencido</span>;
  if (prioridade === 'urgente') return <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">Urgente</span>;
  return null;
}

/* ───────────── SummaryCard ───────────── */

function SummaryCard({ color, label, value, icon: Icon }: { color: 'danger' | 'warning' | 'muted'; label: string; value: number; icon: React.ElementType }) {
  const cls: Record<string, string> = {
    danger: 'border-[var(--danger)]/20 bg-red-50 text-[var(--danger)]',
    warning: 'border-amber-200 bg-amber-50 text-amber-600',
    muted: 'border-[var(--panel-border)] bg-white text-[var(--text-muted)]',
  };
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-4 ${cls[color]}`}>
      <Icon className="h-6 w-6 shrink-0" />
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="mt-0.5 text-xs font-medium">{label}</p>
      </div>
    </div>
  );
}

/* ───────────── Sub-components ───────────── */

function RegraCard({
  regra: r,
  isAdmin,
  onToggle,
  onEdit,
  onDelete,
}: {
  regra: AlertaRegra;
  isAdmin: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const prioLabel: Record<string, string> = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };
  const prioCls: Record<string, string> = {
    alta: 'bg-red-50 text-[var(--danger)]',
    media: 'bg-amber-50 text-[var(--warning)]',
    baixa: 'bg-blue-50 text-[var(--info)]',
  };
  const triggerLabel: Record<string, string> = { vencimento: 'vencimento', meta: 'meta', inatividade: 'inatividade' };

  return (
    <div className={`rounded-xl border-l-4 bg-white p-5 shadow-sm ${r.ativo ? 'border-l-[var(--primary)]' : 'border-l-slate-300'}`}>
      <div className="flex items-start justify-between gap-3">
        {/* Left content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-[var(--text)]">{r.nome}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${r.ativo ? 'bg-[var(--primary-lighter)] text-[var(--primary)]' : 'bg-slate-100 text-[var(--text-muted)]'}`}>
              {r.ativo ? 'Ativo' : 'Inativo'}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${prioCls[r.prioridade] ?? 'bg-slate-100 text-[var(--text-muted)]'}`}>
              {prioLabel[r.prioridade] ?? r.prioridade}
            </span>
          </div>

          {r.descricao && <p className="mt-1 text-sm text-[var(--text-muted)]">{r.descricao}</p>}

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
            <span>Trigger: {triggerLabel[r.triggerTipo] ?? r.triggerTipo}</span>
            {r.triggerTipo === 'meta' && r.triggerMeta != null && <span>Meta: {r.triggerMeta}%</span>}
            {r.triggerTipo !== 'meta' && <span>Dias: {r.triggerDias}</span>}
            {r.apenasDiasUteis && (
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Dias úteis</span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {r.canalDashboard && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-[var(--text)]">Dashboard</span>
            )}
            {r.canalEmail && (
              <span className="flex items-center gap-1 rounded-md bg-[var(--primary)] px-2 py-0.5 text-[10px] font-semibold text-white">
                <Mail className="h-2.5 w-2.5" />Email (Obrigatório)
              </span>
            )}
            {r.apenasDiasUteis && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-[var(--text-muted)]">
                <Calendar className="h-3 w-3" />Apenas dias úteis
              </span>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">
          {isAdmin && (
            <>
              <Toggle checked={r.ativo} onChange={onToggle} />
              <button className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--primary-lighter)] hover:text-[var(--primary)]" type="button" title="Editar" onClick={onEdit}><Pencil className="h-4 w-4" /></button>
              <button className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-red-50 hover:text-[var(--danger)]" type="button" title="Excluir" onClick={onDelete}><Trash2 className="h-4 w-4" /></button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RegraFields({
  form,
  setForm,
}: {
  form: RegraForm;
  setForm: React.Dispatch<React.SetStateAction<RegraForm>>;
}) {
  const inputCls = 'rounded-lg border border-[var(--panel-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-lighter)]';

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Nome *</span>
        <input className={inputCls} value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Prioridade</span>
        <select className={inputCls} value={form.prioridade} onChange={(e) => setForm((p) => ({ ...p, prioridade: e.target.value }))}>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
      </label>
      <label className="col-span-full grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Descrição</span>
        <textarea className={inputCls + ' min-h-[60px] resize-y'} value={form.descricao} onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
        <span>Tipo de Trigger</span>
        <select className={inputCls} value={form.triggerTipo} onChange={(e) => setForm((p) => ({ ...p, triggerTipo: e.target.value }))}>
          <option value="vencimento">Vencimento</option>
          <option value="meta">Meta</option>
          <option value="inatividade">Inatividade</option>
        </select>
      </label>
      {form.triggerTipo === 'meta' ? (
        <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
          <span>Meta (%)</span>
          <input className={inputCls} type="number" min={0} max={100} value={form.triggerMeta} onChange={(e) => setForm((p) => ({ ...p, triggerMeta: e.target.value }))} />
        </label>
      ) : (
        <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
          <span>Dias</span>
          <input className={inputCls} type="number" min={0} value={form.triggerDias} onChange={(e) => setForm((p) => ({ ...p, triggerDias: Number(e.target.value) }))} />
        </label>
      )}
      <div className="col-span-full grid gap-3 md:grid-cols-3">
        <CheckboxField label="Apenas dias úteis" checked={form.apenasDiasUteis} onChange={(v) => setForm((p) => ({ ...p, apenasDiasUteis: v }))} />
        <CheckboxField label="Canal Dashboard" checked={form.canalDashboard} onChange={(v) => setForm((p) => ({ ...p, canalDashboard: v }))} />
        <CheckboxField label="Canal Email" checked={form.canalEmail} onChange={(v) => setForm((p) => ({ ...p, canalEmail: v }))} />
      </div>
    </div>
  );
}

/* ── Toggle ── */

function Toggle({ checked, onChange, disabled = false }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${checked ? 'bg-[var(--primary)]' : 'bg-slate-300'}`}
      title={checked ? 'Desativar' : 'Ativar'}
    >
      <input
        type="checkbox"
        className="sr-only"
        aria-label={checked ? 'Desativar' : 'Ativar'}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </label>
  );
}

function ToggleField({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-bold text-[var(--text)]">{label}</span>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} title={label} className="h-4 w-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary-lighter)]" />
      {label}
    </label>
  );
}

function NumberField({ label, value, onChange, disabled = false }: { label: string; value: number; onChange: (v: number) => void; disabled?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-bold text-[var(--text)]">{label}</label>
      <input
        type="number"
        min={0}
        disabled={disabled}
        title={label}
        className="mt-2 w-full rounded-lg border border-[var(--panel-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-lighter)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-[var(--text-muted)]"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
