import User from "../db/models/user";
import { SetUsernameParams, SetUsernameResponse } from "./models/user-models";
import { BadRequestError } from "../errors";

export default class UserService {
  public async setUsername(
    userId: string,
    params: SetUsernameParams
  ): Promise<SetUsernameResponse> {
    const user = await User.findByIdAndUpdate(
      userId,
      { username: params.username },
      { new: true, runValidators: true, select: "-password" }
    );
    if (!user) {
      throw new BadRequestError();
    }
    return { user: user.toJSON() };
  }
}
