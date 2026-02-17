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
  const options = ['Mensal', 'Bimestral', 'Semestral', 'Anual'];
  const normalized = String(value ?? 'Mensal').trim().toLowerCase();
  const found = options.find((opt) => opt.toLowerCase() === normalized);
  return found ?? 'Mensal';
}

function toPublicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    name: row.name,
    email: row.email,
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

    async listUsuarios() {
      const result = await query(null, `
        SELECT
          CAST(u.Id AS NVARCHAR(36)) AS id,
          u.Username AS username,
          u.[Role] AS role,
          u.[Name] AS name,
          u.Email AS email,
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
      const result = await query(null, `
        SELECT
          COUNT(1) AS totalCriterios,
          SUM(CASE WHEN Status IN ('Concluído', 'Concluido') THEN 1 ELSE 0 END) AS criteriosConcluidos,
          SUM(CASE WHEN Status = 'Pendente' THEN 1 ELSE 0 END) AS pendentes,
          SUM(CASE WHEN Status = 'Vencido' THEN 1 ELSE 0 END) AS vencidos
        FROM dbo.Criterios;
      `);

      const alertas = await query(null, `
        SELECT COUNT(1) AS total
        FROM dbo.Alertas
        WHERE Lido = 0;
      `);

      const row = result.recordset[0] ?? {};
      return {
        totalCriterios: Number(row.totalCriterios ?? 0),
        criteriosConcluidos: Number(row.criteriosConcluidos ?? 0),
        pendentes: Number(row.pendentes ?? 0),
        vencidos: Number(row.vencidos ?? 0),
        alertasAtivos: Number(alertas.recordset[0]?.total ?? 0),
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
