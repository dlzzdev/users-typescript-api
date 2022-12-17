import {
  IUpdateUserRepository,
  UpdateUserParams,
} from "../../controllers/update-user/protocols";
import { prisma } from "../../database/prisma";
import { User } from "../../models/user";

export class PrismaUpdateUserRepository implements IUpdateUserRepository {
  async updateUser(
    id: number,
    { firstName, lastName, email, password }: UpdateUserParams
  ): Promise<User> {
    // prisma update parcial fields

    const user = await prisma.user.findUnique({ where: { id: +id } });

    if (!user) {
      throw new Error("User not found");
    }

    const userUpdated = await prisma.user.update({
      where: { id: +id },
      data: {
        firstName,
        lastName,
        email,
        password,
      },
    });

    return userUpdated;
  }
}
