import { User } from "./auth-model";

export interface Follow {
  followerUserId: string;
  followingUserId: string;
  follower?: User;
  following?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface FollowUnfollowUserParams {
  followerUserId: string;
  followingUserId: string;
}
