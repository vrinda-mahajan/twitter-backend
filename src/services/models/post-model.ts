export interface CreatePostParams {
  text: string;
  type: PostType;
  originalPostId?: string;
}

export interface Post {
  id: string;
  userId: string;
  text: string;
  type: PostType;
  attachmentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PostType {
  post = "post",
  repost = "repost",
  reply = "reply",
}
