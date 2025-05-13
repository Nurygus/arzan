import HttpStatus, { BAD_REQUEST } from "http-status/lib";

class ValidationError extends Error {
  readonly status: boolean;
  readonly message: string;

  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);

    this.status = false;
    this.message = HttpStatus[BAD_REQUEST] as string;

    Error.captureStackTrace(this);
  }
}

export default ValidationError;
