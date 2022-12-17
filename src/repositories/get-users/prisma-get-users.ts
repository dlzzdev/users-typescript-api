import { IGetUsersRepository } from "../../controllers/get-users/protocols";
import { prisma } from "../../database/prisma";
import { User } from "../../models/user";

export class PrismaGetUsersRepository implements IGetUsersRepository {
  async getUsers(): Promise<User[]> {
    const raw = await prisma.user.findMany();

    return raw;
  }
}
