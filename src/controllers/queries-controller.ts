import { Request as ExpressRequest } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedUser } from "../middleware/models/authenticated-users";
import { PostType } from "../services/models/post-model";
import { PostsResponse } from "../services/models/queries-model";
import QueriesService from "../services/queries-service";
import {
  Controller,
  Get,
  OperationId,
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
}
