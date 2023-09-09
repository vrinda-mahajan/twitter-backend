import { StatusCodes } from "http-status-codes";
import { Body, Route, OperationId, Tags, Post, Controller } from "tsoa";
import {
  UserCreationParams,
  UserAndCredetials,
} from "../services/models/auth-model";
import AuthService from "../services/auth-service";

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
}
