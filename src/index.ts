import 'dotenv/config';
import { IncomingMessage, ServerResponse, createServer } from 'http';
import { UserService } from './user.service';
import { readJsonBody } from './read-body';
import { NewUserRequest } from './models/models';
import { type } from 'os';

const PORT = process.env.PORT || 4000;
const uuid = '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';

const service = new UserService();
const myServer = createServer(async (req, res) => {
  const route = routes.find(x => x.method === req.method && req.url?.match(x.url));
  if (!route) {
    res.writeHead(404);
    res.write('Such route does not exist');
    res.end();
    return;
  }
  const param = req.url!.match(route.url)?.[0];
  try {
    const result = await route.execFn(param, req);
    writeData(result.data, result.code, res);

  } catch (e) {
    writeData(null, 404, res);
  }
})

interface RouteEntry {
  method: 'GET' | 'POST' | 'PUT';
  url: RegExp;
  execFn: (param: any, request: IncomingMessage) => Promise<HttpResponse>
}

const routes: RouteEntry[] = [
  {
    method: 'GET', url: /^\/api\/users\/?$/, execFn: async () => {

      return {
        data: service.getUsers(),
        code: 200
      }
    }
  },
  {
    method: 'GET', url: /^\/api\/users\/(.+)$/, execFn: async (userId) => {
      // uuid
      const result = service.getUser(userId);
      if (!result) {
        return {
          data: 'not found',
          code: 404
        }
      }
      return {
        data: result,
        code: 200
      }
    }
  },
  {
    method: 'POST', url: /^\/api\/users$/, execFn: async (_, body) => {
      const user = await readJsonBody(body);
      if (!validateUser(user)) {
        return {
          code: 400,
          data: 'Request body does not contain required fields'
        }
      }
      service.addUser(user)
      return {
        code: 201,
      };
    }
  }
]

myServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

function writeData(data: any | undefined, code: number, res: ServerResponse) {

  res.writeHead(code);

  if (data)
    res.write(JSON.stringify(data));
  res.end();
}

interface HttpResponse {
  code: number;
  data?: any;
}

function validateUser(obj: unknown): obj is NewUserRequest {
  if (typeof obj !== 'object') {
    return false;
  }
  if (!obj) {
    return false;
  }
  if (!('username' in obj)) {
    return false;
  }
  if (typeof obj.username !== 'string') {
    return false;
  }
  if (!('age' in obj)) {
    return false
  }
  if (typeof obj.age !== 'number') {
    return false
  }
  if (obj.age < 0) {
    return false
  }
  if (!('hobbies' in obj)) {
    return false
  }
  if (!Array.isArray(obj.hobbies)) {
    return false
  }
  if (obj.hobbies.some((el) => typeof el !== 'string')) {
    return false
  }
  return true;
}