import { UserProfileNotFoundError } from "../errors";
import Profile from "../db/models/profile";
import { Profile as ProfileModel } from "./models/profile-model";

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
}
