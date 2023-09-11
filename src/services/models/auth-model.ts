export interface UserCreationParams {
  name: string;
  email: string;
  password: string;
  username: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

export interface UserAndCredetials {
  user: User;
  token: string;
  refresh: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RefreshParams {
  email: string;
  refreshToken: string;
}
