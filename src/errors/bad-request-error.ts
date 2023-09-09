import { CustomApiError } from "./custom-api-errors";
import { StatusCodes } from "http-status-codes";

export class BadRequestError extends CustomApiError {
  constructor(message: string = "Bad Request") {
    super(message, StatusCodes.BAD_REQUEST);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
