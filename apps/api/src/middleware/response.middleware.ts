import { Request, Response, NextFunction } from "express";
import { SuccessResponse, FailResponse } from "@shared/validation";

export function responseHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.success = function <T>({
    status = 200,
    data,
    message = "OK",
  }: {
    status?: number;
    data: T;
    message?: string;
  }) {
    const body: SuccessResponse<T> = {
      success: true,
      data,
      message,
    };
    res.status(status).json(body);
  };

  res.fail = function ({
    status,
    message = "Error",
    errors,
  }: {
    status: number;
    message?: string;
    errors?: any;
  }) {
    const body: FailResponse = {
      success: false,
      message,
      errors,
    };
    res.status(status).json(body);
  };

  next();
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Uncaught Error:", err);
  res.fail({ status: 500, message: "Internal server error" });
}
