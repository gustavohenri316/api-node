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

      const usersNotPassword = users.map((user) => {
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar_url: user.avatar_url,
        };
      });
      return success({
        page,
        itemsPerPage,
        totalItems,
        users: usersNotPassword,
      });
    } catch (err) {
      return error("Something went wrong.", 500);
    }
  }
}
