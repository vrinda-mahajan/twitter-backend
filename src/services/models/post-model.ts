export interface CreatePostParams {
  text: string;
  type: string;
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

export interface CreateReactionParams {
  type: ReactionType;
}
export interface Reaction {
  id: string;
  userId: string;
  postId: string;
  type: ReactionType;
}

export enum ReactionType {
  like = "like",
}

export interface Attachment {
  id: string;
  mimeType: string;
}

export interface PostAttachmentInfo {
  photoName: string;
  options: any;
}
