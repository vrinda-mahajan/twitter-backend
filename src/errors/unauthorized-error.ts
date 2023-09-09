import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom-api-errors";

export class UnauthorizedError extends CustomApiError{
    constructor(message: string="Invalid Credentials"){
        super(message, StatusCodes.UNAUTHORIZED);
        Object.setPrototypeOf(this, new.target.prototype); // to ensure correct prototype chaining
    }
}