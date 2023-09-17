import { User } from "../../../models/users";
import { error, success } from "../../helpers";
import { IController, HttpRequest, HttpResponse } from "../../protocols";

export interface IDeleteUserRepository {
  deleteUser(id: string): Promise<User>;
}
export interface IDeleteUserParams {
  id: string;
}

export class DeleteUserController implements IController {
  constructor(private readonly deleteUserRepository: IDeleteUserRepository) {}
  async handle(
    httpRequest: HttpRequest<IDeleteUserParams>
  ): Promise<HttpResponse<User>> {
    try {
      const id = httpRequest?.params?.id;
      if (!id) {
        return error("Id is required");
      }
      const user = await this.deleteUserRepository.deleteUser(id);
      return success(user);
    } catch (err) {
      return error("Something went wrong.", 500);
    }
  }
}
