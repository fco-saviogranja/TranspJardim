const crypto = require('node:crypto');
const { hashPassword } = require('../infra/password');

function nowIso() {
  return new Date().toISOString();
}

function toPublicUser(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    email: user.email,
    secretariaId: user.secretariaId ?? null,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

function normalizeStatus(value) {
  const raw = String(value ?? 'Ativo').trim().toLowerCase();
  if (raw === 'concluido' || raw === 'concluído') return 'Concluído';
  if (raw === 'pendente') return 'Pendente';
  if (raw === 'vencido') return 'Vencido';
  return 'Ativo';
}

function normalizePeriodicidade(value) {
  const options = ['Mensal', 'Bimestral', 'Semestral', 'Anual'];
  const normalized = String(value ?? 'Mensal').trim().toLowerCase();
  const found = options.find((opt) => opt.toLowerCase() === normalized);
  return found ?? 'Mensal';
}

function normalizeRole(value) {
  const role = String(value ?? 'padrao').trim().toLowerCase();
  return role || 'padrao';
}

async function createMemoryStore({ localUsers }) {
  const users = localUsers.map((entry) => ({
    id: entry.id,
    username: entry.username,
    role: normalizeRole(entry.role),
    name: entry.name,
    email: entry.email,
    passwordHash: hashPassword(entry.password),
    isActive: true,
    createdAt: nowIso(),
  }));

  const secretarias = [
    { id: 'sec-1', nome: 'Controladoria e Transparência Municipal', sigla: 'CONTROLADORIA', descricao: null, dataCriacao: '2026-02-16' },
    { id: 'sec-2', nome: 'Secretaria de Administração', sigla: 'SEMAD', descricao: null, dataCriacao: '2026-02-16' },
    { id: 'sec-3', nome: 'Secretaria de Educação', sigla: 'SEDUC', descricao: null, dataCriacao: '2026-02-16' },
    { id: 'sec-4', nome: 'Secretaria de Saúde', sigla: 'SESAU', descricao: null, dataCriacao: '2026-02-16' },
  ];

  const criterios = [
    {
      id: 'cri-001',
      nome: 'Taxa de Escolarização Infantil',
      status: 'Ativo',
      periodicidade: 'Bimestral',
      secretariaId: 'sec-3',
      secretaria: 'Secretaria de Educação',
      responsavel: 'João Silva',
      descricao: '',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];

  const alertas = [];

  const alertaRegras = [];

  const alertaConfig = {
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

  return {
    kind: 'memory',

    async listSecretarias() {
      return [...secretarias];
    },

    async createSecretaria(input) {
      const nome = String(input.nome ?? '').trim();
      const sigla = String(input.sigla ?? '').trim().toUpperCase();
      const descricao = String(input.descricao ?? '').trim() || null;

      if (!nome) throw Object.assign(new Error('Nome da secretaria é obrigatório.'), { statusCode: 400 });
      if (!sigla) throw Object.assign(new Error('Sigla da secretaria é obrigatória.'), { statusCode: 400 });
      if (secretarias.some((item) => item.sigla.toUpperCase() === sigla)) {
        throw Object.assign(new Error('Já existe uma secretaria com esta sigla.'), { statusCode: 409 });
      }

      const created = {
        id: `sec-${crypto.randomUUID()}`,
        nome,
        sigla,
        descricao,
        dataCriacao: new Date().toISOString().slice(0, 10),
      };

      secretarias.push(created);
      return created;
    },

    async updateSecretaria(id, input) {
      const idx = secretarias.findIndex((item) => item.id === id);
      if (idx === -1) return null;
      const existing = secretarias[idx];
      const next = {
        ...existing,
        nome: String(input.nome ?? existing.nome).trim() || existing.nome,
        sigla: String(input.sigla ?? existing.sigla).trim().toUpperCase() || existing.sigla,
        descricao:
          input.descricao === undefined
            ? existing.descricao
            : String(input.descricao ?? '').trim() || null,
      };

      if (secretarias.some((item, itemIdx) => itemIdx !== idx && item.sigla.toUpperCase() === next.sigla.toUpperCase())) {
        throw Object.assign(new Error('Já existe uma secretaria com esta sigla.'), { statusCode: 409 });
      }

      secretarias[idx] = next;
      for (const criterio of criterios) {
        if (criterio.secretariaId === id) criterio.secretaria = next.nome;
      }
      return next;
    },

    async deleteSecretaria(id) {
      if (criterios.some((item) => item.secretariaId === id)) {
        throw Object.assign(new Error('Não é possível excluir secretaria com critérios vinculados.'), { statusCode: 409 });
      }
      const idx = secretarias.findIndex((item) => item.id === id);
      if (idx === -1) return false;
      secretarias.splice(idx, 1);
      return true;
    },

    async listCriterios() {
      return [...criterios];
    },

    async createCriterio(input) {
      const nome = String(input.nome ?? '').trim();
      if (!nome) throw Object.assign(new Error('Nome do critério é obrigatório.'), { statusCode: 400 });

      const secretariaId = String(input.secretariaId ?? '').trim();
      const secretaria = secretarias.find((item) => item.id === secretariaId);

      const created = {
        id: `cri-${crypto.randomUUID()}`,
        nome,
        status: normalizeStatus(input.status),
        periodicidade: normalizePeriodicidade(input.periodicidade),
        secretariaId: secretaria?.id ?? null,
        secretaria: secretaria?.nome ?? String(input.secretaria ?? '').trim(),
        responsavel: String(input.responsavel ?? '').trim(),
        descricao: String(input.descricao ?? '').trim(),
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };

      criterios.unshift(created);
      return created;
    },

    async updateCriterio(id, input) {
      const idx = criterios.findIndex((item) => item.id === id);
      if (idx === -1) return null;
      const existing = criterios[idx];

      const secretariaId = input.secretariaId === undefined ? existing.secretariaId : String(input.secretariaId ?? '').trim();
      const secretaria = secretariaId ? secretarias.find((item) => item.id === secretariaId) : null;

      const next = {
        ...existing,
        nome: String(input.nome ?? existing.nome).trim() || existing.nome,
        status: input.status === undefined ? existing.status : normalizeStatus(input.status),
        periodicidade:
          input.periodicidade === undefined ? existing.periodicidade : normalizePeriodicidade(input.periodicidade),
        secretariaId: secretaria ? secretaria.id : null,
        secretaria: secretaria ? secretaria.nome : String(input.secretaria ?? existing.secretaria ?? '').trim(),
        responsavel: input.responsavel === undefined ? existing.responsavel : String(input.responsavel ?? '').trim(),
        descricao: input.descricao === undefined ? existing.descricao : String(input.descricao ?? '').trim(),
        updatedAt: nowIso(),
      };

      criterios[idx] = next;
      return next;
    },

    async deleteCriterio(id) {
      const idx = criterios.findIndex((item) => item.id === id);
      if (idx === -1) return false;
      criterios.splice(idx, 1);
      return true;
    },

    async listAlertas() {
      return [...alertas];
    },

    async markAlertaAsRead(id) {
      const idx = alertas.findIndex((item) => item.id === id);
      if (idx === -1) return null;
      alertas[idx] = { ...alertas[idx], lido: true };
      return alertas[idx];
    },

    // ── Regras de Alerta ─────────────────────────────────
    async listAlertaRegras() {
      return [...alertaRegras];
    },

    async createAlertaRegra(input) {
      const nome = String(input.nome ?? '').trim();
      if (!nome) throw Object.assign(new Error('Nome é obrigatório.'), { statusCode: 400 });
      const created = {
        id: `ar-${crypto.randomUUID()}`,
        nome,
        descricao: String(input.descricao ?? '').trim() || null,
        prioridade: String(input.prioridade ?? 'media').trim().toLowerCase(),
        ativo: input.ativo !== false,
        triggerTipo: String(input.triggerTipo ?? 'vencimento').trim().toLowerCase(),
        triggerDias: Number(input.triggerDias ?? 0),
        triggerMeta: input.triggerMeta != null ? Number(input.triggerMeta) : null,
        apenasDiasUteis: input.apenasDiasUteis !== false,
        canalDashboard: input.canalDashboard !== false,
        canalEmail: input.canalEmail !== false,
        dataCriacao: nowIso(),
      };
      alertaRegras.push(created);
      return created;
    },

    async updateAlertaRegra(id, input) {
      const idx = alertaRegras.findIndex((item) => item.id === id);
      if (idx === -1) return null;
      const existing = alertaRegras[idx];
      alertaRegras[idx] = {
        ...existing,
        nome: String(input.nome ?? existing.nome).trim() || existing.nome,
        descricao: input.descricao === undefined ? existing.descricao : String(input.descricao ?? '').trim() || null,
        prioridade: input.prioridade ?? existing.prioridade,
        ativo: input.ativo ?? existing.ativo,
        triggerTipo: input.triggerTipo ?? existing.triggerTipo,
        triggerDias: input.triggerDias ?? existing.triggerDias,
        triggerMeta: input.triggerMeta !== undefined ? input.triggerMeta : existing.triggerMeta,
        apenasDiasUteis: input.apenasDiasUteis ?? existing.apenasDiasUteis,
        canalDashboard: input.canalDashboard ?? existing.canalDashboard,
        canalEmail: input.canalEmail ?? existing.canalEmail,
      };
      return alertaRegras[idx];
    },

    async toggleAlertaRegra(id, ativo) {
      const idx = alertaRegras.findIndex((item) => item.id === id);
      if (idx === -1) return false;
      alertaRegras[idx] = { ...alertaRegras[idx], ativo };
      return true;
    },

    async deleteAlertaRegra(id) {
      const idx = alertaRegras.findIndex((item) => item.id === id);
      if (idx === -1) return false;
      alertaRegras.splice(idx, 1);
      return true;
    },

    // ── Configuração de Alertas ──────────────────────────
    async getAlertaConfig() {
      return { ...alertaConfig };
    },

    async updateAlertaConfig(input) {
      Object.assign(alertaConfig, {
        sistemaAtivo: input.sistemaAtivo !== false,
        maxAlertasDia: Number(input.maxAlertasDia ?? alertaConfig.maxAlertasDia),
        limpezaDias: Number(input.limpezaDias ?? alertaConfig.limpezaDias),
        apenasDiasUteis: input.apenasDiasUteis !== false,
        emailObrigatorio: input.emailObrigatorio !== false,
        modoDebug: input.modoDebug === true,
        notifDashboard: input.notifDashboard !== false,
        notifEmail: input.notifEmail === true,
        notifPush: input.notifPush === true,
        frequenciaNotif: String(input.frequenciaNotif ?? alertaConfig.frequenciaNotif),
        modoSilencioso: input.modoSilencioso === true,
      });
      return { ...alertaConfig };
    },

    async listUsuarios() {
      return users.map(toPublicUser);
    },

    async createUsuario(input) {
      const username = String(input.username ?? '').trim().toLowerCase();
      const name = String(input.name ?? '').trim();
      const email = String(input.email ?? '').trim().toLowerCase();
      const role = normalizeRole(input.role);

      if (!username || !name || !email) {
        throw Object.assign(new Error('username, name e email são obrigatórios.'), { statusCode: 400 });
      }

      if (users.some((user) => user.username === username || user.email === email)) {
        throw Object.assign(new Error('Usuário já existe.'), { statusCode: 409 });
      }

      const password = String(input.password ?? '').trim();
      const created = {
        id: `usr-${crypto.randomUUID()}`,
        username,
        role,
        name,
        email,
        passwordHash: password ? hashPassword(password) : null,
        secretariaId: input.secretariaId || null,
        isActive: true,
        createdAt: nowIso(),
      };
      users.push(created);
      return toPublicUser(created);
    },

    async updateUsuario(id, input) {
      const idx = users.findIndex((user) => user.id === id);
      if (idx === -1) return null;
      const existing = users[idx];
      const next = {
        ...existing,
        username: input.username === undefined ? existing.username : String(input.username ?? '').trim().toLowerCase() || existing.username,
        name: input.name === undefined ? existing.name : String(input.name ?? '').trim() || existing.name,
        email: input.email === undefined ? existing.email : String(input.email ?? '').trim().toLowerCase() || existing.email,
        role: input.role === undefined ? existing.role : normalizeRole(input.role),
        isActive: input.isActive === undefined ? existing.isActive : Boolean(input.isActive),
        secretariaId: input.secretariaId === undefined ? (existing.secretariaId ?? null) : (input.secretariaId || null),
      };
      if (input.password !== undefined && String(input.password ?? '').trim()) {
        next.passwordHash = hashPassword(String(input.password));
      }

      if (
        users.some(
          (user, userIdx) =>
            userIdx !== idx && (user.username === next.username || user.email === next.email)
        )
      ) {
        throw Object.assign(new Error('Username ou email já em uso.'), { statusCode: 409 });
      }

      users[idx] = next;
      return toPublicUser(next);
    },

    async deleteUsuario(id) {
      const idx = users.findIndex((user) => user.id === id);
      if (idx === -1) return false;
      users.splice(idx, 1);
      return true;
    },

    async findUserByUsername(username) {
      const value = String(username ?? '').trim().toLowerCase();
      return users.find((user) => user.username === value) ?? null;
    },

    async findUserByEmail(email) {
      const value = String(email ?? '').trim().toLowerCase();
      return users.find((user) => user.email === value) ?? null;
    },

    async findUserById(id) {
      return users.find((user) => user.id === id) ?? null;
    },

    async upsertUserFromIdentity(identity) {
      if (!identity || !identity.email) {
        return {
          id: identity.id,
          username: identity.username,
          role: identity.role,
          name: identity.name,
          email: identity.email,
          isActive: true,
          createdAt: nowIso(),
        };
      }

      const existing = users.find((user) => user.email === identity.email);
      if (existing) {
        existing.name = identity.name || existing.name;
        existing.username = identity.username || existing.username;
        const existingRole = String(existing.role ?? '').trim().toLowerCase() || 'padrao';
        const incomingRole = String(identity.role ?? '').trim().toLowerCase();
        if (existingRole !== 'admin' && incomingRole === 'admin') {
          existing.role = 'admin';
        }
        return toPublicUser(existing);
      }

      const created = {
        id: identity.id || `usr-${crypto.randomUUID()}`,
        username: identity.username,
        role: normalizeRole(identity.role),
        name: identity.name || identity.username,
        email: identity.email,
        passwordHash: null,
        isActive: true,
        createdAt: nowIso(),
      };
      users.push(created);
      return toPublicUser(created);
    },

    async getDashboardMetrics() {
      const statusCount = {
        concluido: 0,
        pendente: 0,
        vencido: 0,
      };
      for (const criterio of criterios) {
        const st = String(criterio.status ?? '').trim().toLowerCase();
        if (st === 'concluído' || st === 'concluido') statusCount.concluido += 1;
        if (st === 'pendente') statusCount.pendente += 1;
        if (st === 'vencido') statusCount.vencido += 1;
      }

      return {
        totalCriterios: criterios.length,
        criteriosConcluidos: statusCount.concluido,
        pendentes: statusCount.pendente,
        vencidos: statusCount.vencido,
        alertasAtivos: alertas.filter((item) => !item.lido).length,
      };
    },

    async getAdminOverview() {
      return {
        usuariosAtivos: users.filter((user) => user.isActive).length,
        criteriosCadastrados: criterios.length,
        alertasAtivos: alertas.filter((item) => !item.lido).length,
        secretarias: secretarias.length,
      };
    },

    async listRelatorios() {
      const bySecretaria = new Map();
      for (const criterio of criterios) {
        const key = criterio.secretaria || 'Sem secretaria';
        if (!bySecretaria.has(key)) {
          bySecretaria.set(key, { secretaria: key, total: 0, concluidos: 0, pendentes: 0, vencidos: 0 });
        }
        const bucket = bySecretaria.get(key);
        bucket.total += 1;
        const st = String(criterio.status ?? '').toLowerCase();
        if (st === 'concluído' || st === 'concluido') bucket.concluidos += 1;
        if (st === 'pendente') bucket.pendentes += 1;
        if (st === 'vencido') bucket.vencidos += 1;
      }

      return {
        porSecretaria: Array.from(bySecretaria.values()).sort((a, b) => a.secretaria.localeCompare(b.secretaria, 'pt-BR')),
      };
    },
  };
}

module.exports = {
  createMemoryStore,
};
