import { InvalidMimitypeError, UserProfileNotFoundError } from "../errors";
import Profile from "../db/models/profile";
import { Profile as ProfileModel } from "./models/profile-model";
import { UploadedFile } from "express-fileupload";
import {
  getProfilePhotoRootDir,
  getUserIdProfilePhotoPath,
} from "../controllers/utils";
import { mkdir } from "node:fs/promises";

export default class ProfileService {
  public async get(userId: string): Promise<ProfileModel> {
    try {
      const profile = await Profile.findOne({ userId });
      if (!profile) {
        throw new UserProfileNotFoundError();
      }
      return profile.toJSON() as ProfileModel;
    } catch {
      throw new UserProfileNotFoundError();
    }
  }
  public async set(
    userId: string,
    profileModel: ProfileModel
  ): Promise<ProfileModel> {
    const profile = await Profile.findOneAndUpdate(
      {
        userId,
      },
      {
        userId,
        bio: profileModel.bio,
        location: profileModel.location,
        website: profileModel.website,
      },
      { upsert: true, new: true, runValidators: true }
    );
    return profile.toJSON() as ProfileModel;
  }

  public async setPhoto(
    userId: string,
    req: { files: { photo: UploadedFile } }
  ): Promise<void> {
    const { photo } = req.files;
    if (photo.mimetype !== "image/jpeg") {
      console.log(photo.mimetype);
      throw new InvalidMimitypeError();
    }

    const uploadDir = getProfilePhotoRootDir();
    const uploadPath = getUserIdProfilePhotoPath(userId);

    return new Promise<void>(async (resolve, reject) => {
      try {
        await mkdir(uploadDir, { recursive: true });
        await photo.mv(uploadPath);
        resolve();
      } catch {
        reject();
      }
    });
  }
}
