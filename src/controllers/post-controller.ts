import { Request as ExpressRequest } from "express";
import { StatusCodes } from "http-status-codes";
import {
  CreatePostParams,
  CreateReactionParams,
  Post as PostModel,
  Reaction as ReactionModel,
} from "../services/models/post-model";
import {
  Body,
  Controller,
  Delete,
  OperationId,
  Path,
  Post,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";
import PostService from "../services/post-service";
import { AuthenticatedUser } from "../middleware/models/authenticated-users";

@Route("/api/v1/posts")
@Tags("Posts")
export class PostsController extends Controller {
  @Post("")
  @OperationId("createPost")
  @Security("jwt")
  @Response(StatusCodes.CREATED)
  @Response(StatusCodes.BAD_REQUEST, "Original PostId is missing.")
  public async createPost(
    @Request() request: ExpressRequest,
    @Body() body: CreatePostParams
  ): Promise<PostModel> {
    this.setStatus(StatusCodes.CREATED);
    const user = request.user as AuthenticatedUser;
    return new PostService().createPost(user.id, body);
  }

  @Post("/react/{postId}")
  @OperationId("reactToPost")
  @Security("jwt")
  @Response(StatusCodes.CREATED)
  @Response(StatusCodes.NOT_FOUND, "Post not found.")
  public async reactToPost(
    @Path() postId: string,
    @Request() request: ExpressRequest,
    @Body() body: CreateReactionParams
  ): Promise<ReactionModel> {
    const user = request.user as AuthenticatedUser;
    const userId = user.id;
    return new PostService().reactToPost(userId, postId, body);
  }

  @Delete("/react/{postId}")
  @OperationId("unreactToPost")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.NOT_FOUND, "Reaction not found.")
  public async unreactToPost(
    @Path() postId: string,
    @Request() request: ExpressRequest
  ): Promise<ReactionModel> {
    const user = request.user as AuthenticatedUser;
    const userId = user.id;
    return new PostService().unreactToPost(userId, postId);
  }
}
