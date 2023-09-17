import { Document, Schema, Types, model } from "mongoose";

const AttachmentSchema = new Schema(
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
    mimeType: {
      type: String,
      required: [true, "Please provide a mimeType."],
    },
  },
  { timestamps: true }
);

AttachmentSchema.methods.toJSON = function (): any {
  return { id: this._id, mimeType: this.mimeType };
};

interface AttachmentDocument extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  mimeType: string;
  toJSON: () => any;
}

export default model<AttachmentDocument>("Attachment", AttachmentSchema);
