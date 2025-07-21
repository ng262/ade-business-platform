import type { ZodError } from "zod";

export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  public issues?: ZodError;

  constructor(message = "Validation failed", issues?: ZodError) {
    super(message);
    this.name = "ValidationError";
    this.issues = issues;
  }
}

export class ApiError extends AppError {
  public status: number;

  constructor(message = "API request failed", status: number = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
