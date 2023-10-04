import { Request as ExpressRequest } from "express";
import { Follow, FollowsResponse } from "../services/models/follow-model";
import {
  Controller,
  Delete,
  Get,
  OperationId,
  Path,
  Post,
  Query,
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

  @Delete("/{userId}")
  @OperationId("unfollowUser")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.BAD_REQUEST, "Bad Request")
  public async unfollowUser(
    @Request() request: ExpressRequest,
    @Path() userId: string
  ): Promise<Follow> {
    const user = request.user as AuthenticatedUser;
    const followerUserId = user.id;
    const followingUserId = userId;
    return new FollowService().unfollowUser({
      followerUserId,
      followingUserId,
    });
  }

  @Get("/{userId}/following")
  @OperationId("getUserFollowing")
  @Security("jwt")
  @Response(StatusCodes.OK)
  public async getUserFollowing(
    @Path() userId: string,
    @Query() resultsPerPage?: number,
    @Query() page?: number
  ): Promise<FollowsResponse> {
    return new FollowService().getUserFollowing({
      userId,
      resultsPerPage,
      page,
    });
  }
}
