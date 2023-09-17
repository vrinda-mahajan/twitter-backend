import {
  InvalidInputError,
  OriginalPostIdMissingError,
  PostNotFoundError,
} from "../errors";
import Post from "../db/models/post";
import {
  CreatePostParams,
  CreateReactionParams,
  PostType,
  Reaction as TSOAReactionModel,
  Post as TSOAPostModel,
} from "./models/post-model";
import Reaction from "../db/models/reaction";

export default class PostService {
  public async createPost(
    userId: string,
    params: CreatePostParams
  ): Promise<TSOAPostModel> {
    switch (params.type) {
      case PostType.post: {
        const newPost = await Post.create({
          userId,
          text: params.text,
          type: params.type,
        });
        return newPost.toJSON() as TSOAPostModel;
      }
      case PostType.repost:
      case PostType.reply: {
        if (!params.originalPostId || params.originalPostId === "") {
          throw new OriginalPostIdMissingError();
        }
        const newPost = await Post.create({
          userId,
          text: params.text,
          type: params.type,
          originalPostId: params.originalPostId,
        });
        return newPost.toJSON() as TSOAPostModel;
      }
      default:
        throw new InvalidInputError("type", "PostType");
    }
  }

  public async reactToPost(
    userId: string,
    postId: string,
    params: CreateReactionParams
  ): Promise<TSOAReactionModel> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new PostNotFoundError();
    }
    const query = { userId, postId };
    const reaction = await Reaction.findOneAndUpdate(
      query,
      { userId, postId, type: params.type },
      { upsert: true, new: true }
    );
    return reaction.toJSON() as TSOAReactionModel;
  }
}
