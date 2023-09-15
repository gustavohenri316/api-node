import { User } from "../../../models/users";
import { HttpRequest, HttpResponse } from "../../protocols";

export interface UpdateUserParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  avatar_url?: string;
}

export interface IUpdateUserController {
  handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<User>>;
}

export interface IUpdateUserRepository {
  updateUser(id: string, params: UpdateUserParams): Promise<User>;
}

export class UpdateUserController implements IUpdateUserController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}
  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<User>> {
    try {
      const id = httpRequest?.params?.id;
      const body = httpRequest?.body;

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
