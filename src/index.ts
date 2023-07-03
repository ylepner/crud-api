import 'dotenv/config';
import { createServer as createServerHttp } from 'http';

const PORT = process.env.PORT;

const myServer = createServerHttp((req, res) => {
  res.end('Request accepted');
});

myServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
