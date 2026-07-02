import { describe, it, expect, beforeAll } from 'vitest';
import { buildApp } from '../app';

let app: Awaited<ReturnType<typeof buildApp>>;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-key-for-unit-tests-min-32-chars!!';
  process.env.DATABASE_URL = '';
  app = await buildApp();
});

describe('Auth Routes', () => {
  it('POST /api/login - should return 400 for missing credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/login',
      payload: {},
    });
    expect(response.statusCode).toBe(400);
  });

  it('POST /api/login - should return 404 for unknown user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/login',
      payload: { email: 'nonexistent@test.com', password: '123456' },
    });
    expect(response.statusCode).toBe(404);
    const body = JSON.parse(response.body);
    expect(body.message).toContain('não encontrado');
  });

  it('GET /api/health - should return operational', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/health',
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.status).toBe('operational');
    expect(body.kernel).toBe('Nexus-Dual');
  });

  it('POST /api/forgot-password - should return success message', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/forgot-password',
      payload: { email: 'test@test.com' },
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.message).toContain('Se o email existir');
  });

  it('POST /api/reset-password - should return 400 for invalid token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/reset-password',
      payload: { token: 'invalid-token', password: 'newpassword123' },
    });
    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.message).toContain('inválido');
  });
});
