import { Permission } from "../../../models/permissions";
import { success, error } from "../../helpers";
import { IController, HttpRequest } from "../../protocols";

export interface IGetPermissionsRepository {
  getPermissions(
    page: number,
    itemsPerPage: number,
    search?: string
  ): Promise<{ Permissions: Permission[]; totalItems: number }>;

  getPermissionById(PermissionId: string): Promise<Permission | null>;
  getUserInfo(
    userId: string
  ): Promise<{ firstName: string; lastName: string; email: string } | null>;
}
export class GetPermissionsController implements IController {
  constructor(
    private readonly getPermissionsRepository: IGetPermissionsRepository
  ) {}
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
        const Permission =
          await this.getPermissionsRepository.getPermissionById(search);

        if (Permission) {
          const userInfo = await this.getPermissionsRepository.getUserInfo(
            Permission.createdBy as unknown as string
          );

          if (userInfo) {
            Permission.createdBy = userInfo;
            return success({ Permission });
          }
        }
      }

      const { Permissions, totalItems } =
        await this.getPermissionsRepository.getPermissions(
          page,
          itemsPerPage,
          search
        );

      Permissions.forEach(async (Permission) => {
        const userInfo = await this.getPermissionsRepository.getUserInfo(
          Permission.createdBy as unknown as string
        );
        if (userInfo) {
          Permission.createdBy = userInfo;
        }
      });

      return success({
        page,
        itemsPerPage,
        totalItems,
        Permissions,
      });
    } catch (err) {
      return error("Something went wrong.", 500);
    }
  }
}
