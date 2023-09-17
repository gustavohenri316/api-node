import { User } from "../../../models/users";
import { error, success } from "../../helpers";
import { HttpRequest, IController } from "../../protocols";

export interface IGetUsersRepository {
  getUsers(
    page: number,
    itemsPerPage: number
  ): Promise<{ users: User[]; totalItems: number }>;
}

export class GetUsersController implements IController {
  constructor(private readonly getUsersRepository: IGetUsersRepository) {}

  async handle(
    httpRequest: HttpRequest<{ page: number; itemsPerPage: number }>
  ) {
    try {
      const { page, itemsPerPage } = httpRequest.params || {
        page: 1,
        itemsPerPage: 10,
      };
      const { users, totalItems } = await this.getUsersRepository.getUsers(
        page,
        itemsPerPage
      );
      return success({ page, itemsPerPage, totalItems, users });
    } catch (err) {
      return error("Something went wrong.", 500);
    }
  }
}
