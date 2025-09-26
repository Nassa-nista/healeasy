const request = require('supertest');
const app = require('../src/app');

async function login() {
  const email = `t${Date.now()}@test.com`;
  await request(app).post('/auth/register').send({ email, name: 'Test', password: 'p' });
  const r = await request(app).post('/auth/login').send({ email, password: 'p' });
  return r.body.token;
}

describe('Medications CRUD', () => {
  it('creates, lists, updates, deletes', async () => {
    const token = await login();

    const created = await request(app)
      .post('/medications')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ibuprofen', dosage: '200mg' });
    expect(created.status).toBe(201);
    const id = created.body.id;

    const list = await request(app)
      .get('/medications')
      .set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);

    const updated = await request(app)
      .put(`/medications/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ dosage: '400mg' });
    expect(updated.status).toBe(200);
    expect(updated.body.dosage).toBe('400mg');

    const del = await request(app)
      .delete(`/medications/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(200);
  });
});
