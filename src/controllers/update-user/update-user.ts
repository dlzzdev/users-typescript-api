import validator from "validator";
import { prisma } from "../../database/prisma";
import { User } from "../../models/user";
import { HttpRequest, HttpResponse } from "../protocols";
import { IUpdateUserController, IUpdateUserRepository } from "./protocols";

export class UpdateUserController implements IUpdateUserController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}
  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<User>> {
    try {
      const { id } = httpRequest.params;

      if (!id) {
        return {
          statusCode: 400,
          body: "Missing param: id",
        };
      }

      if (!httpRequest.body) {
        return {
          statusCode: 400,
          body: "Bad Request",
        };
      }

      const { firstName, lastName, email, password } = httpRequest.body;

      if (email) {
        const emailIsValid = validator.isEmail(email);

        if (!emailIsValid) {
          return {
            statusCode: 400,
            body: "Email is not valid",
          };
        }

        const emailAlreadyExists = await prisma.user.findUnique({
          where: { email },
        });

        if (emailAlreadyExists) {
          return {
            statusCode: 400,
            body: "Email already exists",
          };
        }
      }

      const user = await this.updateUserRepository.updateUser(id, {
        firstName,
        lastName,
        email,
        password,
      });

      return {
        statusCode: 200,
        body: user,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }
}
