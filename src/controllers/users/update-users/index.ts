import { User } from "../../../models/users";
import { HttpRequest, HttpResponse, IUserController } from "../../protocols";

export interface UpdateUserParams {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  avatar_url?: string;
}

export interface IUpdateUserRepository {
  updateUser(id: string, params: UpdateUserParams): Promise<User>;
}

export class UpdateUserController implements IUserController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}
  async handle(
    httpRequest: HttpRequest<UpdateUserParams>
  ): Promise<HttpResponse<User | string>> {
    try {
      const id = httpRequest?.params?.id;
      const body = httpRequest?.body;

      if (!body) {
        return {
          statusCode: 400,
          body: "Body is required",
        };
      }

      if (!id) {
        return {
          statusCode: 400,
          body: "Missing user id",
        };
      }
      const allowedFieldsTtoUpdate: (keyof UpdateUserParams)[] = [
        "firstName",
        "lastName",
        "email",
        "password",
        "avatar_url",
      ];

      const someFieldIsNotAllowedToUpdate = Object.keys(body).some(
        (key) => !allowedFieldsTtoUpdate.includes(key as keyof UpdateUserParams)
      );

      if (someFieldIsNotAllowedToUpdate) {
        return {
          statusCode: 400,
          body: "Some field is not allowed to update",
        };
      }
      const user = await this.updateUserRepository.updateUser(id, body);

      return {
        statusCode: 200,
        body: user,
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: "Something went wrong.",
      };
    }
  }
}
