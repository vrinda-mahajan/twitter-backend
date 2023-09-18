import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { StatusCodes } from "http-status-codes";
import {
  Attachment as AttachmentModel,
  CreatePostParams,
  CreateReactionParams,
  Post as PostModel,
  Reaction as ReactionModel,
} from "../services/models/post-model";
import {
  Body,
  Controller,
  Delete,
  Get,
  OperationId,
  Patch,
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

  @Patch("/{postId}")
  @OperationId("attachToPost")
  @Security("jwt")
  @Response(StatusCodes.CREATED)
  @Response(
    StatusCodes.INTERNAL_SERVER_ERROR,
    "Could not attach photo to post."
  )
  @Response(StatusCodes.NOT_FOUND, "Post not found.")
  public async attachToPost(
    @Path() postId: string,
    @Request() request: ExpressRequest
  ): Promise<AttachmentModel> {
    const user = request.user as AuthenticatedUser;
    const userId = user.id;
    return new PostService().attachToPost(userId, postId, request as any);
  }

  @Get("/attachment/{postId}")
  @OperationId("getPostAttachment")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.NOT_FOUND, "Attachment not found.")
  public async getPostAttachment(
    @Path() postId: string,
    @Request() request: ExpressRequest
  ): Promise<void> {
    const photoInfo = await new PostService().getPostAttachment(postId);
    const response = request.res as ExpressResponse;
    return new Promise<void>((resolve, reject) => {
      response.sendFile(photoInfo.photoName, photoInfo.options, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  @Delete("/{postId}")
  @OperationId("deletePost")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.NOT_FOUND, "Post not found.")
  public async deletePost(
    @Path() postId: string,
    @Request() request: ExpressRequest
  ): Promise<PostModel> {
    const user = request.user as AuthenticatedUser;
    const userId = user.id;
    return new PostService().deletePost(userId, postId);
  }
}
