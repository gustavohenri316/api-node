import { Role } from "../../../models/roles";
import { error, success } from "../../helpers";
import { IController, HttpRequest, HttpResponse } from "../../protocols";

export interface IDeleteRoleRepository {
  deleteRole(id: string): Promise<Role>;
}
export interface IDeleteRoleParams {
  id: string;
}

export class DeleteRoleController implements IController {
  constructor(private readonly deleteRoleRepository: IDeleteRoleRepository) {}
  async handle(
    httpRequest: HttpRequest<IDeleteRoleParams>
  ): Promise<HttpResponse<Role>> {
    try {
      const id = httpRequest?.params?.id;
      if (!id) {
        return error("Id is required");
      }
      const Role = await this.deleteRoleRepository.deleteRole(id);
      return success(Role);
    } catch (err) {
      return error("Something went wrong.", 500);
    }
  }
}
