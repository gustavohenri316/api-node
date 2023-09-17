import validator from "validator";
import { User } from "../../../models/users";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import bcrypt from "bcrypt";
import { created, error } from "../../helpers";

export interface CreateUserParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar_url: string;
}

export interface ICreateUserRepository {
  createUser(params: CreateUserParams): Promise<User>;
}
export class CreateUserController implements IController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User>> {
    try {
      const requiredFields = ["firstName", "lastName", "email", "password"];

      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof CreateUserParams]?.length) {
          return error(`Field ${field} is required`);
        }
      }

      const emailIsValid = validator.isEmail(httpRequest?.body!.email);
      if (!emailIsValid) {
        return error(`Email ${httpRequest?.body!.email} is invalid`);
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        httpRequest.body!.password,
        saltRounds
      );

      httpRequest.body!.password = hashedPassword;

      const user = await this.createUserRepository.createUser(
        httpRequest.body!
      );
      return created(user);
    } catch (error) {
      return {
        statusCode: 500,
        body: "Something went wrong",
      };
    }
  }
}
