import { ParsedQs } from "qs";
import { type ApiResponse } from "@shared/validation";
import { Express } from "express";

declare global {
  namespace Express {
    interface Request {
      validatedBody?: Record<string, any>;
      validatedQuery?: ParsedQs;
      validatedParams?: Record<string, SerialId>;
      validatedFile?: Express.Multer.File;
      validatedFiles?: Express.Multer.File[];
      user?: User;
    }

    interface Response {
      success: <T>(input: {
        status?: number;
        data: T;
        message?: string;
      }) => void;
      fail: (input: { status: number; errors?: any; message?: string }) => void;
    }
  }
}
