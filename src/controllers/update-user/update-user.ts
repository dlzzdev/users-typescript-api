import validator from "validator";
import { prisma } from "../../database/prisma";
import { User } from "../../models/user";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { badRequest, ok, serverError } from "../utils";
import { IUpdateUserRepository, UpdateUserParams } from "./protocols";

export class UpdateUserController implements IController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}
  async handle(
    httpRequest: HttpRequest<UpdateUserParams>
  ): Promise<HttpResponse<User | string>> {
    try {
      const { id } = httpRequest.params;

      if (!id) {
        return badRequest("Missing user id");
      }

      if (!httpRequest.body) {
        return badRequest("Missing request body");
      }

      const { firstName, lastName, email, password } = httpRequest.body;

      if (email) {
        const emailIsValid = validator.isEmail(email);

        if (!emailIsValid) {
          return badRequest("Invalid email.");
        }

        const emailAlreadyExists = await prisma.user.findUnique({
          where: { email },
        });

        if (emailAlreadyExists) {
          return badRequest("Email already exists.");
        }
      }

      const user = await this.updateUserRepository.updateUser(id, {
        firstName,
        lastName,
        email,
        password,
      });

      return ok<User>(user);
    } catch (error) {
      return serverError();
    }
  }
}
