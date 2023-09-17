import { User } from "../../../models/users";
import { error, success } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";

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

export class UpdateUserController implements IController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}
  async handle(
    httpRequest: HttpRequest<UpdateUserParams>
  ): Promise<HttpResponse<User | string>> {
    try {
      const id = httpRequest?.params?.id;
      const body = httpRequest?.body;

      if (!body) {
        return error("Body is required");
      }

      if (!id) {
        return error("Missing user id");
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
        return error("Some field is not allowed to update");
      }
      const user = await this.updateUserRepository.updateUser(id, body);
      return success(user);
    } catch (err) {
      return error("Something went wrong.", 500);
    }
  }
}
