import { CustomApiError } from "./custom-api-errors";
import { StatusCodes } from "http-status-codes";

export class UserProfileNotFoundError extends CustomApiError {
  constructor(message: string = "User profile not found!") {
    super(message, StatusCodes.NOT_FOUND);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
