const request = require('supertest');
const app = require('../src/app');

describe('Auth', () => {
  it('registers and logs in', async () => {
    const email = `u${Date.now()}@test.com`;

    const r1 = await request(app)
      .post('/auth/register')
      .send({ email, name: 'User', password: 'secret' });
    expect(r1.status).toBe(201);
    expect(r1.body.token).toBeTruthy();

    const r2 = await request(app)
      .post('/auth/login')
      .send({ email, password: 'secret' });
    expect(r2.status).toBe(200);
    expect(r2.body.token).toBeTruthy();
  });
});
