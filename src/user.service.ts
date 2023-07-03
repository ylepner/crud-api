import { User } from "./models/models";

export class UserService {
  private users: User[] = [];

  getUsers() {
    return this.users;
  }

  getUser(userId: string) {
    return this.users.find(x => x.id === userId);
  }

  addUser(user: User) {
    this.users.push(user);
  }

  removeUser(userId: string) {

  }

  updateUser(user: User) {

  }
}