import { Document, model } from "mongoose";
import { Schema, Types } from "mongoose";

const PostSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user Id"],
    },
    text: {
      type: String,
      maxLength: [500, "Your post cannot exceeds 500 characters."],
      trim: true,
      required: false,
    },
    type: {
      type: String,
      enum: ["post", "repost", "reply"],
      default: "post",
      required: [true, "Please provide a post type."],
    },
    originalPostId: {
      type: Types.ObjectId,
      ref: "Post",
      required: false,
    },
    attachmentId: {
      type: Types.ObjectId,
      ref: "Attachment",
      required: false,
    },
  },
  { timestamps: true }
);

PostSchema.methods.toJSON = function (): any {
  return {
    id: this._id,
    userId: this.userId,
    text: this.text,
    type: this.type,
    originalPostId: this.postId,
    attachmentId: this.attachmentId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

interface PostDocument extends Document {
  userId: Types.ObjectId;
  text?: string;
  type: PostType;
  originalPostId?: Types.ObjectId;
  attachmentId?: Types.ObjectId;
  toJSON: () => any;
}

enum PostType {
  post = "post",
  repost = "repost",
  reply = "reply",
}

export default model<PostDocument>("Post", PostSchema);
