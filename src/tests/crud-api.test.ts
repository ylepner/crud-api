import request from 'supertest';
import { createMyServer } from '../server';
import { UserService } from '../user.service';
import { Server } from 'http';

const PORT = process.env.PORT || 4000;

const apiRequest = request(`http://localhost:${PORT}/api`);

let server: Server;
let userId: String;

describe('Tests with api methods', () => {

  beforeAll(() => {
    server = createMyServer(new UserService()).listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  });
  afterAll(() => {
    server.close();
  });

  it('Should get all records with a GET api/users request', async () => {
    await apiRequest.get('/users').expect(200).expect([]);
  });

  it('Should create new object by a POST api/users request', async () => {
    const testUser =
    {
      username: "Test Name",
      age: 62,
      hobbies: ["reading", "swimming"]
    }
    const result = await apiRequest.post('/users').send(testUser).expect(201);
    expect(result.body).toMatchObject(testUser);
    userId = result.body.id
    await apiRequest.get(`/users/${result.body.id}`).expect(200).expect({
      id: userId,
      ...testUser,
    })
  });

  it('Should update the created record with a PUT api/users/{userId} request ', async () => {
    const updateUser = {
      username: "Test Update Name",
      age: 67,
      hobbies: ["reading"]
    }
    const result = await apiRequest.put(`/users/${userId}`).send(updateUser).expect(200)
    expect(result.body).toMatchObject({
      id: userId,
      ...updateUser,
    });
  });

  it('Should delete the created object with a DELETE api/users/{userId} request ', async () => {
    await apiRequest.delete(`/users/${userId}`).expect(204);
    await apiRequest.get('/users').expect(200).expect([]);
  }
  )
});

describe('Test bad request', () => {
  let server: Server;
  let userId: String;
  const testUser = {
    username: "Test Name",
    age: 56,
    hobbies: ["reading", "swimming"]
  }
  beforeAll(() => {
    server = createMyServer(new UserService()).listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  });
  afterAll(() => {
    server.close();
  });

  it('Should answer with status code 404 if request sends to non-existing endpoints', async () => {
    (await apiRequest.get('/user').expect(404))
  });

  it('Should answer with status code 400 if POST request body does not contain required fields', async () => {
    const testUser =
    {
      username: "Test Name",
      hobbies: ["reading", "swimming"]
    }
    apiRequest.post('/users').send(testUser).expect(400);
  })

  it('Should answer with status code 400 if userId is invalid (not uuid) with PUT request', async () => {
    const notUuid = '21r23r23t4t';
    await apiRequest.put(`/users/${notUuid}`).send(testUser).expect(400);
  })

  it(`Should answer with status code 404 if userId doesn't exist`, async () => {
    const fakeUuid = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
    await apiRequest.put(`/users/${fakeUuid}`).send(testUser).expect(404);
  })
})