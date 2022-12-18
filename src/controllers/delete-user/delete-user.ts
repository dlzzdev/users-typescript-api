import { User } from "../../models/user";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { badRequest, ok, serverError } from "../utils";
import { IDeleteUserRepository } from "./protocols";

export class DeleteUserController implements IController {
  constructor(private readonly deleteUserRepository: IDeleteUserRepository) {}
  async handle(
    httpRequest: HttpRequest<any>
  ): Promise<HttpResponse<User | string>> {
    try {
      const { id } = httpRequest.params;

      if (!id) {
        return badRequest("Missing user id");
      }

      const user = await this.deleteUserRepository.deleteUser(id);
      return ok<User>(user);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
