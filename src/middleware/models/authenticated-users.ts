export interface AuthenticatedUser {
  id: string;
  email: string;
  jti: string;
  iss: string;
}
