import { User } from "../../../models/users";
import { IUserController, HttpRequest, HttpResponse } from "../../protocols";

export interface IDeleteUserRepository {
  deleteUser(id: string): Promise<User>;
}

export interface IDeleteUserParams {
  id: string;
}

export class DeleteUserController implements IUserController {
  constructor(private readonly deleteUserRepository: IDeleteUserRepository) {}
  async handle(
    httpRequest: HttpRequest<IDeleteUserParams>
  ): Promise<HttpResponse<User>> {
    try {
      const id = httpRequest?.params?.id;

      if (!id) {
        return {
          statusCode: 400,
          body: {
            error: "Id is required",
          },
        };
      }

      const user = await this.deleteUserRepository.deleteUser(id);

      return {
        statusCode: 200,
        body: user,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: "Something went wrong.",
      };
    }
  }
}
