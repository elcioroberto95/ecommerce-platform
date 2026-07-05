export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational = true;

  constructor(message: string, statusCode = 400, code = 'APP_ERROR') {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace?.(this, this.constructor);
  }
}