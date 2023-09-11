import User from "../db/models/user";
import { v4 as uuidv4 } from "uuid";
import {
  LoginParams,
  RefreshParams,
  UserAndCredetials,
  UserCreationParams,
} from "./models/auth-model";
import { BadRequestError, UnauthorizedError } from "../errors";
import Blacklist from "../db/models/blacklist";
import { AuthenticatedUser } from "../middleware/models/authenticated-users";
import jwt from "jsonwebtoken";
export default class AuthService {
  public async register(
    params: UserCreationParams
  ): Promise<UserAndCredetials> {
    const user = await User.create(params);
    const uuid = uuidv4();
    const token = user.createJWT(uuid);
    const refresh = user.createRefresh(uuid);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
      token,
      refresh,
    };
  }

  public async login(params: LoginParams): Promise<UserAndCredetials> {
    const user = await User.findOne({ email: params.email });
    if (!user) {
      throw new UnauthorizedError();
    }
    const isCorrectPassword = await user.comparePassword(params.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedError();
    }
    const uuid = uuidv4();
    const token = user.createJWT(uuid);
    const refresh = user.createRefresh(uuid);
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
      token,
      refresh,
    };
  }

  public async logout(jti: string): Promise<void> {
    await Blacklist.create({ object: jti, kind: "jti" });
  }

  public async refresh(
    params: RefreshParams,
    user: AuthenticatedUser
  ): Promise<UserAndCredetials> {
    const decodedRefreshToken = jwt.verify(
      params.refreshToken,
      process.env.REFRESH_SECRET
    ) as {
      userId: string;
      email: string;
      iss: string;
      jti: string;
    };
    if (
      decodedRefreshToken.email === params.email &&
      decodedRefreshToken.email === user.email &&
      decodedRefreshToken.iss === user.iss &&
      decodedRefreshToken.iss === process.env.JWT_ISSUER &&
      decodedRefreshToken.jti === user.jti &&
      decodedRefreshToken.userId === user.id
    ) {
      const isBlacklisted = await Blacklist.findOne({
        object: decodedRefreshToken.jti,
        kind: "jti",
      });
      if (isBlacklisted) {
        throw new UnauthorizedError();
      }

      await Blacklist.create({ object: decodedRefreshToken.jti, kind: "jti" });

      const user = await User.findById(decodedRefreshToken.userId);
      if (!user) {
        throw new BadRequestError();
      }
      const uuid = uuidv4();
      const newToken = user.createJWT(uuid);
      const newRefresh = user.createRefresh(uuid);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
        },
        token: newToken,
        refresh: newRefresh,
      };
    } else {
      throw new UnauthorizedError();
    }
  }
}
