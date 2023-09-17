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
      const userId = httpRequest?.body?.userId;

      console.log(userId);

      if (!userId) {
        return error("User id is missing", 401);
      }

      const requiredFields = ["title", "description"];

      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof CreateRolesParams]?.length) {
          return error(`Field ${field} is required`);
        }
      }

      const roles = await this.createRolesRepository.createRoles(
        httpRequest.body!
      );
      return created(roles);
    } catch (error) {
      return {
        statusCode: 500,
        body: "Something went wrong",
      };
    }
  }
}
