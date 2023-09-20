import I18n from "../../../i18n";
import { Role } from "../../../models/roles";
import { error, success } from "../../helpers";
import { IController, HttpRequest, HttpResponse } from "../../protocols";

export interface UpdateRoleParams {
  id: string;
  title?: string;
  description?: string;
}

export interface IUpdateRoleRepository {
  updateRole(id: string, params: UpdateRoleParams): Promise<Role>;
}

export class UpdateRoleController implements IController {
  constructor(private readonly updateRoleRepository: IUpdateRoleRepository) {}
  async handle(
    httpRequest: HttpRequest<UpdateRoleParams>
  ): Promise<HttpResponse<Role | string>> {
    try {
      const id = httpRequest?.params?.id;
      const body = httpRequest?.body;

      if (!body) {
        return error(I18n.__("body.is.required"));
      }

      if (!id) {
        return error(I18n.__("missing.id", { field: "Role" }));
      }
      const allowedFieldsTtoUpdate: (keyof UpdateRoleParams)[] = [
        "title",
        "description",
      ];

      const someFieldIsNotAllowedToUpdate = Object.keys(body).some(
        (key) => !allowedFieldsTtoUpdate.includes(key as keyof UpdateRoleParams)
      );

      if (someFieldIsNotAllowedToUpdate) {
        return error(I18n.__("some.field.is.not.allowed.to.update"));
      }
      const Role = await this.updateRoleRepository.updateRole(id, body);
      return success(Role);
    } catch (err) {
      return error(I18n.__("something.went.wrong"), 500);
    }
  }
}
