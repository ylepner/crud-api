import { createMyServer } from './server';
import 'dotenv/config';
import { UserService } from './user.service';

const PORT = process.env.PORT || 4000;

createMyServer(new UserService([{
  age: 42,
  hobbies: [],
  id: 'foo',
  username: 'test'
}])).listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});