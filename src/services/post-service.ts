import {
  AttachmentNotFoundError,
  InternalServerError,
  InvalidInputError,
  InvalidMimitypeError,
  NoPhotoUploadedError,
  OriginalPostIdMissingError,
  PostNotFoundError,
  ReactionNotFoundError,
} from "../errors";
import Post from "../db/models/post";
import {
  CreatePostParams,
  CreateReactionParams,
  PostType,
  Reaction as TSOAReactionModel,
  Post as TSOAPostModel,
  Attachment as TSOAAttachmentModel,
  PostAttachmentInfo,
} from "./models/post-model";
import Reaction from "../db/models/reaction";
import { UploadedFile } from "express-fileupload";
import Attachment from "../db/models/attachment";
import {
  getAttachmentPath,
  getAttachmentPhotoName,
  getAttachmentRootDir,
} from "../controllers/utils";
import { mkdir, stat, unlink } from "node:fs/promises";
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

  public async unreactToPost(
    userId: string,
    postId: string
  ): Promise<TSOAReactionModel> {
    const reaction = await Reaction.findOneAndDelete({ userId, postId });
    if (!reaction) {
      throw new ReactionNotFoundError();
    }
    return reaction.toJSON() as TSOAReactionModel;
  }

  public async attachToPost(
    userId: string,
    postId: string,
    req: { files: { photo: UploadedFile } }
  ): Promise<TSOAAttachmentModel> {
    const post = await Post.findOne({ _id: postId, userId })
      .where("type")
      .in(["post", "reply"])
      .where("attachmentId")
      .equals(null);

    if (!post) {
      throw new PostNotFoundError();
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      throw new NoPhotoUploadedError();
    }

    const { photo } = req.files as unknown as { photo: UploadedFile };

    if (photo.mimetype !== "image/jpeg") {
      throw new InvalidMimitypeError();
    }

    const attachment = await Attachment.create({
      userId,
      postId,
      mimeType: photo.mimetype,
    });
    const attachmentId = attachment._id;
    const uploadRootDir = getAttachmentRootDir();
    const uploadPath = getAttachmentPath(attachmentId);

    try {
      await mkdir(uploadRootDir, { recursive: true });
      await photo.mv(uploadPath);
      post.attachmentId = attachmentId;
      await post.save();
      return attachment.toJSON() as TSOAAttachmentModel;
    } catch {
      await Attachment.findByIdAndDelete(attachmentId);
      throw new InternalServerError();
    }
  }

  public async getPostAttachment(postId: string): Promise<PostAttachmentInfo> {
    const post = await Post.findOne({ _id: postId })
      .where("attachmentId")
      .ne(null);
    if (!post) {
      throw new PostNotFoundError();
    }

    const attachment = await Attachment.findOne({ _id: post.attachmentId });
    if (!attachment) {
      throw new AttachmentNotFoundError();
    }

    const attachmentId = attachment._id;
    const photoPath = getAttachmentPath(attachmentId);

    try {
      const status = await stat(photoPath);
      const isFile = status.isFile();
      if (!isFile) {
        throw new Error();
      }
      const photoName = getAttachmentPhotoName(attachmentId);
      const options = {
        root: getAttachmentRootDir(),
        dotfiles: "deny",
        headers: {
          "x-timestamp": Date.now(),
          "x-sent": true,
        },
      };
      return { photoName, options };
    } catch {
      throw new AttachmentNotFoundError();
    }
  }

  public async deletePost(
    userId: string,
    postId: string
  ): Promise<TSOAPostModel> {

    const post = await Post.findOne({ userId:userId, _id:postId });
    if (!post) {
      throw new PostNotFoundError();
    }

    await Post.deleteMany({
      originalPostId: postId,
      type: "repost",
      text: null,
    });

    const attachmentId = post.attachmentId;
    if (attachmentId) {
      const path = getAttachmentPath(attachmentId.toString());
      try {
        await unlink(path);
      } catch {}
    }

    await Post.findByIdAndDelete(postId);
    return post.toJSON() as TSOAPostModel;
  }
}
