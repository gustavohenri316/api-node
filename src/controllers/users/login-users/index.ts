import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../../models/users";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { error, success } from "../../helpers";
import I18n from "../../../i18n";

export interface LoginParams {
  email: string;
  password: string;
}
export interface ILoginRepository {
  getUserByEmail(email: string): Promise<User | null>;
}
export class LoginController implements IController {
  constructor(private readonly loginRepository: ILoginRepository) {}
  async handle(
    httpRequest: HttpRequest<LoginParams>
  ): Promise<HttpResponse<string>> {
    try {
      const body = httpRequest?.body;
      if (!body) {
        return error("Bad Request");
      }
      const user = await this.loginRepository.getUserByEmail(body.email);
      if (!user) {
        return error("Authentication failed", 401);
      }
      if (!user.isActive) {
        return error("User is not active", 401);
      }
      const passwordMatch = await bcrypt.compare(body.password, user.password);
      if (!passwordMatch) {
        return error("Authentication failed", 401);
      }
      const token = jwt.sign(
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar_url: user.avatar_url,
        },
        "your-secret-key",
        { expiresIn: "1h" }
      );

      const send = {
        token,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      };
      return success(send);
    } catch (err) {
      return error(I18n.__("something.went.wrong"), 500);
    }
  }
}
