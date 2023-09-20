import validator from "validator";
import { User } from "../../../models/users";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import bcrypt from "bcrypt";
import { created, error } from "../../helpers";
import I18n from "../../../i18n";

export interface CreateUserParams {
  firstName: string;
  isActive: boolean;
  lastName: string;
  email: string;
  password: string;
  avatar_url: string;
  roles?: string;
  permissions?: Array<string>;
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
        if (!httpRequest?.body?.[field as keyof CreateUserParams]) {
          return error(I18n.__("field.is.required", { field: field }));
        }
      }

      const emailIsValid = validator.isEmail(httpRequest?.body!.email);
      if (!emailIsValid) {
        return error(
          I18n.__("email.is.invalid", { email: httpRequest?.body!.email })
        );
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
    } catch (err) {
      return error(I18n.__("something.went.wrong"), 500);
    }
  }
}
