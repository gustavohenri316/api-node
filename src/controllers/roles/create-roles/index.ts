import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { created, error } from "../../helpers";
import { Role } from "../../../models/roles";

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
        return error("User id, title, and description are required", 400);
      }

      const roles = await this.createRolesRepository.createRoles({
        userId,
        title,
        description,
      });

      return created(roles);
    } catch (error) {
      return {
        statusCode: 500,
        body: "Something went wrong",
      };
    }
  }
}
