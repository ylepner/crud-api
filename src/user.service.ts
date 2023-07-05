import { NewUserRequest, User } from "./models/models";
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  private users: User[] = [];

  getUsers() {
    return this.users;
  }

  getUser(userId: string) {
    return this.users.find(x => x.id === userId);
  }

  addUser(user: NewUserRequest) {
    const result = {
      id: this.generateUuid(),
      ...user,
    }
    this.users.push(result);
    return result
  }

  removeUser(userId: string) {

  }

  updateUser(user: User) {

  }

  generateUuid() {
    const uuid = uuidv4();
    console.log(uuid);
    return uuid;
  }
}

