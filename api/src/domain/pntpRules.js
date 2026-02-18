function normalizePeriodicidade(value) {
  const options = ['Mensal', 'Bimestral', 'Trimestral', 'Quadrimestral', 'Semestral', 'Anual'];
  const normalized = String(value ?? 'Mensal').trim().toLowerCase();
  const found = options.find((opt) => opt.toLowerCase() === normalized);
  return found ?? 'Mensal';
}

const PERIODICIDADE_BY_PREFIX = {
  '1.1': 'Anual', '1.2': 'Anual', '1.3': 'Anual', '1.4': 'Anual',
  '2.1': 'Mensal', '2.2': 'Anual', '2.3': 'Mensal', '2.4': 'Anual', '2.5': 'Anual', '2.6': 'Anual', '2.7': 'Anual', '2.8': 'Anual', '2.9': 'Anual',
  '3.1': 'Mensal', '3.2': 'Mensal', '3.3': 'Anual',
  '4.1': 'Mensal', '4.2': 'Mensal', '4.3': 'Mensal', '4.4': 'Mensal', '4.5': 'Anual', '4.6': 'Anual',
  '5.1': 'Mensal', '5.2': 'Mensal', '5.3': 'Anual',
  '6.1': 'Mensal', '6.2': 'Mensal', '6.3': 'Semestral', '6.4': 'Mensal', '6.5': 'Anual', '6.6': 'Anual',
  '7.1': 'Mensal', '7.2': 'Anual',
  '8.1': 'Mensal', '8.2': 'Mensal', '8.3': 'Mensal', '8.4': 'Mensal', '8.5': 'Mensal', '8.6': 'Anual', '8.7': 'Mensal', '8.8': 'Anual',
  '9.1': 'Mensal', '9.2': 'Mensal', '9.3': 'Mensal', '9.4': 'Mensal',
  '10.1': 'Mensal', '10.2': 'Mensal', '10.3': 'Mensal', '10.4': 'Mensal',
  '11.1': 'Anual', '11.2': 'Anual', '11.3': 'Anual', '11.4': 'Anual', '11.5': 'Quadrimestral', '11.6': 'Bimestral', '11.7': 'Anual', '11.8': 'Anual', '11.9': 'Anual', '11.10': 'Anual', '11.11': 'Trimestral', '11.12': 'Anual',
  '12.1': 'Anual', '12.2': 'Anual', '12.3': 'Anual', '12.4': 'Anual', '12.5': 'Anual', '12.6': 'Anual', '12.7': 'Anual', '12.8': 'Mensal', '12.9': 'Anual',
  '13.1': 'Anual', '13.2': 'Anual', '13.3': 'Anual', '13.4': 'Anual', '13.5': 'Anual',
  '14.1': 'Anual', '14.2': 'Anual', '14.3': 'Anual',
  '15.1': 'Anual', '15.2': 'Anual', '15.3': 'Anual', '15.4': 'Anual', '15.5': 'Anual', '15.6': 'Semestral',
  '16.1': 'Anual', '16.2': 'Anual', '16.3': 'Anual', '16.4': 'Anual',
  '17.1': 'Mensal', '17.2': 'Mensal',
  '18.1': 'Anual', '18.2': 'Mensal', '18.3': 'Mensal', '18.4': 'Mensal', '18.5': 'Mensal',
  '19.1': 'Anual', '19.2': 'Mensal',
};

function extractCriterioPrefix(nome) {
  const match = String(nome ?? '').trim().match(/^(\d{1,2}\.\d{1,2})\b/);
  return match ? match[1] : null;
}

function inferPeriodicidadeFromNome(nome) {
  const prefix = extractCriterioPrefix(nome);
  if (!prefix) return null;
  return PERIODICIDADE_BY_PREFIX[prefix] ?? null;
}

function addMonths(date, months) {
  const d = new Date(date);
  const target = new Date(Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth() + months,
    d.getUTCDate(),
    0,
    0,
    0,
    0,
  ));
  return target;
}

function calculateSlaDeadline(periodicidade, ultimaAtualizacao) {
  const normalized = normalizePeriodicidade(periodicidade);
  const base = new Date(ultimaAtualizacao ?? Date.now());
  if (Number.isNaN(base.getTime())) return addMonths(new Date(), 1);

  switch (normalized) {
    case 'Mensal': return addMonths(base, 1);
    case 'Bimestral': return addMonths(base, 2);
    case 'Trimestral': return addMonths(base, 3);
    case 'Quadrimestral': return addMonths(base, 4);
    case 'Semestral': return addMonths(base, 6);
    default: return addMonths(base, 12);
  }
}

function calculateSlaPriority(periodicidade, ultimaAtualizacao, refDate = new Date()) {
  const today = new Date(refDate);
  today.setUTCHours(0, 0, 0, 0);
  const deadline = calculateSlaDeadline(periodicidade, ultimaAtualizacao);
  deadline.setUTCHours(0, 0, 0, 0);

  const diffMs = deadline.getTime() - today.getTime();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let prioridade = 'normal';
  if (diffDias < 0) prioridade = 'vencido';
  else if (diffDias <= 15) prioridade = 'urgente';

  return { deadline, diffDias, prioridade };
}

module.exports = {
  normalizePeriodicidade,
  inferPeriodicidadeFromNome,
  calculateSlaPriority,
};
