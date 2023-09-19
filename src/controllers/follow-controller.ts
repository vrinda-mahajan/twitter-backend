import { Request as ExpressRequest } from "express";
import { Follow } from "../services/models/follow-model";
import {
  Controller,
  OperationId,
  Path,
  Post,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";
import { AuthenticatedUser } from "../middleware/models/authenticated-users";
import FollowService from "../services/follow-service";
import { StatusCodes } from "http-status-codes";

@Route("/api/v1/follow")
@Tags("Follow")
export class FollowController extends Controller {
  @Post("/{userId}")
  @OperationId("followUser")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.BAD_REQUEST, "Bad Request")
  public async followUser(
    @Request() request: ExpressRequest,
    @Path() userId: string
  ): Promise<Follow> {
    const user = request.user as AuthenticatedUser;
    const followerUserId = user.id;
    const followingUserId = userId;
    return new FollowService().followUser({
      followerUserId,
      followingUserId,
    });
  }
}
