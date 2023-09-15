import { User } from "../../../models/users";
import { IUserController } from "../../protocols";

export interface IGetUsersRepository {
  getUsers(): Promise<User[]>;
}

export class GetUsersController implements IUserController {
  constructor(private readonly getUsersRepository: IGetUsersRepository) {}
  async handle() {
    try {
      const users = await this.getUsersRepository.getUsers();
      return {
        statusCode: 200,
        body: users,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: "Something went wrong.",
      };
    }
  }
}
