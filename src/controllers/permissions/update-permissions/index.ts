import I18n from "../../../i18n";
import { Permission } from "../../../models/permissions";

import { error, success } from "../../helpers";
import { IController, HttpRequest, HttpResponse } from "../../protocols";

export interface UpdatePermissionParams {
  id: string;
  title?: string;
  description?: string;
}

export interface IUpdatePermissionRepository {
  updatePermission(
    id: string,
    params: UpdatePermissionParams
  ): Promise<Permission>;
}

export class UpdatePermissionController implements IController {
  constructor(
    private readonly updatePermissionRepository: IUpdatePermissionRepository
  ) {}
  async handle(
    httpRequest: HttpRequest<UpdatePermissionParams>
  ): Promise<HttpResponse<Permission | string>> {
    try {
      const id = httpRequest?.params?.id;
      const body = httpRequest?.body;

      if (!body) {
        return error(I18n.__("body.is.required"));
      }

      if (!id) {
        return error(I18n.__("missing.id", { field: "Permission" }));
      }
      const allowedFieldsTtoUpdate: (keyof UpdatePermissionParams)[] = [
        "title",
        "description",
      ];

      const someFieldIsNotAllowedToUpdate = Object.keys(body).some(
        (key) =>
          !allowedFieldsTtoUpdate.includes(key as keyof UpdatePermissionParams)
      );

      if (someFieldIsNotAllowedToUpdate) {
        return error(I18n.__("some.field.is.not.allowed.to.update"));
      }
      const Permission = await this.updatePermissionRepository.updatePermission(
        id,
        body
      );
      return success(Permission);
    } catch (err) {
      return error(I18n.__("something.went.wrong"), 500);
    }
  }
}
