import request from 'supertest';

import '../server'

const api = request(`http://localhost:${42}/api`);
console.log('Im doing something here')
describe('Tests with api methods', () => {
  it('Should get all records with a GET api/users request', async () => {
    const res = await api.get(`/users`).expect(200);
    expect(res.body).toMatchObject([]);
  });
})

