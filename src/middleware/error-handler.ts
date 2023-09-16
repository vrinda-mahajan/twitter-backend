import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const errorMiddlewareHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let customError = {
    message: err.message,
    statusCode: err.statuscode || StatusCodes.INTERNAL_SERVER_ERROR,
  };
  if (err.name === "MongoServerError" && err.code === 11000) {
    customError.message = "User already exists!";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  return res
    .status(customError.statusCode)
    .json({ code: customError.statusCode, message: customError.message });
};

interface Error {
  message: string;
  name: string;
  statuscode?: number;
  code?: number;
}
