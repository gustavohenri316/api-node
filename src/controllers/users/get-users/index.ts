import { User } from "../../../models/users";
import { error, success } from "../../helpers";
import { IController } from "../../protocols";

export interface IGetUsersRepository {
  getUsers(): Promise<User[]>;
}

export class GetUsersController implements IController {
  constructor(private readonly getUsersRepository: IGetUsersRepository) {}
  async handle() {
    try {
      const users = await this.getUsersRepository.getUsers();
      return success(users);
    } catch (err) {
      return error("Something went wrong.", 500);
    }
  }
}
