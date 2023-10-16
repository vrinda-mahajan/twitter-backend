import { User } from "./auth-model";

export interface SetUsernameParams {
  username: string;
}

export interface SetUsernameResponse {
  user: User;
}

export interface DeleteUserResponse {
  reactionsDeleted: number;
  postsDeleted: number;
  attachmentsDeleted: number;
  profilesDeleted: number;
  usersDeleted: number;
  followsDeleted: number;
}
