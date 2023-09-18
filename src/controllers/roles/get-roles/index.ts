import { Role } from "../../../models/roles";
import { success, error } from "../../helpers";
import { IController, HttpRequest } from "../../protocols";

export interface IGetRolesRepository {
  getRoles(
    page: number,
    itemsPerPage: number,
    search?: string
  ): Promise<{ roles: Role[]; totalItems: number }>;

  getRoleById(RoleId: string): Promise<Role | null>;
}

export class GetRolesController implements IController {
  constructor(private readonly getRolesRepository: IGetRolesRepository) {}
  async handle(
    httpRequest: HttpRequest<{
      page: number;
      itemsPerPage: number;
      search?: string;
    }>
  ) {
    try {
      const {
        page = 1,
        itemsPerPage = 10,
        search = "",
      } = httpRequest.params || {};

      if (search.length === 24) {
        const Role = await this.getRolesRepository.getRoleById(search);
        if (Role) {
          return success({ Role });
        }
      }

      const { roles, totalItems } = await this.getRolesRepository.getRoles(
        page,
        itemsPerPage,
        search
      );

      return success({
        page,
        itemsPerPage,
        totalItems,
        roles,
      });
    } catch (err) {
      return error("Something went wrong.", 500);
    }
  }
}
