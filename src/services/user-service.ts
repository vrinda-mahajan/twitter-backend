import { unlink } from "node:fs/promises";
import {
  DeleteUserResponse,
  SetUsernameParams,
  SetUsernameResponse,
} from "./models/user-models";
import { BadRequestError } from "../errors";
import User from "../db/models/user";
import Reaction from "../db/models/reaction";
import Attachment from "../db/models/attachment";
import Post from "../db/models/post";
import Follow from "../db/models/follow";
import Profile from "../db/models/profile";
import {
  getAttachmentPath,
  getUserIdProfilePhotoPath,
} from "../controllers/utils";

export default class UserService {
  public async setUsername(
    userId: string,
    params: SetUsernameParams
  ): Promise<SetUsernameResponse> {
    const user = await User.findByIdAndUpdate(
      userId,
      { username: params.username },
      { new: true, runValidators: true, select: "-password" }
    );
    if (!user) {
      throw new BadRequestError();
    }
    return { user: user.toJSON() };
  }

  public async deleteUser(userId: string): Promise<DeleteUserResponse> {
    const { deletedCount: reactionsDeleted } = await Reaction.deleteMany({
      userId,
    });

    const profilePhotoPath = getUserIdProfilePhotoPath(userId);
    try {
      await unlink(profilePhotoPath);
    } catch (err) {}

    const attachments = await Attachment.find({ userId });
    for (let attachment of attachments) {
      const attachmentPath = getAttachmentPath(attachment._id);
      try {
        await unlink(attachmentPath);
      } catch (err) {}
    }
    const { deletedCount: postsDeleted } = await Post.deleteMany({ userId });
    const { deletedCount: attachmentsDeleted } = await Attachment.deleteMany({
      userId,
    });
    const { deletedCount: followsDeleted } = await Follow.deleteMany({
      followerUserId: userId,
    });
    const { deletedCount: profilesDeleted } = await Profile.deleteOne({
      userId,
    });
    const { deletedCount: usersDeleted } = await User.deleteOne({
      _id: userId,
    });

    return {
      reactionsDeleted,
      postsDeleted,
      attachmentsDeleted,
      profilesDeleted,
      usersDeleted,
      followsDeleted,
    };
  }
}
