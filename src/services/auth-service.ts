import User from "../db/models/user";
import { v4 as uuidv4 } from "uuid";
import { UserAndCredetials, UserCreationParams } from "./models/auth-model";

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
}
