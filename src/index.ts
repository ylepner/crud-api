import 'dotenv/config';
import { ServerResponse, createServer } from 'http';
import { UserService } from './user.service';

const PORT = process.env.PORT;


// +10 GET api/users
// +10 GET api/users/{userId}
// +10 POST api/users
// +10 PUT api/users/{userId}
// +10 DELETE api/users/{userId}


interface RouteEntry {
  method: 'GET' | 'POST' | 'PUT';
  url: RegExp;
  execFn: (param: any, body: any) => any
}

const routes: RouteEntry[] = [
  { method: 'GET', url: /^\/api\/users$/, execFn: () => service.getUsers() },
  { method: 'GET', url: /^\/api\/users\/(.+)$/, execFn: (userId) => service.getUser(userId) },
  { method: 'POST', url: /^\/api\/users$/, execFn: (_, body) => service.addUser(body) }
]


const service = new UserService();
const myServer = createServer((req, res) => {
  const route = routes.find(x => x.method === req.method && req.url?.match(x.url));
  if (!route) {
    res.writeHead(404);
    res.write('Such route does not exist');
    res.end();
    return;
  }
  const param = req.url!.match(route.url)?.[0];
  try {
    const result = route.execFn(param, {});
    writeData(result, 200, res);

  } catch (e) {
    writeData(null, 404, res);
  }
});

function writeData(data: any | undefined, code: number, res: ServerResponse) {

  res.writeHead(code);

  if (data)
    res.write(JSON.stringify(data));
  res.end();
}

myServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
