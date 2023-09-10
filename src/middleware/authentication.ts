import { Request } from "express";
import { AuthenticatedUser } from "./models/authenticated-users";
import jwt from "jsonwebtoken";
import Blacklist from "../db/models/blacklist";
import { UnauthorizedError } from "../errors";

export async function expressAuthentication(
  req: Request,
  securityName: string,
  _scopes?: string[]
): Promise<AuthenticatedUser> {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new UnauthorizedError();
  }
  const isBearer = authHeader.startsWith("Bearer ");
  if (!authHeader || !isBearer) {
    throw new UnauthorizedError();
  }
  const token = authHeader.split(" ")[1];
  if (securityName === "jwt") {
    try {
      return await jwtAuth(token, false);
    } catch (error) {
      throw new UnauthorizedError();
    }
  } else if (securityName === "jwt_without_verification") {
    try {
      return await jwtAuth(token, true);
    } catch (error) {
      throw new UnauthorizedError();
    }
  } else {
    throw new UnauthorizedError();
  }
}

async function jwtAuth(
  token: string,
  ignoreExpiration: boolean = false
): Promise<AuthenticatedUser> {
  const decoded = jwt.verify(token, process.env.JWT_SECRET, {
    ignoreExpiration: ignoreExpiration,
  }) as {
    userId: string;
    email: string;
    jti: string;
    iss: string;
  };
  const jti = decoded.jti;
  const blacklisted = await Blacklist.findOne({ object: jti, kind: "jti" });
  if (blacklisted) {
    throw new UnauthorizedError();
  }

  const user: AuthenticatedUser = {
    id: decoded.userId,
    email: decoded.email,
    jti: jti,
    iss: decoded.iss,
  };
  return user;
}
