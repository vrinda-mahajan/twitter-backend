export class CustomApiError extends Error {
  statuscode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statuscode = statusCode;
  }
}
