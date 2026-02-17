const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const { createMemoryStore } = require('../src/data/memoryStore');
const { createAuth } = require('../src/auth');
const { createApp } = require('../src/app');

async function createTestServer() {
  const config = {
    nodeEnv: 'test',
    authMode: 'local',
    adminEmails: [],
    localSessionTtlHours: 1,
  };

  const store = await createMemoryStore({
    localUsers: [
      {
        id: 'test-admin',
        username: 'admin',
        password: 'admin',
        role: 'admin',
        name: 'Admin Teste',
        email: 'admin@example.com',
      },
    ],
  });

  const auth = createAuth({ config, store });
  const app = createApp({
    store,
    auth,
    config,
    sqlInfo: { configured: false },
  });

  return { app };
}

async function loginAsAdmin(app) {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'admin' });

  assert.equal(res.status, 200);
  assert.ok(res.body.token);
  return res.body.token;
}

test('returns auth session metadata without login', async () => {
  const { app } = await createTestServer();
  const res = await request(app).get('/api/auth/session');

  assert.equal(res.status, 200);
  assert.equal(res.body.mode, 'local');
  assert.equal(res.body.authenticated, false);
});

test('allows login and protected route access with bearer token', async () => {
  const { app } = await createTestServer();
  const token = await loginAsAdmin(app);

  const relatorios = await request(app)
    .get('/api/relatorios')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(relatorios.status, 200);
  assert.ok(Array.isArray(relatorios.body.porSecretaria));
});

test('does not break /api/usuarios and /api/relatorios routing', async () => {
  const { app } = await createTestServer();
  const token = await loginAsAdmin(app);

  const usuarios = await request(app)
    .get('/api/usuarios')
    .set('Authorization', `Bearer ${token}`);

  const relatorios = await request(app)
    .get('/api/relatorios')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(usuarios.status, 200);
  assert.ok(Array.isArray(usuarios.body.items));
  assert.equal(relatorios.status, 200);
});

test('supports secretaria and criterio CRUD', async () => {
  const { app } = await createTestServer();
  const token = await loginAsAdmin(app);

  const secretaria = await request(app)
    .post('/api/secretarias')
    .set('Authorization', `Bearer ${token}`)
    .send({ nome: 'Secretaria de Teste', sigla: 'SETEST', descricao: 'Teste' });
  assert.equal(secretaria.status, 201);

  const criterio = await request(app)
    .post('/api/criterios')
    .set('Authorization', `Bearer ${token}`)
    .send({
      nome: 'Critério de Teste',
      secretariaId: secretaria.body.id,
      responsavel: 'Responsável Teste',
      periodicidade: 'Mensal',
      status: 'Ativo',
    });
  assert.equal(criterio.status, 201);

  const updated = await request(app)
    .put(`/api/criterios/${criterio.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ status: 'Concluído' });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.status, 'Concluído');

  const deleted = await request(app)
    .delete(`/api/criterios/${criterio.body.id}`)
    .set('Authorization', `Bearer ${token}`);
  assert.equal(deleted.status, 204);
});

test('does not downgrade admin role on identity upsert', async () => {
  const store = await createMemoryStore({
    localUsers: [],
  });

  const first = await store.upsertUserFromIdentity({
    id: 'id-1',
    username: 'dev',
    role: 'admin',
    name: 'Dev',
    email: 'dev@example.com',
    isActive: true,
  });
  assert.equal(first.role, 'admin');

  const second = await store.upsertUserFromIdentity({
    id: 'id-1',
    username: 'dev',
    role: 'padrao',
    name: 'Dev',
    email: 'dev@example.com',
    isActive: true,
  });
  assert.equal(second.role, 'admin');
});
