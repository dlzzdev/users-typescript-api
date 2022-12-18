import { IDeleteUserRepository } from "../../controllers/delete-user/protocols";
import { prisma } from "../../database/prisma";
import { User } from "../../models/user";

export class PrismaDeleteUserRepository implements IDeleteUserRepository {
  constructor() {}
  async deleteUser(id: number): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        id: +id,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id: +id,
      },
    });

    if (!deletedUser) {
      throw new Error("User not deleted");
    }

    return user;
  }
}
