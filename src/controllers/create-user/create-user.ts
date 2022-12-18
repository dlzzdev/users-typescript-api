import validator from "validator";
import { prisma } from "../../database/prisma";
import { User } from "../../models/user";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import {
  CreateUserParams,
  ICreateUserRepository,
} from "./protocols";

export class CreateUserController implements IController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}
  async handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User>> {
    try {
      if (!httpRequest.body) {
        return {
          statusCode: 400,
          body: "Bad Request",
        };
      }

      const requiredFields: string[] = [
        "firstName",
        "lastName",
        "email",
        "password",
      ];

      for (const field of requiredFields) {
        if (!httpRequest.body.hasOwnProperty(field)) {
          return {
            statusCode: 400,
            body: `Missing param: ${field}`,
          };
        }
      }

      const { firstName, lastName, email, password } = httpRequest.body;

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

      const user = await this.createUserRepository.createUser({
        firstName,
        lastName,
        email,
        password,
      });

      return {
        statusCode: 201,
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
