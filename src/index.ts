import 'dotenv/config';
import { IncomingMessage, ServerResponse, createServer } from 'http';
import { UserService } from './user.service';

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
  // { method: 'POST', url: /^\/api\/users$/, execFn: (_, body) => service.addUser(body) }
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
  data: any;
}