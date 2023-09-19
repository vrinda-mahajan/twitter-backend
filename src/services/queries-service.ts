import Reaction from "../db/models/reaction";
import Post from "../db/models/post";
import {
  PostType,
  Post as TSOAPostModel,
  Reaction as TSOAReactionModel,
} from "./models/post-model";
import {
  GetRepliesParams,
  GetUserReactionsParams,
  PostStatsResponse,
  PostsResponse,
  QueryPostsParams,
  ReactionsResponse,
} from "./models/queries-model";

const { min, max, ceil } = Math;

export default class QueriesService {
  public async queryPosts(
    params: QueryPostsParams,
    requestUserId: string
  ): Promise<PostsResponse> {
    const userId = params.userId || requestUserId;
    const resultsPerPage = min(params.resultsPerPage ?? 10, 100);
    const page = params.page ?? 0;
    const type = params.type || PostType.post;

    const skip = page * resultsPerPage;
    const posts = await Post.find({ userId, type }, null, {
      skip: skip,
      limit: resultsPerPage,
      sort: { createdAt: -1 },
    });

    const totalPosts = await Post.countDocuments({ userId, type });
    const remainingCount = max(totalPosts - (page + 1) * resultsPerPage, 0);
    const remainingPages = ceil(remainingCount / resultsPerPage);

    return {
      remainingCount: remainingCount,
      remainingPages: remainingPages,
      count: posts.length,
      posts: posts.map((post) => post.toJSON() as TSOAPostModel),
    };
  }

  public async getReplies(params: GetRepliesParams): Promise<PostsResponse> {
    const postId = params.postId;
    const resultsPerPage = min(params.resultsPerPage ?? 10, 100);
    const page = params.page ?? 0;

    const skip = page * resultsPerPage;
    const type = "reply";

    const posts = await Post.find({ originalPostId: postId, type }, null, {
      skip: skip,
      limit: resultsPerPage,
    });

    const totalPosts = await Post.countDocuments({
      originalPostId: postId,
      type,
    });
    const remainingCount = max(totalPosts - (page + 1) * resultsPerPage, 0);
    const remainingPages = ceil(remainingCount / resultsPerPage);
    return {
      remainingCount: remainingCount,
      remainingPages: remainingPages,
      count: posts.length,
      posts: posts.map((post) => post.toJSON() as TSOAPostModel),
    };
  }

  public async getReactions(
    params: GetUserReactionsParams,
    requestUserId: string
  ): Promise<ReactionsResponse> {
    const userId = params.userId || requestUserId;
    const resultsPerPage = min(params.resultsPerPage ?? 10, 100);
    const page = params.page ?? 0;

    const skip = resultsPerPage * page;
    const reactions = await Reaction.find({ userId }, null, {
      skip: skip,
      limit: resultsPerPage,
      sort: { createdAt: -1 },
    });

    const totalReactions = await Reaction.countDocuments({ userId });
    const remainingCount = max(totalReactions - (page + 1) * resultsPerPage, 0);
    const remainingPages = ceil(remainingCount / resultsPerPage);

    return {
      remainingCount: remainingCount,
      remainingPages: remainingPages,
      count: reactions.length,
      reactions: reactions.map(
        (reaction) => reaction.toJSON() as TSOAReactionModel
      ),
    };
  }

  public async getPostStats(postId: string): Promise<PostStatsResponse> {
    const reactionCount = await Reaction.countDocuments({ postId });
    const replyCount = await Post.countDocuments({
      originalPostId: postId,
      type: "reply",
    });
    const repostCount = await Post.countDocuments({
      originalPostId: postId,
      type: "repost",
    });
    return { reactionCount, replyCount, repostCount };
  }
}
