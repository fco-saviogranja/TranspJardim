import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  ListChecks,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { Panel } from '../components/Panel';
import { apiJson } from '../lib/api';

// ── Eixos temáticos do PNTP (Cartilha 2025) ─────────────────────────────────
const EIXOS_PNTP = [
  { id: 'inst',   label: 'Informações Institucionais',         icon: BookOpen,    cor: 'bg-sky-500' },
  { id: 'fin',    label: 'Receitas e Despesas',                icon: TrendingUp,  cor: 'bg-emerald-500' },
  { id: 'conv',   label: 'Convênios e Transferências',         icon: FileText,    cor: 'bg-violet-500' },
  { id: 'rh',     label: 'Recursos Humanos',                   icon: Users,       cor: 'bg-amber-500' },
  { id: 'lic',    label: 'Licitações e Contratos',             icon: ListChecks,  cor: 'bg-rose-500' },
  { id: 'plan',   label: 'Planejamento e Prestação de Contas', icon: ShieldCheck, cor: 'bg-indigo-500' },
  { id: 'sic',    label: 'SIC / Ouvidoria / LGPD',             icon: Bell,        cor: 'bg-teal-500' },
  { id: 'outros', label: 'Outros Critérios',                   icon: Zap,         cor: 'bg-orange-500' },
];

type SecretariaRow = {
  sigla: string;
  secretaria: string;
  total: number;
  concluidos: number;
  ativos: number;
  pendentes: number;
  vencidos: number;
};

type PeriodicidadeRow = {
  periodicidade: string;
  total: number;
};

type Metrics = {
  totalCriterios: number;
  criteriosConcluidos: number;
  ativos: number;
  inativos: number;
  pendentes: number;
  vencidos: number;
  alertasVencidos: number;
  alertasUrgentes: number;
  porSecretaria: SecretariaRow[];
  porPeriodicidade: PeriodicidadeRow[];
};

// ── helpers ──────────────────────────────────────────────────────────────────
function pct(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function ProgressBar({ value, total, color }: { value: number; total: number; color: string }) {
  const p = pct(value, total);
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--panel-border)]">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${p}%` }} />
    </div>
  );
}

// ── sub-componentes ───────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, icon: Icon, iconBg, iconColor, badge, badgeColor,
}: {
  label: string; value: number | string; sub?: string;
  icon: React.ElementType; iconBg: string; iconColor: string;
  badge?: string; badgeColor?: string;
}) {
  return (
    <Panel className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${iconBg}`}>
          <Icon className={`h-4.5 w-4.5 h-[18px] w-[18px] ${iconColor}`} />
        </div>
        {badge && (
          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${badgeColor}`}>{badge}</span>
        )}
      </div>
      <div>
        <div className="text-xs font-semibold text-[var(--text-muted)]">{label}</div>
        <div className="mt-0.5 text-2xl font-extrabold leading-none text-[var(--text)]">{value}</div>
        {sub && <div className="mt-1 text-[11px] text-[var(--text-muted)]">{sub}</div>}
      </div>
    </Panel>
  );
}

function AlertaBanner({ vencidos, urgentes, onNavigate }: { vencidos: number; urgentes: number; onNavigate: () => void }) {
  if (!vencidos && !urgentes) return null;
  return (
    <button
      onClick={onNavigate}
      className="flex w-full items-center gap-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-left transition-colors hover:bg-red-100"
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-red-100">
        <AlertTriangle className="h-5 w-5 text-red-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-red-700">Atenção: há critérios com pendências urgentes</p>
        <p className="mt-0.5 text-xs text-red-600">
          {vencidos > 0 && <><strong>{vencidos}</strong> vencido{vencidos !== 1 ? 's' : ''}</>}
          {vencidos > 0 && urgentes > 0 && ' · '}
          {urgentes > 0 && <><strong>{urgentes}</strong> vence{urgentes !== 1 ? 'm' : ''} em até 15 dias</>}
        </p>
      </div>
      <div className="flex items-center gap-1 text-xs font-semibold text-red-600">
        Ver alertas <ChevronRight className="h-4 w-4" />
      </div>
    </button>
  );
}

function SecretariaTable({ rows }: { rows: SecretariaRow[] }) {
  if (!rows.length) return (
    <div className="py-8 text-center text-sm text-[var(--text-muted)]">Nenhuma secretaria cadastrada.</div>
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--panel-border)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            <th className="pb-2 text-left">Secretaria</th>
            <th className="pb-2 text-right">Total</th>
            <th className="pb-2 text-right">Ativos</th>
            <th className="pb-2 text-right">Pendentes</th>
            <th className="pb-2 text-right">Vencidos</th>
            <th className="pb-2 pl-4 text-left">Conformidade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--panel-border)]">
          {rows.map((r) => {
            const conf = pct(r.ativos, r.total);
            const confColor = conf >= 80 ? 'text-emerald-600' : conf >= 50 ? 'text-amber-600' : 'text-red-600';
            return (
              <tr key={r.sigla} className="hover:bg-[var(--bg)]">
                <td className="py-2.5 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 min-w-[2.5rem] items-center justify-center rounded bg-[var(--primary-lighter)] px-1.5 text-[10px] font-bold text-[var(--primary)]">
                      {r.sigla}
                    </span>
                    <span className="font-medium text-[var(--text)]">{r.secretaria}</span>
                  </div>
                </td>
                <td className="py-2.5 text-right font-bold text-[var(--text)]">{r.total}</td>
                <td className="py-2.5 text-right text-emerald-600">{r.ativos}</td>
                <td className="py-2.5 text-right text-amber-600">{r.pendentes}</td>
                <td className="py-2.5 text-right text-red-600">{r.vencidos}</td>
                <td className="py-2.5 pl-4">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={r.ativos} total={r.total} color="bg-emerald-500" />
                    <span className={`w-8 text-right text-xs font-bold ${confColor}`}>{conf}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PeriodicidadeGrid({ rows }: { rows: PeriodicidadeRow[] }) {
  const total = rows.reduce((s, r) => s + r.total, 0);
  const COR: Record<string, string> = {
    Mensal: 'bg-sky-500', Bimestral: 'bg-violet-500', Trimestral: 'bg-emerald-500',
    Quadrimestral: 'bg-amber-500', Semestral: 'bg-orange-500', Anual: 'bg-rose-500',
  };
  return (
    <div className="grid grid-cols-2 gap-3">
      {rows.map((r) => (
        <div key={r.periodicidade} className="flex items-center gap-3 rounded-lg border border-[var(--panel-border)] bg-[var(--bg)] p-3">
          <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${COR[r.periodicidade] ?? 'bg-slate-400'}`} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-[var(--text-muted)]">{r.periodicidade}</p>
            <p className="text-base font-extrabold text-[var(--text)]">{r.total}</p>
          </div>
          <span className="text-xs font-semibold text-[var(--text-muted)]">{pct(r.total, total)}%</span>
        </div>
      ))}
    </div>
  );
}

// ── página principal ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [metricas, setMetricas] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiJson<{ metricas: Metrics }>('/api/dashboard')
      .then((d) => setMetricas(d.metricas ?? null))
      .catch(() => setMetricas(null))
      .finally(() => setLoading(false));
  }, []);

  const m = metricas;
  const total = m?.totalCriterios ?? 0;
  const ativos = m?.ativos ?? 0;
  const pctConf = pct(ativos, total);

  return (
    <div className="grid gap-6">
      {/* ── Cabeçalho ── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--text)]">Painel PNTP</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Programa Nacional de Transparência Pública · Prefeitura de Jardim/CE ·{' '}
            <span className="font-semibold text-[var(--primary)]">Ciclo {new Date().getFullYear()}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] px-4 py-2">
          <ShieldCheck className="h-5 w-5 text-[var(--primary)]" />
          <span className="text-sm font-bold text-[var(--text)]">
            {loading ? '…' : `${pctConf}% em conformidade`}
          </span>
        </div>
      </div>

      {/* ── Banner de alertas urgentes ── */}
      {!loading && ((m?.alertasVencidos ?? 0) + (m?.alertasUrgentes ?? 0) > 0) && (
        <AlertaBanner
          vencidos={m?.alertasVencidos ?? 0}
          urgentes={m?.alertasUrgentes ?? 0}
          onNavigate={() => navigate('/alertas')}
        />
      )}

      {/* ── Cards de métricas ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total de Critérios" value={loading ? '…' : total}
          sub="cadastrados no PNTP" icon={FileText}
          iconBg="bg-[var(--primary-lighter)]" iconColor="text-[var(--primary)]" />
        <StatCard label="Critérios Ativos" value={loading ? '…' : ativos}
          sub={`${pctConf}% do total`} icon={CheckCircle2}
          iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard label="Inativos" value={loading ? '…' : (m?.inativos ?? 0)}
          icon={Clock} iconBg="bg-slate-100" iconColor="text-slate-500" />
        <StatCard label="Pendentes" value={loading ? '…' : (m?.pendentes ?? 0)}
          icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600"
          badge={(m?.pendentes ?? 0) > 0 ? 'Atenção' : undefined}
          badgeColor="bg-amber-100 text-amber-700" />
        <StatCard label="Vencidos" value={loading ? '…' : (m?.vencidos ?? 0)}
          icon={AlertTriangle} iconBg="bg-red-50" iconColor="text-red-600"
          badge={(m?.vencidos ?? 0) > 0 ? 'Crítico' : undefined}
          badgeColor="bg-red-100 text-red-700" />
        <StatCard
          label="Alertas de Ciclo"
          value={loading ? '…' : ((m?.alertasVencidos ?? 0) + (m?.alertasUrgentes ?? 0))}
          sub={`${m?.alertasVencidos ?? 0} venc. · ${m?.alertasUrgentes ?? 0} urgentes`}
          icon={Bell} iconBg="bg-sky-50" iconColor="text-sky-600"
          badge={(m?.alertasVencidos ?? 0) + (m?.alertasUrgentes ?? 0) > 0 ? 'Ver' : undefined}
          badgeColor="bg-sky-100 text-sky-700" />
      </div>

      {/* ── Secretarias + Periodicidades ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--text)]">Critérios por Secretaria</h3>
          </div>
          {loading
            ? <div className="py-8 text-center text-sm text-[var(--text-muted)]">Carregando…</div>
            : <SecretariaTable rows={m?.porSecretaria ?? []} />}
        </Panel>

        <Panel>
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--text)]">Por Periodicidade</h3>
          </div>
          {loading
            ? <div className="py-8 text-center text-sm text-[var(--text-muted)]">Carregando…</div>
            : (m?.porPeriodicidade?.length
                ? <PeriodicidadeGrid rows={m.porPeriodicidade} />
                : <div className="py-8 text-center text-sm text-[var(--text-muted)]">Sem dados.</div>)}
        </Panel>
      </div>

      {/* ── Eixos temáticos do PNTP ── */}
      <Panel>
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--text)]">Eixos Temáticos — PNTP 2025</h3>
          </div>
          <span className="rounded-md bg-[var(--primary-lighter)] px-2 py-0.5 text-xs font-bold text-[var(--primary)]">
            Atricon · TCU · IRB
          </span>
        </div>
        <p className="mb-4 text-xs text-[var(--text-muted)]">
          O PNTP organiza os critérios de transparência em eixos temáticos conforme a Cartilha 2025.
          Os {total} critérios cadastrados cobrem os eixos abaixo.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {EIXOS_PNTP.map(({ id, label, icon: Icon, cor }) => (
            <div key={id} className="flex flex-col gap-2 rounded-xl border border-[var(--panel-border)] p-3">
              <div className={`grid h-8 w-8 place-items-center rounded-lg ${cor}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-xs font-semibold leading-tight text-[var(--text)]">{label}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* ── Rodapé informativo ── */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] px-5 py-3 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--primary)]" />
          <span>Programa Nacional de Transparência Pública</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 text-[var(--primary)]" />
          <span>Cartilha PNTP 2025 — Atricon · TCU · IRB · CNPTC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-[var(--primary)]" />
          <span>Avaliação periódica com Tribunais de Contas</span>
        </div>
      </div>
    </div>
  );
}
