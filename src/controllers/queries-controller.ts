import { Request as ExpressRequest } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedUser } from "../middleware/models/authenticated-users";
import { PostType } from "../services/models/post-model";
import {
  PostStatsResponse,
  PostsResponse,
  ReactionsResponse,
} from "../services/models/queries-model";
import QueriesService from "../services/queries-service";
import {
  Controller,
  Get,
  OperationId,
  Path,
  Query,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";

@Route("/api/v1/query")
@Tags("Queries")
export class QueriesController extends Controller {
  @Get("/posts")
  @OperationId("queryPosts")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  public async queryPosts(
    @Request() request: ExpressRequest,
    @Query() userId?: string,
    @Query() resultsPerPage?: number,
    @Query() page?: number,
    @Query() type?: PostType
  ): Promise<PostsResponse> {
    const user = request.user as AuthenticatedUser;
    const resolvedUserId = userId ?? user.id;
    return new QueriesService().queryPosts(
      { userId: resolvedUserId, resultsPerPage, page, type },
      resolvedUserId
    );
  }

  @Get("/replies/{postId}")
  @OperationId("getReplies")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Security("jwt")
  public async getReplies(
    @Path() postId: string,
    @Query() resultsPerPage?: number,
    @Query() page?: number
  ): Promise<PostsResponse> {
    return new QueriesService().getReplies({ postId, resultsPerPage, page });
  }

  @Get("/reactions")
  @OperationId("getReactions")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  public async getReactions(
    @Request() request: ExpressRequest,
    @Query() userId?: string,
    @Query() resultsPerPage?: number,
    @Query() page?: number
  ): Promise<ReactionsResponse> {
    const user = request.user as AuthenticatedUser;
    const resolvedUserId = userId ?? user.id;
    return new QueriesService().getReactions(
      { userId: resolvedUserId, resultsPerPage, page },
      resolvedUserId
    );
  }

  @Get("/stats/{postId}")
  @OperationId("getPostStats")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  public async getPostStats(
    @Path() postId: string
  ): Promise<PostStatsResponse> {
    return new QueriesService().getPostStats(postId);
  }
}
