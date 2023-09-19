import { Permission } from "../../../models/permissions";
import { Role } from "../../../models/roles";
import { User } from "../../../models/users";
import { error, success } from "../../helpers";
import { HttpRequest, IController } from "../../protocols";

export interface IGetUsersRepository {
  getUsers(
    page: number,
    itemsPerPage: number,
    search?: string
  ): Promise<{ users: User[]; totalItems: number }>;
  getUserById(userId: string): Promise<User | null>;
  getRolesForUser(userId: string): Promise<Role | null>;
  getPermissionsForUser(userId: string[]): Promise<Permission[]>;
}

export class GetUsersController implements IController {
  constructor(private readonly getUsersRepository: IGetUsersRepository) {}

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
        const user = await this.getUsersRepository.getUserById(search);
        if (user) {
          return success({ user });
        }
      }

      const { users, totalItems } = await this.getUsersRepository.getUsers(
        page,
        itemsPerPage,
        search
      );

      const usersWithRolesAndPermissions = await Promise.all(
        users.map(async (user) => {
          const roles = await this.getUsersRepository.getRolesForUser(
            user.roles
          );
          const permissions =
            await this.getUsersRepository.getPermissionsForUser(
              user.permissions.map((permission) => permission)
            );

          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar_url: user.avatar_url,
            roles: {
              title: roles && roles.title,
              description: roles && roles.description,
            },
            permissions: permissions.map((permission: Permission) => {
              return {
                title: permission.title,
                key: permission.key,
              };
            }),
          };
        })
      );
      return success({
        page,
        itemsPerPage,
        totalItems,
        users: usersWithRolesAndPermissions,
      });
    } catch (err) {
      return error("Ocorreu um erro.", 500);
    }
  }
}
