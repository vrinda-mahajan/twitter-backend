import { Document, model, Schema } from "mongoose";

enum BlacklistKind {
  jti = "jti",
  token = "token",
  refresh = "refresh",
}

const BlacklistSchema = new Schema(
  {
    object: {
      type: String,
      required: [true, "Please provide an object."],
      unique: true,
    },
    kind: {
      type: String,
      enum: ["jti", "token", "refresh"],
      default: "jti",
      required: [true, "Please provide a kind."],
    },
  },
  { timestamps: true }
);

export interface BlacklistDocument extends Document {
  object: string;
  kind: BlacklistKind;
}

export default model<BlacklistDocument>("Blacklist", BlacklistSchema);
