import { Request as ExpressRequest } from "express";
import { StatusCodes } from "http-status-codes";
import {
  CreatePostParams,
  Post as PostModel,
} from "../services/models/post-model";
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
}
