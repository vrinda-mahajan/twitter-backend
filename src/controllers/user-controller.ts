import { Request as ExpressRequest } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedUser } from "../middleware/models/authenticated-users";
import {
  SetUsernameParams,
  SetUsernameResponse,
} from "../services/models/user-models";
import UserService from "../services/user-service";
import {
  Body,
  Controller,
  OperationId,
  Post,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";

@Route("/api/v1/user")
@Tags("User")
export class UserController extends Controller {
  /**
   * Set the username of the authenticated user.
   */
  @Post("/username")
  @OperationId("setUsername")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.BAD_REQUEST, "Bad Request")
  @Security("jwt")
  public async setUsername(
    @Request() request: ExpressRequest,
    @Body() params: SetUsernameParams
  ): Promise<SetUsernameResponse> {
    const { id: userId } = request.user as AuthenticatedUser;

    return new UserService().setUsername(userId, params);
  }
}