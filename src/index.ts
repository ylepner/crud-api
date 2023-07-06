import 'dotenv/config';
import { IncomingMessage, ServerResponse, createServer } from 'http';
import { UserService } from './user.service';
import { readJsonBody } from './read-body';
import { NewUserRequest } from './models/models';
import { validate } from 'uuid';


const PORT = process.env.PORT || 4000;

const service = new UserService();
const myServer = createServer(async (req, res) => {
  try {
    let url = req.url;
    if (url == null) {
      throw new Error('Internal error');
    }
    if (url.at(-1) === '/') {
      url = url.slice(0, -1);
    }
    const route = routes.find(x => x.method === req.method && url?.match(x.url));
    if (!route) {
      res.writeHead(404);
      res.write('Such route does not exist');
      res.end();
      return;
    }
    const param = req.url!.match(route.url)?.[1];
    try {
      const result = await route.execFn(param, req);
      writeData(result.data, result.code, res);
    } catch (e) {
      writeData(null, 404, res);
    }
  } catch {
    writeData('Internal server error', 500, res);
  }
})

interface RouteEntry {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
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
      if (!validate(userId)) {
        return {
          data: 'User id is invalid',
          code: 400
        }
      }
      const result = service.getUser(userId);
      if (!result) {
        return {
          data: 'User not found',
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
      return {
        code: 201,
        data: service.addUser(user)
      };
    }
  },
  {
    method: 'PUT', url: /^\/api\/users\/(.+)$/, execFn: async (userId, body) => {
      const user = await readJsonBody(body);
      if (!validateUser(user)) {
        return {
          code: 400,
          data: 'Request body does not contain required fields'
        }
      }
      if (!validate(userId)) {
        return {
          data: 'User id is invalid',
          code: 400,
        }
      }
      const result = service.updateUser(userId, user)
      if (!result) {
        return {
          code: 404,
          data: 'user not found'
        }
      }
      return {
        code: 200,
        data: result
      }
    }
  },
  {
    method: 'DELETE', url: /^\/api\/users\/(.+)$/, execFn: async (userId) => {
      if (!validate(userId)) {
        return {
          data: 'User id is invalid',
          code: 400,
        }
      }
      if (!service.removeUser(userId)) {
        return {
          code: 404,
          data: 'User not found'
        }
      }
      return {
        code: 204,
        data: 'User has been deleted'
      }
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
  if (obj.age < 0 || obj.age > 120) {
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
