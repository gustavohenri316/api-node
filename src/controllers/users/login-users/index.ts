// login-controller.ts

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../../models/users";
import { HttpRequest, HttpResponse } from "../../protocols";

export interface ILoginController {
  handle(httpRequest: HttpRequest<LoginParams>): Promise<HttpResponse<string>>;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface ILoginRepository {
  getUserByEmail(email: string): Promise<User | null>;
}

export class LoginController implements ILoginController {
  constructor(private readonly loginRepository: ILoginRepository) {}

  async handle(
    httpRequest: HttpRequest<LoginParams>
  ): Promise<HttpResponse<string>> {
    try {
      const body = httpRequest?.body;

      if (!body) {
        return {
          statusCode: 400,
          body: "Bad Request",
        };
      }

      const user = await this.loginRepository.getUserByEmail(body.email);

      if (!user) {
        return {
          statusCode: 401,
          body: "Authentication failed",
        };
      }

      const passwordMatch = await bcrypt.compare(body.password, user.password);

      if (!passwordMatch) {
        return {
          statusCode: 401,
          body: "Authentication failed",
        };
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

      return {
        statusCode: 200,
        body: {
          token,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar_url: user.avatar_url,
          },
        },
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: "Something went wrong",
      };
    }
  }
}
