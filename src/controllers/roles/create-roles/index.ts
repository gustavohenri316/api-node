import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { created, error } from "../../helpers";
import { Role } from "../../../models/roles";
import I18n from "../../../i18n";

export interface CreateRolesParams {
  userId: string;
  title: string;
  description: string;
}

export interface ICreateRolesRepository {
  createRoles(params: CreateRolesParams): Promise<Role>;
}

export class CreateRolesController implements IController {
  constructor(private readonly createRolesRepository: ICreateRolesRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateRolesParams>
  ): Promise<HttpResponse<Role>> {
    try {
      const { userId, title, description } = httpRequest.body || {};

      if (!userId || !title || !description) {
        return error(
          I18n.__("user.id.title.and.description.are.required"),
          400
        );
      }

      const roles = await this.createRolesRepository.createRoles({
        userId,
        title,
        description,
      });

      return created(roles);
    } catch (err) {
      return error(I18n.__("something.went.wrong"), 500);
    }
  }
}
