import { Post, PostType } from "./post-model";

export interface QueryPostsParams {
  userId?: string;
  resultsPerPage?: number;
  page?: number;
  type?: PostType;
}

export interface PostsResponse {
  remainingCount: number;
  remainingPages: number;
  count: number;
  posts: Post[];
}
