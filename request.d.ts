import { AuthenticatedUser } from "src/middleware/models/authenticated-users";

declare global {
  namespace Express {
    export interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
