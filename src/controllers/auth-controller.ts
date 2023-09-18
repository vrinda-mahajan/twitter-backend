import { StatusCodes } from "http-status-codes";
import {
  Body,
  Route,
  Delete,
  OperationId,
  Tags,
  Post,
  Request,
  Controller,
  Security,
} from "tsoa";
import {
  UserCreationParams,
  UserAndCredetials,
  LoginParams,
  RefreshParams,
} from "../services/models/auth-model";
import AuthService from "../services/auth-service";
import { Request as ExpressRequest } from "express";
import { AuthenticatedUser } from "../middleware/models/authenticated-users";

@Route("/api/v1/auth")
@Tags("Auth")
export class AuthController extends Controller {
  @Post("register")
  @OperationId("registerUser")
  public async register(
    @Body() requestBody: UserCreationParams
  ): Promise<UserAndCredetials> {
    this.setStatus(StatusCodes.CREATED);
    return new AuthService().register(requestBody);
  }

  @Post("login")
  @OperationId("loginUser")
  public async login(
    @Body() requestBody: LoginParams
  ): Promise<UserAndCredetials> {
    this.setStatus(StatusCodes.OK);
    return new AuthService().login(requestBody);
  }

  @Delete("logout")
  @OperationId("logoutUser")
  @Security("jwt")
  public async logout(@Request() request: ExpressRequest): Promise<void> {
    this.setStatus(StatusCodes.NO_CONTENT);
    const user = request.user as { jti: string };
    await new AuthService().logout(user.jti);
  }

  @Post("refresh")
  @OperationId("refreshUser")
  @Security("jwt_without_verification")
  public async refresh(
    @Request() request: ExpressRequest,
    @Body() requestBody: RefreshParams
  ): Promise<UserAndCredetials> {
    this.setStatus(StatusCodes.OK);
    const user = request.user as AuthenticatedUser;
    return await new AuthService().refresh(requestBody, user);
  }

  @Post("dummy")
  @OperationId("dummy")
  @Security("jwt")
  public async dummy(): Promise<void> {
    this.setStatus(StatusCodes.OK);
    return Promise.resolve();
  }
}
