import { User } from "../../models/user";

export interface IDeleteUserRepository {
  deleteUser(id: number): Promise<User>;
}
