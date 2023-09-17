import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom-api-errors";

export class InternalServerError extends CustomApiError {
  constructor(message: string = "Bad Request") {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
