import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom-api-errors";

export class InvalidMimitypeError extends CustomApiError {
  constructor(message: string = "Invalid Mimetype!") {
    super(message, StatusCodes.BAD_REQUEST);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
