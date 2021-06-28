export class BaseError extends Error {
  constructor(public readonly message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BaseError.prototype);

    Error.captureStackTrace(this);
  }
}
