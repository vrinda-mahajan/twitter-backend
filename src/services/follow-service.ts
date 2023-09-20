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

  public async unfollowUser(
    params: FollowUnfollowUserParams
  ): Promise<TSOAFollowModel> {
    const { followerUserId: userId, followingUserId } = params;
    if (userId === followingUserId) {
      throw new BadRequestError();
    }

    const deletedFollow = await Follow.findOneAndDelete(params);
    if (!deletedFollow) {
      throw new BadRequestError("You are not following this user.");
    }
    return deletedFollow.toJSON() as TSOAFollowModel;
  }
}
