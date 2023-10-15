import { User } from "./auth-model";

export interface SetUsernameParams {
  username: string;
}

export interface SetUsernameResponse {
  user: User;
}
