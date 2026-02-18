const { hashPassword } = require('../infra/password');

function normalizeRole(value) {
  const role = String(value ?? 'padrao').trim().toLowerCase();
  return role || 'padrao';
}

function normalizeStatus(value) {
  const raw = String(value ?? 'Ativo').trim().toLowerCase();
  if (raw === 'concluido' || raw === 'concluído') return 'Concluído';
  if (raw === 'pendente') return 'Pendente';
  if (raw === 'vencido') return 'Vencido';
  return 'Ativo';
}

function normalizePeriodicidade(value) {
  const options = ['Mensal', 'Bimestral', 'Trimestral', 'Quadrimestral', 'Semestral', 'Anual'];
  const normalized = String(value ?? 'Mensal').trim().toLowerCase();
  const found = options.find((opt) => opt.toLowerCase() === normalized);
  return found ?? 'Mensal';
}

// Retorna a data limite do ciclo atual para uma dada periodicidade
function calcularVencimentoCiclo(periodicidade, ref) {
  const d = new Date(ref);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth(); // 0-based
  switch (periodicidade) {
    case 'Mensal':
      return new Date(Date.UTC(y, m + 1, 0)); // último dia do mês
    case 'Bimestral': {
      const endMonth = Math.ceil((m + 1) / 2) * 2; // 2,4,6,8,10,12
      return new Date(Date.UTC(y, endMonth, 0));
    }
    case 'Trimestral': {
      const endMonth = Math.ceil((m + 1) / 3) * 3;
      return new Date(Date.UTC(y, endMonth, 0));
    }
    case 'Quadrimestral': {
      const endMonth = Math.ceil((m + 1) / 4) * 4;
      return new Date(Date.UTC(y, endMonth, 0));
    }
    case 'Semestral': {
      const endMonth = Math.ceil((m + 1) / 6) * 6;
      return new Date(Date.UTC(y, endMonth, 0));
    }
    default: // Anual
      return new Date(Date.UTC(y, 11, 31));
  }
}

// Retorna a string identificadora do ciclo atual (ex: "2026-02", "2026-B1")
function calcularCicloRef(periodicidade, ref) {
  const d = new Date(ref);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1; // 1-based
  switch (periodicidade) {
    case 'Mensal':      return `${y}-${String(m).padStart(2, '0')}`;
    case 'Bimestral':   return `${y}-B${Math.ceil(m / 2)}`;
    case 'Trimestral':  return `${y}-T${Math.ceil(m / 3)}`;
    case 'Quadrimestral': return `${y}-Q${Math.ceil(m / 4)}`;
    case 'Semestral':   return `${y}-S${Math.ceil(m / 6)}`;
    default:            return String(y);
  }
}

function toPublicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    name: row.name,
    email: row.email,
    phone: row.phone ?? null,
    secretariaId: row.secretariaId ?? null,
    isActive: row.isActive,
    createdAt: row.createdAt,
  };
}

async function createSqlStore({ sqlClient, localUsers }) {
  const { sql } = sqlClient;

  async function query(configureRequest, statement) {
    const pool = await sqlClient.getPool();
    const req = pool.request();
    if (typeof configureRequest === 'function') configureRequest(req);
    return req.query(statement);
  }

  async function ensureSchema() {
    await query(null, `
      IF OBJECT_ID('dbo.Users', 'U') IS NULL
      BEGIN
        CREATE TABLE dbo.Users (
          Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Users PRIMARY KEY DEFAULT NEWID(),
          Username NVARCHAR(120) NOT NULL CONSTRAINT UQ_Users_Username UNIQUE,
          [Role] NVARCHAR(40) NOT NULL CONSTRAINT DF_Users_Role DEFAULT 'padrao',
          [Name] NVARCHAR(200) NOT NULL,
          Email NVARCHAR(200) NOT NULL CONSTRAINT UQ_Users_Email UNIQUE,
          PasswordHash NVARCHAR(255) NULL,
          SecretariaId UNIQUEIDENTIFIER NULL,
          IsActive BIT NOT NULL CONSTRAINT DF_Users_IsActive DEFAULT 1,
          CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSUTCDATETIME()
        );
      END;

      -- Add SecretariaId column to existing tables that lack it
      IF COL_LENGTH('dbo.Users', 'SecretariaId') IS NULL
      BEGIN
        ALTER TABLE dbo.Users ADD SecretariaId UNIQUEIDENTIFIER NULL;
      END;

      -- Add Phone column to existing tables that lack it
      IF COL_LENGTH('dbo.Users', 'Phone') IS NULL
      BEGIN
        ALTER TABLE dbo.Users ADD Phone NVARCHAR(30) NULL;
      END;

      IF OBJECT_ID('dbo.Secretarias', 'U') IS NULL
      BEGIN
        CREATE TABLE dbo.Secretarias (
          Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Secretarias PRIMARY KEY DEFAULT NEWID(),
          Nome NVARCHAR(200) NOT NULL,
          Sigla NVARCHAR(30) NOT NULL CONSTRAINT UQ_Secretarias_Sigla UNIQUE,
          Descricao NVARCHAR(500) NULL,
          CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Secretarias_CreatedAt DEFAULT SYSUTCDATETIME()
        );
      END;

      IF OBJECT_ID('dbo.Criterios', 'U') IS NULL
      BEGIN
        CREATE TABLE dbo.Criterios (
          Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Criterios PRIMARY KEY DEFAULT NEWID(),
          Nome NVARCHAR(200) NOT NULL,
          Status NVARCHAR(30) NOT NULL CONSTRAINT DF_Criterios_Status DEFAULT 'Ativo',
          Periodicidade NVARCHAR(30) NOT NULL CONSTRAINT DF_Criterios_Periodicidade DEFAULT 'Mensal',
          SecretariaId UNIQUEIDENTIFIER NULL,
          Responsavel NVARCHAR(200) NULL,
          Descricao NVARCHAR(MAX) NULL,
          CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Criterios_CreatedAt DEFAULT SYSUTCDATETIME(),
          UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_Criterios_UpdatedAt DEFAULT SYSUTCDATETIME(),
          CONSTRAINT FK_Criterios_Secretarias FOREIGN KEY (SecretariaId) REFERENCES dbo.Secretarias (Id)
        );
      END;

      IF OBJECT_ID('dbo.Alertas', 'U') IS NULL
      BEGIN
        CREATE TABLE dbo.Alertas (
          Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Alertas PRIMARY KEY DEFAULT NEWID(),
          Tipo NVARCHAR(80) NOT NULL CONSTRAINT DF_Alertas_Tipo DEFAULT 'sistema',
          Mensagem NVARCHAR(500) NOT NULL,
          Prioridade NVARCHAR(20) NOT NULL CONSTRAINT DF_Alertas_Prioridade DEFAULT 'baixa',
          Lido BIT NOT NULL CONSTRAINT DF_Alertas_Lido DEFAULT 0,
          CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Alertas_CreatedAt DEFAULT SYSUTCDATETIME()
        );
      END;

      IF OBJECT_ID('dbo.AlertaRegras', 'U') IS NULL
      BEGIN
        CREATE TABLE dbo.AlertaRegras (
          Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_AlertaRegras PRIMARY KEY DEFAULT NEWID(),
          Nome NVARCHAR(200) NOT NULL,
          Descricao NVARCHAR(500) NULL,
          Prioridade NVARCHAR(20) NOT NULL CONSTRAINT DF_AlertaRegras_Prioridade DEFAULT 'media',
          Ativo BIT NOT NULL CONSTRAINT DF_AlertaRegras_Ativo DEFAULT 1,
          TriggerTipo NVARCHAR(80) NOT NULL CONSTRAINT DF_AlertaRegras_TriggerTipo DEFAULT 'vencimento',
          TriggerDias INT NOT NULL CONSTRAINT DF_AlertaRegras_TriggerDias DEFAULT 0,
          TriggerMeta INT NULL,
          ApenasDiasUteis BIT NOT NULL CONSTRAINT DF_AlertaRegras_ApenasDiasUteis DEFAULT 1,
          CanalDashboard BIT NOT NULL CONSTRAINT DF_AlertaRegras_CanalDashboard DEFAULT 1,
          CanalEmail BIT NOT NULL CONSTRAINT DF_AlertaRegras_CanalEmail DEFAULT 1,
          CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_AlertaRegras_CreatedAt DEFAULT SYSUTCDATETIME()
        );
      END;

      IF OBJECT_ID('dbo.AlertaConfig', 'U') IS NULL
      BEGIN
        CREATE TABLE dbo.AlertaConfig (
          Id INT NOT NULL CONSTRAINT PK_AlertaConfig PRIMARY KEY DEFAULT 1,
          SistemaAtivo BIT NOT NULL CONSTRAINT DF_AlertaConfig_SistemaAtivo DEFAULT 1,
          MaxAlertasDia INT NOT NULL CONSTRAINT DF_AlertaConfig_MaxAlertasDia DEFAULT 50,
          LimpezaDias INT NOT NULL CONSTRAINT DF_AlertaConfig_LimpezaDias DEFAULT 30,
          ApenasDiasUteis BIT NOT NULL CONSTRAINT DF_AlertaConfig_ApenasDiasUteis DEFAULT 1,
          EmailObrigatorio BIT NOT NULL CONSTRAINT DF_AlertaConfig_EmailObrigatorio DEFAULT 1,
          ModoDebug BIT NOT NULL CONSTRAINT DF_AlertaConfig_ModoDebug DEFAULT 0,
          NotifDashboard BIT NOT NULL CONSTRAINT DF_AlertaConfig_NotifDashboard DEFAULT 1,
          NotifEmail BIT NOT NULL CONSTRAINT DF_AlertaConfig_NotifEmail DEFAULT 0,
          NotifPush BIT NOT NULL CONSTRAINT DF_AlertaConfig_NotifPush DEFAULT 0,
          FrequenciaNotif NVARCHAR(30) NOT NULL CONSTRAINT DF_AlertaConfig_FrequenciaNotif DEFAULT 'imediato',
          ModoSilencioso BIT NOT NULL CONSTRAINT DF_AlertaConfig_ModoSilencioso DEFAULT 0,
          CONSTRAINT CK_AlertaConfig_Single CHECK (Id = 1)
        );
        INSERT INTO dbo.AlertaConfig (Id) VALUES (1);
      END;

      IF OBJECT_ID('dbo.AlertasSituacao', 'U') IS NULL
      BEGIN
        CREATE TABLE dbo.AlertasSituacao (
          Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_AlertasSituacao PRIMARY KEY DEFAULT NEWID(),
          CriterioId UNIQUEIDENTIFIER NOT NULL,
          CicloRef NVARCHAR(20) NOT NULL,
          Situacao NVARCHAR(20) NOT NULL CONSTRAINT DF_AlertasSituacao_Situacao DEFAULT 'pendente',
          Observacao NVARCHAR(500) NULL,
          AtualizadoPor NVARCHAR(200) NULL,
          UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_AlertasSituacao_UpdatedAt DEFAULT SYSUTCDATETIME(),
          CONSTRAINT FK_AlertasSituacao_Criterios FOREIGN KEY (CriterioId) REFERENCES dbo.Criterios (Id) ON DELETE CASCADE,
          CONSTRAINT UQ_AlertasSituacao_Criterio_Ciclo UNIQUE (CriterioId, CicloRef)
        );
      END;
    `);

    const usersCount = await query(null, 'SELECT COUNT(1) AS total FROM dbo.Users;');
    const totalUsers = Number(usersCount.recordset[0]?.total ?? 0);
    if (totalUsers === 0 && localUsers.length) {
      for (const user of localUsers) {
        const passwordHash = hashPassword(user.password);
        await query((req) => {
          req.input('username', sql.NVarChar(120), user.username);
          req.input('role', sql.NVarChar(40), normalizeRole(user.role));
          req.input('name', sql.NVarChar(200), user.name);
          req.input('email', sql.NVarChar(200), user.email);
          req.input('passwordHash', sql.NVarChar(255), passwordHash);
        }, `
          INSERT INTO dbo.Users (Username, [Role], [Name], Email, PasswordHash)
          VALUES (@username, @role, @name, @email, @passwordHash);
        `);
      }
    }

    const secretariasCount = await query(null, 'SELECT COUNT(1) AS total FROM dbo.Secretarias;');
    const totalSecretarias = Number(secretariasCount.recordset[0]?.total ?? 0);
    if (totalSecretarias === 0) {
      const seeds = [
        ['Controladoria e Transparência Municipal', 'CONTROLADORIA'],
        ['Secretaria de Administração', 'SEMAD'],
        ['Secretaria de Educação', 'SEDUC'],
        ['Secretaria de Saúde', 'SESAU'],
      ];

      for (const [nome, sigla] of seeds) {
        await query((req) => {
          req.input('nome', sql.NVarChar(200), nome);
          req.input('sigla', sql.NVarChar(30), sigla);
        }, `
          INSERT INTO dbo.Secretarias (Nome, Sigla)
          VALUES (@nome, @sigla);
        `);
      }
    }

    const criteriosCount = await query(null, 'SELECT COUNT(1) AS total FROM dbo.Criterios;');
    const totalCriterios = Number(criteriosCount.recordset[0]?.total ?? 0);
    if (totalCriterios === 0) {
      await query(null, `
        DECLARE @secId UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM dbo.Secretarias WHERE Sigla = 'SEDUC');
        INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
        VALUES ('Taxa de Escolarização Infantil', 'Ativo', 'Bimestral', @secId, 'João Silva', '');
      `);
    }
  }

  await ensureSchema();

  return {
    kind: 'sql',

    async listSecretarias() {
      const result = await query(null, `
        SELECT
          CAST(Id AS NVARCHAR(36)) AS id,
          Nome AS nome,
          Sigla AS sigla,
          Descricao AS descricao,
          CONVERT(VARCHAR(10), CAST(CreatedAt AS DATE), 23) AS dataCriacao
        FROM dbo.Secretarias
        ORDER BY Nome ASC;
      `);
      return result.recordset;
    },

    async createSecretaria(input) {
      const nome = String(input.nome ?? '').trim();
      const sigla = String(input.sigla ?? '').trim().toUpperCase();
      const descricao = String(input.descricao ?? '').trim() || null;
      if (!nome) throw Object.assign(new Error('Nome da secretaria é obrigatório.'), { statusCode: 400 });
      if (!sigla) throw Object.assign(new Error('Sigla da secretaria é obrigatória.'), { statusCode: 400 });

      try {
        const result = await query((req) => {
          req.input('nome', sql.NVarChar(200), nome);
          req.input('sigla', sql.NVarChar(30), sigla);
          req.input('descricao', sql.NVarChar(500), descricao);
        }, `
          INSERT INTO dbo.Secretarias (Nome, Sigla, Descricao)
          OUTPUT
            CAST(INSERTED.Id AS NVARCHAR(36)) AS id,
            INSERTED.Nome AS nome,
            INSERTED.Sigla AS sigla,
            INSERTED.Descricao AS descricao,
            CONVERT(VARCHAR(10), CAST(INSERTED.CreatedAt AS DATE), 23) AS dataCriacao
          VALUES (@nome, @sigla, @descricao);
        `);

        return result.recordset[0];
      } catch (err) {
        if (String(err?.message ?? '').includes('UQ_Secretarias_Sigla')) {
          throw Object.assign(new Error('Já existe uma secretaria com esta sigla.'), { statusCode: 409 });
        }
        throw err;
      }
    },

    async updateSecretaria(id, input) {
      const updates = [];
      const nome = input.nome === undefined ? null : String(input.nome ?? '').trim();
      const sigla = input.sigla === undefined ? null : String(input.sigla ?? '').trim().toUpperCase();
      const descricao =
        input.descricao === undefined ? undefined : String(input.descricao ?? '').trim() || null;

      if (nome !== null) updates.push('Nome = @nome');
      if (sigla !== null) updates.push('Sigla = @sigla');
      if (descricao !== undefined) updates.push('Descricao = @descricao');
      if (!updates.length) return this.findSecretariaById(id);

      try {
        const result = await query((req) => {
          req.input('id', sql.UniqueIdentifier, id);
          if (nome !== null) req.input('nome', sql.NVarChar(200), nome);
          if (sigla !== null) req.input('sigla', sql.NVarChar(30), sigla);
          if (descricao !== undefined) req.input('descricao', sql.NVarChar(500), descricao);
        }, `
          UPDATE dbo.Secretarias
          SET ${updates.join(', ')}
          WHERE Id = @id;

          SELECT
            CAST(Id AS NVARCHAR(36)) AS id,
            Nome AS nome,
            Sigla AS sigla,
            Descricao AS descricao,
            CONVERT(VARCHAR(10), CAST(CreatedAt AS DATE), 23) AS dataCriacao
          FROM dbo.Secretarias
          WHERE Id = @id;
        `);

        return result.recordset[0] ?? null;
      } catch (err) {
        if (String(err?.message ?? '').includes('UQ_Secretarias_Sigla')) {
          throw Object.assign(new Error('Já existe uma secretaria com esta sigla.'), { statusCode: 409 });
        }
        throw err;
      }
    },

    async findSecretariaById(id) {
      const result = await query((req) => req.input('id', sql.UniqueIdentifier, id), `
        SELECT
          CAST(Id AS NVARCHAR(36)) AS id,
          Nome AS nome,
          Sigla AS sigla,
          Descricao AS descricao,
          CONVERT(VARCHAR(10), CAST(CreatedAt AS DATE), 23) AS dataCriacao
        FROM dbo.Secretarias
        WHERE Id = @id;
      `);
      return result.recordset[0] ?? null;
    },

    async deleteSecretaria(id) {
      const dependency = await query((req) => req.input('id', sql.UniqueIdentifier, id), `
        SELECT COUNT(1) AS total
        FROM dbo.Criterios
        WHERE SecretariaId = @id;
      `);
      const total = Number(dependency.recordset[0]?.total ?? 0);
      if (total > 0) {
        throw Object.assign(new Error('Não é possível excluir secretaria com critérios vinculados.'), { statusCode: 409 });
      }

      const result = await query((req) => req.input('id', sql.UniqueIdentifier, id), `
        DELETE FROM dbo.Secretarias WHERE Id = @id;
        SELECT @@ROWCOUNT AS affected;
      `);
      return Number(result.recordset[0]?.affected ?? 0) > 0;
    },

    async listCriterios() {
      const result = await query(null, `
        SELECT
          CAST(c.Id AS NVARCHAR(36)) AS id,
          c.Nome AS nome,
          c.Status AS status,
          c.Periodicidade AS periodicidade,
          CAST(c.SecretariaId AS NVARCHAR(36)) AS secretariaId,
          s.Nome AS secretaria,
          c.Responsavel AS responsavel,
          c.Descricao AS descricao,
          CONVERT(VARCHAR(33), c.CreatedAt, 126) AS createdAt,
          CONVERT(VARCHAR(33), c.UpdatedAt, 126) AS updatedAt
        FROM dbo.Criterios c
        LEFT JOIN dbo.Secretarias s ON s.Id = c.SecretariaId
        ORDER BY c.UpdatedAt DESC;
      `);
      return result.recordset;
    },

    async createCriterio(input) {
      const nome = String(input.nome ?? '').trim();
      if (!nome) throw Object.assign(new Error('Nome do critério é obrigatório.'), { statusCode: 400 });

      const secretariaId = String(input.secretariaId ?? '').trim();
      const result = await query((req) => {
        req.input('nome', sql.NVarChar(200), nome);
        req.input('status', sql.NVarChar(30), normalizeStatus(input.status));
        req.input('periodicidade', sql.NVarChar(30), normalizePeriodicidade(input.periodicidade));
        req.input('secretariaId', sql.UniqueIdentifier, secretariaId || null);
        req.input('responsavel', sql.NVarChar(200), String(input.responsavel ?? '').trim() || null);
        req.input('descricao', sql.NVarChar(sql.MAX), String(input.descricao ?? '').trim() || null);
      }, `
        INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
        OUTPUT CAST(INSERTED.Id AS NVARCHAR(36)) AS id
        VALUES (@nome, @status, @periodicidade, @secretariaId, @responsavel, @descricao);
      `);

      return this.findCriterioById(result.recordset[0].id);
    },

    async findCriterioById(id) {
      const result = await query((req) => req.input('id', sql.UniqueIdentifier, id), `
        SELECT
          CAST(c.Id AS NVARCHAR(36)) AS id,
          c.Nome AS nome,
          c.Status AS status,
          c.Periodicidade AS periodicidade,
          CAST(c.SecretariaId AS NVARCHAR(36)) AS secretariaId,
          s.Nome AS secretaria,
          c.Responsavel AS responsavel,
          c.Descricao AS descricao,
          CONVERT(VARCHAR(33), c.CreatedAt, 126) AS createdAt,
          CONVERT(VARCHAR(33), c.UpdatedAt, 126) AS updatedAt
        FROM dbo.Criterios c
        LEFT JOIN dbo.Secretarias s ON s.Id = c.SecretariaId
        WHERE c.Id = @id;
      `);
      return result.recordset[0] ?? null;
    },

    async updateCriterio(id, input) {
      const updates = [];
      if (input.nome !== undefined) updates.push('Nome = @nome');
      if (input.status !== undefined) updates.push('Status = @status');
      if (input.periodicidade !== undefined) updates.push('Periodicidade = @periodicidade');
      if (input.secretariaId !== undefined) updates.push('SecretariaId = @secretariaId');
      if (input.responsavel !== undefined) updates.push('Responsavel = @responsavel');
      if (input.descricao !== undefined) updates.push('Descricao = @descricao');
      updates.push('UpdatedAt = SYSUTCDATETIME()');

      const result = await query((req) => {
        req.input('id', sql.UniqueIdentifier, id);
        if (input.nome !== undefined) req.input('nome', sql.NVarChar(200), String(input.nome ?? '').trim());
        if (input.status !== undefined) req.input('status', sql.NVarChar(30), normalizeStatus(input.status));
        if (input.periodicidade !== undefined) {
          req.input('periodicidade', sql.NVarChar(30), normalizePeriodicidade(input.periodicidade));
        }
        if (input.secretariaId !== undefined) {
          req.input('secretariaId', sql.UniqueIdentifier, String(input.secretariaId ?? '').trim() || null);
        }
        if (input.responsavel !== undefined) {
          req.input('responsavel', sql.NVarChar(200), String(input.responsavel ?? '').trim() || null);
        }
        if (input.descricao !== undefined) {
          req.input('descricao', sql.NVarChar(sql.MAX), String(input.descricao ?? '').trim() || null);
        }
      }, `
        UPDATE dbo.Criterios
        SET ${updates.join(', ')}
        WHERE Id = @id;

        SELECT @@ROWCOUNT AS affected;
      `);

      const affected = Number(result.recordset[0]?.affected ?? 0);
      if (affected === 0) return null;
      return this.findCriterioById(id);
    },

    async deleteCriterio(id) {
      const result = await query((req) => req.input('id', sql.UniqueIdentifier, id), `
        DELETE FROM dbo.Criterios WHERE Id = @id;
        SELECT @@ROWCOUNT AS affected;
      `);
      return Number(result.recordset[0]?.affected ?? 0) > 0;
    },

    // ── Alertas por Critério (vencidos + próximos 15 dias) ─
    async listAlertasCriterios() {
      // Calcula cicloRef: prefixo YYYY-MM para o ciclo atual com base na periodicidade
      const result = await query(null, `
        SELECT
          CAST(c.Id AS NVARCHAR(36)) AS criterioId,
          c.Nome AS nome,
          c.Periodicidade AS periodicidade,
          c.Responsavel AS responsavel,
          CAST(s.Id AS NVARCHAR(36)) AS secretariaId,
          s.Nome AS secretariaNome,
          CONVERT(VARCHAR(33), c.UpdatedAt, 126) AS ultimaAtualizacao,
          ISNULL(sa.Situacao, 'pendente') AS situacao,
          sa.Observacao AS observacao,
          sa.AtualizadoPor AS atualizadoPor,
          ISNULL(CAST(sa.Id AS NVARCHAR(36)), '') AS situacaoId,
          sa.CicloRef AS cicloRef
        FROM dbo.Criterios c
        LEFT JOIN dbo.Secretarias s ON c.SecretariaId = s.Id
        LEFT JOIN dbo.AlertasSituacao sa
          ON sa.CriterioId = c.Id
          AND sa.CicloRef = (
            CASE c.Periodicidade
              WHEN 'Mensal'       THEN FORMAT(GETUTCDATE(), 'yyyy-MM')
              WHEN 'Bimestral'    THEN CAST(YEAR(GETUTCDATE()) AS NVARCHAR(4)) + '-B' + CAST(CEILING(MONTH(GETUTCDATE()) / 2.0) AS NVARCHAR(2))
              WHEN 'Trimestral'   THEN CAST(YEAR(GETUTCDATE()) AS NVARCHAR(4)) + '-T' + CAST(CEILING(MONTH(GETUTCDATE()) / 3.0) AS NVARCHAR(2))
              WHEN 'Quadrimestral' THEN CAST(YEAR(GETUTCDATE()) AS NVARCHAR(4)) + '-Q' + CAST(CEILING(MONTH(GETUTCDATE()) / 4.0) AS NVARCHAR(2))
              WHEN 'Semestral'    THEN CAST(YEAR(GETUTCDATE()) AS NVARCHAR(4)) + '-S' + CAST(CEILING(MONTH(GETUTCDATE()) / 6.0) AS NVARCHAR(2))
              ELSE CAST(YEAR(GETUTCDATE()) AS NVARCHAR(4))
            END
          )
        WHERE c.Status = 'Ativo'
        ORDER BY s.Nome ASC, c.Nome ASC;
      `);

      const hoje = new Date();
      hoje.setUTCHours(0, 0, 0, 0);

      return result.recordset.map((row) => {
        // Calcula data de vencimento do ciclo atual
        const vencimento = calcularVencimentoCiclo(row.periodicidade, hoje);
        const diffMs = vencimento.getTime() - hoje.getTime();
        const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const cicloRef = calcularCicloRef(row.periodicidade, hoje);

        let prioridade = 'normal';
        if (diffDias < 0) prioridade = 'vencido';
        else if (diffDias <= 15) prioridade = 'urgente';

        return {
          ...row,
          cicloRef: row.cicloRef || cicloRef,
          vencimento: vencimento.toISOString().slice(0, 10),
          diasRestantes: diffDias,
          prioridade,
        };
      }).filter((r) => r.prioridade !== 'normal' || r.situacao !== 'ok');
    },

    async upsertAlertaSituacao({ criterioId, cicloRef, situacao, observacao, atualizadoPor }) {
      const sits = ['pendente', 'ok', 'em_producao'];
      const sit = sits.includes(situacao) ? situacao : 'pendente';

      // Tenta atualizar primeiro
      const upd = await query((req) => {
        req.input('criterioId', sql.UniqueIdentifier, criterioId);
        req.input('cicloRef', sql.NVarChar(20), cicloRef);
        req.input('situacao', sql.NVarChar(20), sit);
        req.input('observacao', sql.NVarChar(500), observacao || null);
        req.input('atualizadoPor', sql.NVarChar(200), atualizadoPor || null);
      }, `
        UPDATE dbo.AlertasSituacao
        SET Situacao = @situacao, Observacao = @observacao, AtualizadoPor = @atualizadoPor, UpdatedAt = SYSUTCDATETIME()
        WHERE CriterioId = @criterioId AND CicloRef = @cicloRef;
        SELECT @@ROWCOUNT AS affected;
      `);

      if (Number(upd.recordset[0]?.affected ?? 0) === 0) {
        await query((req) => {
          req.input('criterioId', sql.UniqueIdentifier, criterioId);
          req.input('cicloRef', sql.NVarChar(20), cicloRef);
          req.input('situacao', sql.NVarChar(20), sit);
          req.input('observacao', sql.NVarChar(500), observacao || null);
          req.input('atualizadoPor', sql.NVarChar(200), atualizadoPor || null);
        }, `
          INSERT INTO dbo.AlertasSituacao (CriterioId, CicloRef, Situacao, Observacao, AtualizadoPor)
          VALUES (@criterioId, @cicloRef, @situacao, @observacao, @atualizadoPor);
        `);
      }

      return { ok: true };
    },

    async listAlertas() {
      const result = await query(null, `
        SELECT
          CAST(Id AS NVARCHAR(36)) AS id,
          Tipo AS tipo,
          Mensagem AS mensagem,
          Prioridade AS prioridade,
          Lido AS lido,
          CONVERT(VARCHAR(33), CreatedAt, 126) AS createdAt
        FROM dbo.Alertas
        ORDER BY CreatedAt DESC;
      `);
      return result.recordset;
    },

    async markAlertaAsRead(id) {
      const result = await query((req) => req.input('id', sql.UniqueIdentifier, id), `
        UPDATE dbo.Alertas SET Lido = 1 WHERE Id = @id;
        SELECT @@ROWCOUNT AS affected;
      `);
      if (Number(result.recordset[0]?.affected ?? 0) === 0) return null;

      const alert = await query((req) => req.input('id', sql.UniqueIdentifier, id), `
        SELECT
          CAST(Id AS NVARCHAR(36)) AS id,
          Tipo AS tipo,
          Mensagem AS mensagem,
          Prioridade AS prioridade,
          Lido AS lido,
          CONVERT(VARCHAR(33), CreatedAt, 126) AS createdAt
        FROM dbo.Alertas
        WHERE Id = @id;
      `);
      return alert.recordset[0] ?? null;
    },

    // ── Regras de Alerta ───────────────────────────────────
    async listAlertaRegras() {
      const result = await query(null, `
        SELECT
          CAST(Id AS NVARCHAR(36)) AS id,
          Nome AS nome,
          Descricao AS descricao,
          Prioridade AS prioridade,
          Ativo AS ativo,
          TriggerTipo AS triggerTipo,
          TriggerDias AS triggerDias,
          TriggerMeta AS triggerMeta,
          ApenasDiasUteis AS apenasDiasUteis,
          CanalDashboard AS canalDashboard,
          CanalEmail AS canalEmail,
          CONVERT(VARCHAR(33), CreatedAt, 126) AS dataCriacao
        FROM dbo.AlertaRegras
        ORDER BY CreatedAt DESC;
      `);
      return result.recordset;
    },

    async createAlertaRegra(input) {
      const nome = String(input.nome ?? '').trim();
      const descricao = String(input.descricao ?? '').trim() || null;
      const prioridade = String(input.prioridade ?? 'media').trim().toLowerCase();
      const ativo = input.ativo !== false;
      const triggerTipo = String(input.triggerTipo ?? 'vencimento').trim().toLowerCase();
      const triggerDias = Number(input.triggerDias ?? 0);
      const triggerMeta = input.triggerMeta != null ? Number(input.triggerMeta) : null;
      const apenasDiasUteis = input.apenasDiasUteis !== false;
      const canalDashboard = input.canalDashboard !== false;
      const canalEmail = input.canalEmail !== false;

      if (!nome) throw Object.assign(new Error('Nome é obrigatório.'), { statusCode: 400 });

      const result = await query((req) => {
        req.input('nome', sql.NVarChar(200), nome);
        req.input('descricao', sql.NVarChar(500), descricao);
        req.input('prioridade', sql.NVarChar(20), prioridade);
        req.input('ativo', sql.Bit, ativo);
        req.input('triggerTipo', sql.NVarChar(80), triggerTipo);
        req.input('triggerDias', sql.Int, triggerDias);
        req.input('triggerMeta', sql.Int, triggerMeta);
        req.input('apenasDiasUteis', sql.Bit, apenasDiasUteis);
        req.input('canalDashboard', sql.Bit, canalDashboard);
        req.input('canalEmail', sql.Bit, canalEmail);
      }, `
        INSERT INTO dbo.AlertaRegras (Nome, Descricao, Prioridade, Ativo, TriggerTipo, TriggerDias, TriggerMeta, ApenasDiasUteis, CanalDashboard, CanalEmail)
        OUTPUT
          CAST(inserted.Id AS NVARCHAR(36)) AS id,
          inserted.Nome AS nome,
          inserted.Descricao AS descricao,
          inserted.Prioridade AS prioridade,
          inserted.Ativo AS ativo,
          inserted.TriggerTipo AS triggerTipo,
          inserted.TriggerDias AS triggerDias,
          inserted.TriggerMeta AS triggerMeta,
          inserted.ApenasDiasUteis AS apenasDiasUteis,
          inserted.CanalDashboard AS canalDashboard,
          inserted.CanalEmail AS canalEmail,
          CONVERT(VARCHAR(33), inserted.CreatedAt, 126) AS dataCriacao
        VALUES (@nome, @descricao, @prioridade, @ativo, @triggerTipo, @triggerDias, @triggerMeta, @apenasDiasUteis, @canalDashboard, @canalEmail);
      `);
      return result.recordset[0];
    },

    async updateAlertaRegra(id, input) {
      const nome = String(input.nome ?? '').trim();
      const descricao = String(input.descricao ?? '').trim() || null;
      const prioridade = String(input.prioridade ?? 'media').trim().toLowerCase();
      const ativo = input.ativo !== false;
      const triggerTipo = String(input.triggerTipo ?? 'vencimento').trim().toLowerCase();
      const triggerDias = Number(input.triggerDias ?? 0);
      const triggerMeta = input.triggerMeta != null ? Number(input.triggerMeta) : null;
      const apenasDiasUteis = input.apenasDiasUteis !== false;
      const canalDashboard = input.canalDashboard !== false;
      const canalEmail = input.canalEmail !== false;

      if (!nome) throw Object.assign(new Error('Nome é obrigatório.'), { statusCode: 400 });

      const result = await query((req) => {
        req.input('id', sql.UniqueIdentifier, id);
        req.input('nome', sql.NVarChar(200), nome);
        req.input('descricao', sql.NVarChar(500), descricao);
        req.input('prioridade', sql.NVarChar(20), prioridade);
        req.input('ativo', sql.Bit, ativo);
        req.input('triggerTipo', sql.NVarChar(80), triggerTipo);
        req.input('triggerDias', sql.Int, triggerDias);
        req.input('triggerMeta', sql.Int, triggerMeta);
        req.input('apenasDiasUteis', sql.Bit, apenasDiasUteis);
        req.input('canalDashboard', sql.Bit, canalDashboard);
        req.input('canalEmail', sql.Bit, canalEmail);
      }, `
        UPDATE dbo.AlertaRegras
        SET Nome = @nome, Descricao = @descricao, Prioridade = @prioridade, Ativo = @ativo,
            TriggerTipo = @triggerTipo, TriggerDias = @triggerDias, TriggerMeta = @triggerMeta,
            ApenasDiasUteis = @apenasDiasUteis, CanalDashboard = @canalDashboard, CanalEmail = @canalEmail
        WHERE Id = @id;
        SELECT @@ROWCOUNT AS affected;
      `);
      if (Number(result.recordset[0]?.affected ?? 0) === 0) return null;

      const row = await query((req) => req.input('id', sql.UniqueIdentifier, id), `
        SELECT
          CAST(Id AS NVARCHAR(36)) AS id,
          Nome AS nome,
          Descricao AS descricao,
          Prioridade AS prioridade,
          Ativo AS ativo,
          TriggerTipo AS triggerTipo,
          TriggerDias AS triggerDias,
          TriggerMeta AS triggerMeta,
          ApenasDiasUteis AS apenasDiasUteis,
          CanalDashboard AS canalDashboard,
          CanalEmail AS canalEmail,
          CONVERT(VARCHAR(33), CreatedAt, 126) AS dataCriacao
        FROM dbo.AlertaRegras WHERE Id = @id;
      `);
      return row.recordset[0] ?? null;
    },

    async toggleAlertaRegra(id, ativo) {
      const result = await query((req) => {
        req.input('id', sql.UniqueIdentifier, id);
        req.input('ativo', sql.Bit, ativo);
      }, `
        UPDATE dbo.AlertaRegras SET Ativo = @ativo WHERE Id = @id;
        SELECT @@ROWCOUNT AS affected;
      `);
      return Number(result.recordset[0]?.affected ?? 0) > 0;
    },

    async deleteAlertaRegra(id) {
      const result = await query((req) => req.input('id', sql.UniqueIdentifier, id), `
        DELETE FROM dbo.AlertaRegras WHERE Id = @id;
        SELECT @@ROWCOUNT AS affected;
      `);
      return Number(result.recordset[0]?.affected ?? 0) > 0;
    },

    // ── Configuração de Alertas ────────────────────────────
    async getAlertaConfig() {
      const result = await query(null, `
        SELECT
          SistemaAtivo AS sistemaAtivo,
          MaxAlertasDia AS maxAlertasDia,
          LimpezaDias AS limpezaDias,
          ApenasDiasUteis AS apenasDiasUteis,
          EmailObrigatorio AS emailObrigatorio,
          ModoDebug AS modoDebug,
          NotifDashboard AS notifDashboard,
          NotifEmail AS notifEmail,
          NotifPush AS notifPush,
          FrequenciaNotif AS frequenciaNotif,
          ModoSilencioso AS modoSilencioso
        FROM dbo.AlertaConfig WHERE Id = 1;
      `);
      return result.recordset[0] ?? {
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
    },

    async updateAlertaConfig(input) {
      await query((req) => {
        req.input('sistemaAtivo', sql.Bit, input.sistemaAtivo !== false);
        req.input('maxAlertasDia', sql.Int, Number(input.maxAlertasDia ?? 50));
        req.input('limpezaDias', sql.Int, Number(input.limpezaDias ?? 30));
        req.input('apenasDiasUteis', sql.Bit, input.apenasDiasUteis !== false);
        req.input('emailObrigatorio', sql.Bit, input.emailObrigatorio !== false);
        req.input('modoDebug', sql.Bit, input.modoDebug === true);
        req.input('notifDashboard', sql.Bit, input.notifDashboard !== false);
        req.input('notifEmail', sql.Bit, input.notifEmail === true);
        req.input('notifPush', sql.Bit, input.notifPush === true);
        req.input('frequenciaNotif', sql.NVarChar(30), String(input.frequenciaNotif ?? 'imediato'));
        req.input('modoSilencioso', sql.Bit, input.modoSilencioso === true);
      }, `
        UPDATE dbo.AlertaConfig
        SET SistemaAtivo = @sistemaAtivo, MaxAlertasDia = @maxAlertasDia, LimpezaDias = @limpezaDias,
            ApenasDiasUteis = @apenasDiasUteis, EmailObrigatorio = @emailObrigatorio, ModoDebug = @modoDebug,
            NotifDashboard = @notifDashboard, NotifEmail = @notifEmail, NotifPush = @notifPush,
            FrequenciaNotif = @frequenciaNotif, ModoSilencioso = @modoSilencioso
        WHERE Id = 1;
      `);
      return this.getAlertaConfig();
    },

    async ensurePhoneColumn() {
      await query(null, `
        IF NOT EXISTS (
          SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Users' AND COLUMN_NAME = 'Phone'
        )
        BEGIN
          ALTER TABLE dbo.Users ADD Phone NVARCHAR(30) NULL;
        END
      `);
    },

    async listUsuarios() {
      const result = await query(null, `
        SELECT
          CAST(u.Id AS NVARCHAR(36)) AS id,
          u.Username AS username,
          u.[Role] AS role,
          u.[Name] AS name,
          u.Email AS email,
          u.Phone AS phone,
          CAST(u.SecretariaId AS NVARCHAR(36)) AS secretariaId,
          s.Nome AS secretariaNome,
          u.IsActive AS isActive,
          CONVERT(VARCHAR(33), u.CreatedAt, 126) AS createdAt
        FROM dbo.Users u
        LEFT JOIN dbo.Secretarias s ON s.Id = u.SecretariaId
        ORDER BY u.[Name] ASC;
      `);
      return result.recordset;
    },

    async createUsuario(input) {
      const username = String(input.username ?? '').trim().toLowerCase();
      const name = String(input.name ?? '').trim();
      const email = String(input.email ?? '').trim().toLowerCase();
      const role = normalizeRole(input.role);
      const password = String(input.password ?? '').trim();
      const secretariaId = input.secretariaId || null;

      if (!username || !name || !email) {
        throw Object.assign(new Error('username, name e email são obrigatórios.'), { statusCode: 400 });
      }

      try {
        const result = await query((req) => {
          req.input('username', sql.NVarChar(120), username);
          req.input('role', sql.NVarChar(40), role);
          req.input('name', sql.NVarChar(200), name);
          req.input('email', sql.NVarChar(200), email);
          req.input('passwordHash', sql.NVarChar(255), password ? hashPassword(password) : null);
          req.input('secretariaId', sql.UniqueIdentifier, secretariaId);
        }, `
          INSERT INTO dbo.Users (Username, [Role], [Name], Email, PasswordHash, SecretariaId)
          OUTPUT
            CAST(INSERTED.Id AS NVARCHAR(36)) AS id,
            INSERTED.Username AS username,
            INSERTED.[Role] AS role,
            INSERTED.[Name] AS name,
            INSERTED.Email AS email,
            CAST(INSERTED.SecretariaId AS NVARCHAR(36)) AS secretariaId,
            INSERTED.IsActive AS isActive,
            CONVERT(VARCHAR(33), INSERTED.CreatedAt, 126) AS createdAt
          VALUES (@username, @role, @name, @email, @passwordHash, @secretariaId);
        `);

        return result.recordset[0];
      } catch (err) {
        const msg = String(err?.message ?? '');
        if (msg.includes('UQ_Users_Username') || msg.includes('UQ_Users_Email')) {
          throw Object.assign(new Error('Usuário já existe.'), { statusCode: 409 });
        }
        throw err;
      }
    },

    async updateUsuario(id, input) {
      const updates = [];
      if (input.username !== undefined) updates.push('Username = @username');
      if (input.name !== undefined) updates.push('[Name] = @name');
      if (input.email !== undefined) updates.push('Email = @email');
      if (input.role !== undefined) updates.push('[Role] = @role');
      if (input.isActive !== undefined) updates.push('IsActive = @isActive');
      if (input.password !== undefined && String(input.password ?? '').trim()) updates.push('PasswordHash = @passwordHash');
      if (input.secretariaId !== undefined) updates.push('SecretariaId = @secretariaId');
      if (input.phone !== undefined) updates.push('Phone = @phone');
      if (!updates.length) return this.findUserById(id).then(toPublicUser);

      try {
        await query((req) => {
          req.input('id', sql.UniqueIdentifier, id);
          if (input.username !== undefined) req.input('username', sql.NVarChar(120), String(input.username ?? '').trim().toLowerCase());
          if (input.name !== undefined) req.input('name', sql.NVarChar(200), String(input.name ?? '').trim());
          if (input.email !== undefined) req.input('email', sql.NVarChar(200), String(input.email ?? '').trim().toLowerCase());
          if (input.role !== undefined) req.input('role', sql.NVarChar(40), normalizeRole(input.role));
          if (input.isActive !== undefined) req.input('isActive', sql.Bit, Boolean(input.isActive));
          if (input.password !== undefined && String(input.password ?? '').trim()) {
            req.input('passwordHash', sql.NVarChar(255), hashPassword(String(input.password)));
          }
          if (input.secretariaId !== undefined) req.input('secretariaId', sql.UniqueIdentifier, input.secretariaId || null);
          if (input.phone !== undefined) req.input('phone', sql.NVarChar(30), input.phone ? String(input.phone).trim() : null);
        }, `
          UPDATE dbo.Users
          SET ${updates.join(', ')}
          WHERE Id = @id;

          SELECT @@ROWCOUNT AS affected;
        `);
      } catch (err) {
        const msg = String(err?.message ?? '');
        if (msg.includes('UQ_Users_Username') || msg.includes('UQ_Users_Email')) {
          throw Object.assign(new Error('Username ou email já em uso.'), { statusCode: 409 });
        }
        throw err;
      }

      const updated = await this.findUserById(id);
      return toPublicUser(updated);
    },

    async updatePerfil(id, input) {
      // Rota restrita ao próprio usuário: só pode alterar nome e telefone
      const updates = [];
      if (input.name !== undefined) updates.push('[Name] = @name');
      if (input.phone !== undefined) updates.push('Phone = @phone');
      if (!updates.length) return this.findUserById(id).then(toPublicUser);

      await query((req) => {
        req.input('id', sql.UniqueIdentifier, id);
        if (input.name !== undefined) req.input('name', sql.NVarChar(200), String(input.name ?? '').trim());
        if (input.phone !== undefined) req.input('phone', sql.NVarChar(30), input.phone ? String(input.phone).trim() : null);
      }, `
        UPDATE dbo.Users SET ${updates.join(', ')} WHERE Id = @id;
      `);

      const updated = await this.findUserById(id);
      return toPublicUser(updated);
    },

    async deleteUsuario(id) {
      const result = await query((req) => req.input('id', sql.UniqueIdentifier, id), `
        DELETE FROM dbo.Users WHERE Id = @id;
        SELECT @@ROWCOUNT AS affected;
      `);
      return Number(result.recordset[0]?.affected ?? 0) > 0;
    },

    async findUserByUsername(username) {
      const result = await query((req) => req.input('username', sql.NVarChar(120), String(username ?? '').trim().toLowerCase()), `
        SELECT
          CAST(Id AS NVARCHAR(36)) AS id,
          Username AS username,
          [Role] AS role,
          [Name] AS name,
          Email AS email,
          Phone AS phone,
          PasswordHash AS passwordHash,
          CAST(SecretariaId AS NVARCHAR(36)) AS secretariaId,
          IsActive AS isActive,
          CONVERT(VARCHAR(33), CreatedAt, 126) AS createdAt
        FROM dbo.Users
        WHERE Username = @username;
      `);
      return result.recordset[0] ?? null;
    },

    async findUserByEmail(email) {
      const result = await query((req) => req.input('email', sql.NVarChar(200), String(email ?? '').trim().toLowerCase()), `
        SELECT
          CAST(Id AS NVARCHAR(36)) AS id,
          Username AS username,
          [Role] AS role,
          [Name] AS name,
          Email AS email,
          Phone AS phone,
          PasswordHash AS passwordHash,
          CAST(SecretariaId AS NVARCHAR(36)) AS secretariaId,
          IsActive AS isActive,
          CONVERT(VARCHAR(33), CreatedAt, 126) AS createdAt
        FROM dbo.Users
        WHERE Email = @email;
      `);
      return result.recordset[0] ?? null;
    },

    async findUserById(id) {
      const result = await query((req) => req.input('id', sql.UniqueIdentifier, id), `
        SELECT
          CAST(Id AS NVARCHAR(36)) AS id,
          Username AS username,
          [Role] AS role,
          [Name] AS name,
          Email AS email,
          Phone AS phone,
          PasswordHash AS passwordHash,
          CAST(SecretariaId AS NVARCHAR(36)) AS secretariaId,
          IsActive AS isActive,
          CONVERT(VARCHAR(33), CreatedAt, 126) AS createdAt
        FROM dbo.Users
        WHERE Id = @id;
      `);
      return result.recordset[0] ?? null;
    },

    async upsertUserFromIdentity(identity) {
      if (!identity || !identity.email) return toPublicUser(identity);

      const existing = await this.findUserByEmail(identity.email);
      if (existing) {
        const existingRole = String(existing.role ?? '').trim().toLowerCase() || 'padrao';
        const incomingRole = String(identity.role ?? '').trim().toLowerCase();
        const nextRole = existingRole === 'admin' ? 'admin' : (incomingRole === 'admin' ? 'admin' : existingRole);
        await this.updateUsuario(existing.id, {
          username: identity.username || existing.username,
          name: identity.name || existing.name,
          role: nextRole,
          isActive: true,
        });
        const updated = await this.findUserByEmail(identity.email);
        return toPublicUser(updated);
      }

      let usernameBase = String(identity.username || identity.email.split('@')[0] || 'usuario').trim().toLowerCase();
      if (!usernameBase) usernameBase = 'usuario';

      for (let i = 0; i < 20; i += 1) {
        const candidate = i === 0 ? usernameBase : `${usernameBase}${i + 1}`;
        try {
          return await this.createUsuario({
            username: candidate,
            name: identity.name || candidate,
            email: identity.email,
            role: identity.role || 'padrao',
          });
        } catch (err) {
          if (Number(err?.statusCode) === 409) continue;
          throw err;
        }
      }

      throw new Error('Não foi possível criar usuário para identidade autenticada.');
    },

    async getDashboardMetrics() {
      // ── totais gerais ──
      const result = await query(null, `
        SELECT
          COUNT(1) AS totalCriterios,
          SUM(CASE WHEN Status IN ('Concluído', 'Concluido') THEN 1 ELSE 0 END) AS criteriosConcluidos,
          SUM(CASE WHEN Status = 'Ativo'    THEN 1 ELSE 0 END) AS ativos,
          SUM(CASE WHEN Status = 'Inativo'  THEN 1 ELSE 0 END) AS inativos,
          SUM(CASE WHEN Status = 'Pendente' THEN 1 ELSE 0 END) AS pendentes,
          SUM(CASE WHEN Status = 'Vencido'  THEN 1 ELSE 0 END) AS vencidos
        FROM dbo.Criterios;
      `);

      // ── por secretaria ──
      const porSec = await query(null, `
        SELECT
          COALESCE(s.Sigla, 'S/Sec') AS sigla,
          COALESCE(s.Nome,  'Sem secretaria') AS secretaria,
          COUNT(1) AS total,
          SUM(CASE WHEN c.Status IN ('Concluído','Concluido') THEN 1 ELSE 0 END) AS concluidos,
          SUM(CASE WHEN c.Status = 'Ativo'    THEN 1 ELSE 0 END) AS ativos,
          SUM(CASE WHEN c.Status = 'Pendente' THEN 1 ELSE 0 END) AS pendentes,
          SUM(CASE WHEN c.Status = 'Vencido'  THEN 1 ELSE 0 END) AS vencidos
        FROM dbo.Criterios c
        LEFT JOIN dbo.Secretarias s ON s.Id = c.SecretariaId
        GROUP BY COALESCE(s.Sigla,'S/Sec'), COALESCE(s.Nome,'Sem secretaria')
        ORDER BY total DESC;
      `);

      // ── alertas vencidos e urgentes (≤15 dias) baseados em ciclo ──
      const hoje = new Date();
      const alertasCiclo = await query(null, `
        SELECT
          c.Id         AS id,
          c.Nome       AS nome,
          c.Periodicidade AS periodicidade,
          COALESCE(s.Sigla, '') AS sigla,
          COALESCE(als.Situacao, 'pendente') AS situacao
        FROM dbo.Criterios c
        LEFT JOIN dbo.Secretarias s ON s.Id = c.SecretariaId
        LEFT JOIN dbo.AlertasSituacao als
          ON als.CriterioId = c.Id
          AND als.CicloRef = (
            CASE c.Periodicidade
              WHEN 'Mensal'        THEN FORMAT(GETDATE(),'yyyy-MM')
              WHEN 'Bimestral'     THEN CONCAT(YEAR(GETDATE()),'-B',CEILING(MONTH(GETDATE())/2.0))
              WHEN 'Trimestral'    THEN CONCAT(YEAR(GETDATE()),'-T',CEILING(MONTH(GETDATE())/3.0))
              WHEN 'Quadrimestral' THEN CONCAT(YEAR(GETDATE()),'-Q',CEILING(MONTH(GETDATE())/4.0))
              WHEN 'Semestral'     THEN CONCAT(YEAR(GETDATE()),'-S',CEILING(MONTH(GETDATE())/6.0))
              ELSE CAST(YEAR(GETDATE()) AS VARCHAR)
            END
          )
        WHERE c.Status = 'Ativo'
          AND COALESCE(als.Situacao,'pendente') <> 'ok';
      `);

      // calcula dias restantes no lado JS (reutilizando calcularVencimentoCiclo)
      const agora = new Date();
      let alertasVencidos = 0;
      let alertasUrgentes = 0; // ≤ 15 dias
      for (const r of alertasCiclo.recordset) {
        const cicloRef = calcularCicloRef(r.periodicidade, agora);
        const venc = calcularVencimentoCiclo(r.periodicidade, cicloRef);
        if (!venc) continue;
        const dias = Math.ceil((venc - agora) / 86400000);
        if (dias < 0)  alertasVencidos++;
        else if (dias <= 15) alertasUrgentes++;
      }

      // ── periodicidades ──
      const perRes = await query(null, `
        SELECT Periodicidade AS per, COUNT(1) AS total
        FROM dbo.Criterios
        WHERE Status = 'Ativo'
        GROUP BY Periodicidade
        ORDER BY total DESC;
      `);

      const row = result.recordset[0] ?? {};
      return {
        totalCriterios:      Number(row.totalCriterios ?? 0),
        criteriosConcluidos: Number(row.criteriosConcluidos ?? 0),
        ativos:              Number(row.ativos ?? 0),
        inativos:            Number(row.inativos ?? 0),
        pendentes:           Number(row.pendentes ?? 0),
        vencidos:            Number(row.vencidos ?? 0),
        alertasVencidos,
        alertasUrgentes,
        porSecretaria: porSec.recordset.map((r) => ({
          sigla:      r.sigla,
          secretaria: r.secretaria,
          total:      Number(r.total ?? 0),
          concluidos: Number(r.concluidos ?? 0),
          ativos:     Number(r.ativos ?? 0),
          pendentes:  Number(r.pendentes ?? 0),
          vencidos:   Number(r.vencidos ?? 0),
        })),
        porPeriodicidade: perRes.recordset.map((r) => ({
          periodicidade: r.per,
          total: Number(r.total ?? 0),
        })),
      };
    },

    async getAdminOverview() {
      const users = await query(null, 'SELECT COUNT(1) AS total FROM dbo.Users WHERE IsActive = 1;');
      const criterios = await query(null, 'SELECT COUNT(1) AS total FROM dbo.Criterios;');
      const secretarias = await query(null, 'SELECT COUNT(1) AS total FROM dbo.Secretarias;');
      const alertas = await query(null, 'SELECT COUNT(1) AS total FROM dbo.Alertas WHERE Lido = 0;');

      return {
        usuariosAtivos: Number(users.recordset[0]?.total ?? 0),
        criteriosCadastrados: Number(criterios.recordset[0]?.total ?? 0),
        alertasAtivos: Number(alertas.recordset[0]?.total ?? 0),
        secretarias: Number(secretarias.recordset[0]?.total ?? 0),
      };
    },

    async listRelatorios() {
      const result = await query(null, `
        SELECT
          COALESCE(s.Nome, 'Sem secretaria') AS secretaria,
          COUNT(1) AS total,
          SUM(CASE WHEN c.Status IN ('Concluído', 'Concluido') THEN 1 ELSE 0 END) AS concluidos,
          SUM(CASE WHEN c.Status = 'Pendente' THEN 1 ELSE 0 END) AS pendentes,
          SUM(CASE WHEN c.Status = 'Vencido' THEN 1 ELSE 0 END) AS vencidos
        FROM dbo.Criterios c
        LEFT JOIN dbo.Secretarias s ON s.Id = c.SecretariaId
        GROUP BY COALESCE(s.Nome, 'Sem secretaria')
        ORDER BY secretaria ASC;
      `);

      return {
        porSecretaria: result.recordset.map((row) => ({
          secretaria: row.secretaria,
          total: Number(row.total ?? 0),
          concluidos: Number(row.concluidos ?? 0),
          pendentes: Number(row.pendentes ?? 0),
          vencidos: Number(row.vencidos ?? 0),
        })),
      };
    },
  };
}

module.exports = {
  createSqlStore,
};
