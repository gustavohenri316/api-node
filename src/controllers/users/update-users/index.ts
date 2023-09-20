import I18n from "../../../i18n";
import { User } from "../../../models/users";
import { error, success } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";

export interface UpdateUserParams {
  id: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  email?: string;
  password?: string;
  avatar_url?: string;
  roles?: string;
  permissions?: Array<string>;
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
        return error(I18n.__("body.is.required"));
      }

      if (!id) {
        return error(I18n.__("missing.id", { field: "User" }));
      }
      const allowedFieldsTtoUpdate: (keyof UpdateUserParams)[] = [
        "firstName",
        "lastName",
        "email",
        "password",
        "avatar_url",
        "roles",
        "isActive",
        "permissions",
      ];

      const someFieldIsNotAllowedToUpdate = Object.keys(body).some(
        (key) => !allowedFieldsTtoUpdate.includes(key as keyof UpdateUserParams)
      );
      if (someFieldIsNotAllowedToUpdate) {
        return error(I18n.__("some.field.is.not.allowed.to.update"));
      }
      const user = await this.updateUserRepository.updateUser(id, body);
      return success(user);
    } catch (err) {
      return error(I18n.__("something.went.wrong"), 500);
    }
  }
}
