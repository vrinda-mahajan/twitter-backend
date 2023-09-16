import { Request as ExpressRequest } from "express";
import {
  Body,
  Controller,
  Get,
  OperationId,
  Path,
  Post,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";
import { StatusCodes } from "http-status-codes";
import ProfileService from "../services/profile-service";
import { Profile } from "../services/models/profile-model";
import { NoPhotoUploadedError } from "../errors";

@Route("/api/v1/profile")
@Tags("Profile")
export class ProfileController extends Controller {
  @Response(StatusCodes.OK)
  @Get("info/{userId}")
  @OperationId("getProfile")
  @Security("jwt")
  public async get(@Path() userId: string): Promise<Profile> {
    this.setStatus(StatusCodes.OK);
    return new ProfileService().get(userId);
  }

  @Response(StatusCodes.OK)
  @Post("info")
  @OperationId("setProfile")
  @Security("jwt")
  public async setProfile(
    @Request() request: ExpressRequest,
    @Body() requestBody: Profile
  ): Promise<Profile> {
    this.setStatus(StatusCodes.OK);
    const user = request.user as { id: string };
    return new ProfileService().set(user.id, requestBody);
  }

  @Post("photo")
  @OperationId("setProfilePhoto")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.BAD_REQUEST, "No photo uploaded!")
  @Response(StatusCodes.BAD_REQUEST, "Invalid Mimetype!")
  public async setProfilePhoto(
    @Request() request: ExpressRequest
  ): Promise<void> {
    if (!request.files || Object.keys(request.files).length === 0) {
      throw new NoPhotoUploadedError();
    }
    this.setStatus(StatusCodes.OK);
    const user = request.user as { id: string };
    return new ProfileService().setPhoto(user.id, request as any);
  }
}
