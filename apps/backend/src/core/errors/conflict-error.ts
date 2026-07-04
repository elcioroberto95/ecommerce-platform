export class ConflictError extends Error {
  public readonly statusCode = 409;

  constructor(message = 'Conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}