import { BadRequestError } from "../errors";
import {
  Follow as TSOAFollowModel,
  FollowUnfollowUserParams,
} from "./models/follow-model";
import Follow from "../db/models/follow";

export default class FollowService {
  public async followUser(
    params: FollowUnfollowUserParams
  ): Promise<TSOAFollowModel> {
    const { followerUserId: userId, followingUserId } = params;
    if (userId === followingUserId) {
      throw new BadRequestError();
    }

    const existingFollow = await Follow.findOne({
      followerUserId: userId,
      followingUserId: followingUserId,
    });
    if (existingFollow) {
      throw new BadRequestError("Already following this user.");
    }

    const follow = await Follow.create({
      followerUserId: userId,
      followingUserId: followingUserId,
    });

    return follow.toJSON() as TSOAFollowModel;
  }
}
