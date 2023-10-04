import { BadRequestError } from "../errors";
import {
  Follow as TSOAFollowModel,
  FollowUnfollowUserParams,
  GetFollowingsOrFollowersUser,
  FollowsResponse,
} from "./models/follow-model";
import Follow from "../db/models/follow";

const { min, max, ceil } = Math;
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

  public async getUserFollowing(
    params: GetFollowingsOrFollowersUser
  ): Promise<FollowsResponse> {
    const { userId } = params;
    const resultsPerPage = min(params.resultsPerPage ?? 10, 100);
    const page = params.page ?? 0;
    const skip = resultsPerPage * page;

    const follows = await Follow.find({ followerUserId: userId }, null, {
      skip: skip,
      limit: resultsPerPage,
      sort: { createdAt: -1 },
    });
    const totalFollows = await Follow.countDocuments({
      followerUserId: userId,
    });

    const remainingCount = max(totalFollows - (page + 1) * resultsPerPage, 0);
    const remainingPages = ceil(remainingCount / resultsPerPage);

    await Promise.all(
      follows.map(async (follow) => {
        await follow.populateFollowingField();
      })
    );

    return {
      remainingCount: remainingCount,
      remainingPages: remainingPages,
      count: follows.length,
      follows: follows.map((follow) => follow.toJSON()),
    };
  }
}
