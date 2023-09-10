import User from "../db/models/user";
import { v4 as uuidv4 } from "uuid";
import {
  LoginParams,
  UserAndCredetials,
  UserCreationParams,
} from "./models/auth-model";
import { UnauthorizedError } from "../errors";
import Blacklist from "../db/models/blacklist";

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
}
