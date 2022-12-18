import validator from "validator";
import { prisma } from "../../database/prisma";
import { User } from "../../models/user";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { badRequest, created } from "../utils";
import { CreateUserParams, ICreateUserRepository } from "./protocols";

export class CreateUserController implements IController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}
  async handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User | string>> {
    try {
      if (!httpRequest.body) {
        return badRequest("Missing request body");
      }

      const requiredFields: string[] = [
        "firstName",
        "lastName",
        "email",
        "password",
      ];

      for (const field of requiredFields) {
        if (!httpRequest.body.hasOwnProperty(field)) {
          return badRequest(`${field} is required.`);
        }
      }

      const { firstName, lastName, email, password } = httpRequest.body;

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

      const user = await this.createUserRepository.createUser({
        firstName,
        lastName,
        email,
        password,
      });

      return created<User>(user);
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }
}
