import { Schema, Types, model } from "mongoose";

const ReactionSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "User id is required."],
    },
    postId: {
      type: Types.ObjectId,
      ref: "Post",
      required: [true, "Post id is required."],
    },
    type: {
      type: String,
      enum: ["like"],
      required: [true, "Please provide a reaction type."],
    },
  },
  { timestamps: true }
);

ReactionSchema.methods.toJSON = function (): any {
  return {
    id: this._id,
    userId: this.userId,
    postId: this.postId,
    type: this.type,
  };
};
interface ReactionDocument extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  type: ReactionType;
  toJSON: () => any;
}

enum ReactionType {
  like = "like",
}

export default model<ReactionDocument>("Reaction", ReactionSchema);
