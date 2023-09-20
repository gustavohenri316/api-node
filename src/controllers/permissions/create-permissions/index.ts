import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { created, error } from "../../helpers";
import { Permission } from "../../../models/permissions";

export interface CreatePermissionsParams {
  userId: string;
  title: string;
  description: string;
}

export interface ICreatePermissionsRepository {
  createPermissions(params: CreatePermissionsParams): Promise<Permission>;
}

export class CreatePermissionsController implements IController {
  constructor(
    private readonly createPermissionsRepository: ICreatePermissionsRepository
  ) {}

  async handle(
    httpRequest: HttpRequest<CreatePermissionsParams>
  ): Promise<HttpResponse<Permission>> {
    try {
      const { userId, title, description } = httpRequest.body || {};
      if (!userId || !title || !description) {
        return error("User id, title, and description are required", 400);
      }
      const Permissions =
        await this.createPermissionsRepository.createPermissions({
          userId,
          title,
          description,
        });
      return created(Permissions);
    } catch (err) {
      return error("Something went wrong", 500);
    }
  }
}
