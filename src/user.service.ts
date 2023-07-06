import { NewUserRequest, User } from "./models/models";
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  private users = new Map<string, User>();

  constructor(users: User[] = []) {
    this.users = new Map(users.map(x => [x.id, x]));
  }

  getUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  addUser(user: NewUserRequest): User {
    const result = {
      id: this.generateUuid(),
      ...user,
    }
    this.users.set(result.id, result);
    return result
  }

  removeUser(userId: string) {
    const userInBase = this.users.get(userId);
    if (userInBase) {
      this.users.delete(userId)
      return true
    }
    return false
  }

  updateUser(userId: string, user: NewUserRequest) {
    const userInBase = this.users.get(userId);
    if (userInBase) {
      const result = {
        id: userId,
        ...user,
      }
      this.users.set(userId, result)
      return result
    }
    return null
  }

  generateUuid() {
    const uuid = uuidv4();
    return uuid;
  }
}

