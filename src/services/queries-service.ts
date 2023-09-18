import Post from "../db/models/post";
import { PostType, Post as TSOAPostModel } from "./models/post-model";
import { PostsResponse, QueryPostsParams } from "./models/queries-model";

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
}
