import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom-api-errors";

export class InvalidInputError extends CustomApiError {
  constructor(inputName: string, expectedValue?: any) {
    let message = `Invalid input: ${inputName}`;
    console.log("message",message)
    if (expectedValue) {
      message += ` (expected ${expectedValue})`;
    }
    super(message, StatusCodes.BAD_REQUEST);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
