import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom-api-errors";

export class OriginalPostIdMissingError extends CustomApiError {
  constructor(message: string = "Original PostId is missing.") {
    super(message, StatusCodes.BAD_REQUEST);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
